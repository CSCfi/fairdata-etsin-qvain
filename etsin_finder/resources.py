from requests import get

from flask import session, Response, stream_with_context
from flask_mail import Message
from flask_restful import abort, reqparse, Resource

from etsin_finder.app_config import get_app_config
from etsin_finder.finder import app, mail, api
from etsin_finder.metax_api import MetaxAPIService
from etsin_finder.email_utils import \
    create_email_message_body, \
    get_email_info, \
    get_email_message_subject, \
    get_email_recipient_address, \
    get_harvest_info, \
    validate_send_message_request
from etsin_finder.utils import \
    get_metax_api_config, \
    strip_catalog_record
from etsin_finder.views import is_authenticated, reset_flask_session_on_logout

log = app.logger
metax_service = MetaxAPIService(get_metax_api_config(app.config))


class Dataset(Resource):

    def get(self, dataset_id):
        """
        Get dataset from metax and strip it from having sensitive information

        :param dataset_id: id to use to fetch the record from metax
        :return:
        """
        cr = metax_service.get_catalog_record_with_file_details(dataset_id) or metax_service.get_removed_catalog_record(
            dataset_id)
        if not cr:
            abort(400, message="Unable to get catalog record from Metax")

        return {'catalog_record': strip_catalog_record(cr), 'email_info': get_email_info(cr)}, 200


class Files(Resource):

    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('dir_id', required=True, type=str)

    def get(self, dataset_id):
        args = self.parser.parse_args()
        dir_id = args['dir_id']

        resp = metax_service.get_directory_for_catalog_record(dataset_id, dir_id)
        if not resp:
            return '', 404

        return resp, 200


class Contact(Resource):

    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('user_email', required=True, help='user_email cannot be empty')
        self.parser.add_argument('user_subject', required=True, help='user_subject cannot be empty')
        self.parser.add_argument('user_body', required=True, help='user_body cannot be empty')
        self.parser.add_argument('agent_type', required=True, help='agent_type cannot be empty')

    def post(self, dataset_id):
        """
        This route expects a json with three key-values: user_email, user_subject and user_body.
        Having these three this method will send an email message to recipients
        defined in the catalog record in question

        :param dataset_id: id to use to fetch the record from metax
        :return: 200 if success
        """
        # if not request.is_json or not request.json:
        #     abort(400, message="Request is not json")

        # Check request query parameters are present
        args = self.parser.parse_args()
        # Extract user's email address to be used as reply-to address
        user_email = args['user_email']
        # Extract user's message subject to be used as part of the email body to be sent
        user_subject = args['user_subject']
        # Extract user's message body to be used as part of the email body to be sent
        user_body = args['user_body']
        # Extract recipient role
        recipient_agent_role = args['agent_type']

        # Validate incoming request values are all there and are valid
        if not validate_send_message_request(user_email, user_body, recipient_agent_role):
            abort(400, message="Request parameters are not valid")

        # Get the full catalog record from Metax
        cr = metax_service.get_catalog_record_with_file_details(dataset_id)

        # Ensure dataset is not harvested
        harvested = get_harvest_info(cr)
        if harvested:
            abort(400, message="Contact form is not available for harvested datasets")

        # Get the chose email recipient
        recipient = get_email_recipient_address(cr, recipient_agent_role)
        if not recipient:
            abort(500, message="No recipient could be inferred from the dataset")

        app_config = get_app_config()
        sender = app_config.get('MAIL_DEFAULT_SENDER', 'etsin-no-reply@fairdata.fi')
        subject = get_email_message_subject()
        body = create_email_message_body(dataset_id, user_email, user_subject, user_body)

        # Create the message
        msg = Message(sender=sender, reply_to=user_email, recipients=[recipient], subject=subject, body=body)

        # Send the message
        with mail.record_messages() as outbox:
            try:
                mail.send(msg)
                if len(outbox) != 1:
                    raise Exception
            except Exception as e:
                log.error("Unable to send email message".format(sender=[user_email]))
                log.error(e)
                abort(500, message="Sending email failed")

        return '', 204


class User(Resource):

    """
    Cf. saml attributes: https://wiki.eduuni.fi/display/CSCHAKA/funetEduPersonSchema2dot2
    OID 1.3.6.1.4.1.5923.1.1.1.6 = eduPersonPrincipalName
    OID 2.5.4.3 = cn / commonName
    """

    def get(self):
        is_auth = is_authenticated()
        user_info = {'is_authenticated': is_auth}
        if is_auth:
            eppn = session['samlUserdata'].get('urn:oid:1.3.6.1.4.1.5923.1.1.1.6', False)[0]
            cn = session['samlUserdata'].get('urn:oid:2.5.4.3', False)[0]
            if not eppn or not cn:
                log.warn("User seems to be authenticated but eppn or cn not in session object. "
                         "Saml userdata:\n{0}".format(session['samlUserdata']))
            else:
                user_info.update({
                    'user_id': eppn,
                    'user_display_name': cn
                })

        return user_info, 200


class Session(Resource):

    """
    Session related
    """

    def get(self):
        if is_authenticated():
            session.modified = True
            return '', 200
        return '', 401

    def delete(self):
        reset_flask_session_on_logout()
        return not is_authenticated(), 200


class Download(Resource):

    """
    Generic class for download functionalities
    """

    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('cr_id', type=str, required=True)
        self.parser.add_argument('file_id', type=str, action='append', required=False)
        self.parser.add_argument('dir_id', type=str, action='append', required=False)

    def create_url(self, base_url):
        # Check request query parameters are present
        args = self.parser.parse_args()
        cr_id = args['cr_id']
        file_ids = args['file_id'] or []
        dir_ids = args['dir_id'] or []

        log.debug("Received cr_id: " + str(cr_id))
        log.debug("Received file ids: " + str(file_ids))
        log.debug("Received dir ids: " + str(dir_ids))

        url = base_url.format(cr_id)
        if file_ids or dir_ids:
            params = ''
            for file_id in file_ids:
                params += '&file={0}'.format(file_id) if params else 'file={0}'.format(file_id)
            for dir_id in dir_ids:
                params += '&dir={0}'.format(dir_id) if params else 'dir={0}'.format(dir_id)
            url += '?' + params
        log.debug("Download service URL to be requested: " + url)
        return url


class OpenDownload(Download):

    """
    API for downloading open files
    """

    DOWNLOAD_URL = 'https://download.fairdata.fi/api/v1/dataset/{0}'

    def get(self):
        url = self.create_url(self.DOWNLOAD_URL)
        # req = get(url, stream=True)
        req = get('https://aaronkala.github.io/file-storage/image.jpg.zip', stream=True)
        res = Response(response=stream_with_context(req.iter_content(chunk_size=1024)), status=req.status_code)
        res.headers['Content-Type'] = 'application/octet-stream'
        res.headers['Content-Disposition'] = 'attachment; filename="dataset.zip"'
        res.headers['Content-Length'] = req.headers['Content-Length']
        return res


class RestrictedDownload(Download):

    """
    API for downloading restricted files
    """

    DOWNLOAD_URL = 'N/A'

    def get(self):
        # TODO: Do checks whether user is allowed to download
        # Check if is authenticated and also rems access permission. Maybe implement an API for frontend to ask
        # whether auth user is authorized to download as well (before requesting this api)
        if not is_authenticated():
            return '', 401

        # url = self.create_url(self.DOWNLOAD_URL)
        # req = get(url, stream=True)
        # res = Response(response=stream_with_context(req.iter_content(chunk_size=1024)), status=req.status_code)
        # res.headers['Content-Type'] = 'application/octet-stream'
        # res.headers['Content-Disposition'] = 'attachment; filename="dataset.zip"'
        # res.headers['Content-Length'] = req.headers['Content-Length']
        # return res
        return '', 501
