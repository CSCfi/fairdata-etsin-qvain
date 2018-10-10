# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

from flask import session
from flask_mail import Message
from flask_restful import abort, reqparse, Resource

from etsin_finder.app_config import get_app_config
from etsin_finder.authentication import \
    get_user_display_name, \
    is_authenticated, \
    reset_flask_session_on_logout
from etsin_finder.authorization import \
    strip_information_from_catalog_record, \
    strip_dir_api_object, \
    user_is_allowed_to_download_from_ida
from etsin_finder.cr_service import \
    get_catalog_record, \
    get_directory_data_for_catalog_record
from etsin_finder.download_api import DownloadAPIService
from etsin_finder.email_utils import \
    create_email_message_body, \
    get_email_info, \
    get_email_message_subject, \
    get_email_recipient_address, \
    get_harvest_info, \
    validate_send_message_request
from etsin_finder.finder import app, mail
from etsin_finder.utils import get_download_api_config


log = app.logger


class Dataset(Resource):

    def get(self, cr_id):
        """
        Get dataset from metax and strip it from having sensitive information

        :param cr_id: id to use to fetch the record from metax
        :return:
        """
        cr = get_catalog_record(cr_id, True, True)
        if not cr:
            abort(400, message="Unable to get catalog record from Metax")

        return {'catalog_record': strip_information_from_catalog_record(cr, is_authenticated()),
                'email_info': get_email_info(cr)}, 200


class Files(Resource):

    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('dir_id', required=True, type=str)
        self.parser.add_argument('file_fields', required=False, type=str)
        self.parser.add_argument('directory_fields', required=False, type=str)

    def get(self, cr_id):
        args = self.parser.parse_args()
        dir_id = args['dir_id']
        file_fields = args.get('file_fields', None)
        directory_fields = args.get('directory_fields', None)

        cr = get_catalog_record(cr_id, False, False)
        dir_api_obj = get_directory_data_for_catalog_record(cr_id, dir_id, file_fields, directory_fields)
        if cr and dir_api_obj:
            strip_dir_api_object(dir_api_obj, is_authenticated(), cr)
            return dir_api_obj, 200
        return '', 404


class Contact(Resource):

    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('user_email', required=True, help='user_email cannot be empty')
        self.parser.add_argument('user_subject', required=True, help='user_subject cannot be empty')
        self.parser.add_argument('user_body', required=True, help='user_body cannot be empty')
        self.parser.add_argument('agent_type', required=True, help='agent_type cannot be empty')

    def post(self, cr_id):
        """
        This route expects a json with three key-values: user_email, user_subject and user_body.
        Having these three this method will send an email message to recipients
        defined in the catalog record in question

        :param cr_id: id to use to fetch the record from metax
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
        cr = get_catalog_record(cr_id, False, False)

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
        body = create_email_message_body(cr_id, user_email, user_subject, user_body)

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
        user_info = {'is_authenticated': is_authenticated()}
        dn = get_user_display_name()
        if dn is not None:
            user_info['user_display_name'] = dn
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
    Class for file download functionalities
    """

    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('cr_id', type=str, required=True)
        self.parser.add_argument('file_id', type=str, action='append', required=False)
        self.parser.add_argument('dir_id', type=str, action='append', required=False)
        self.dl_api = DownloadAPIService(get_download_api_config(app.config))

    def get(self):
        # Check request query parameters are present
        args = self.parser.parse_args()
        cr_id = args['cr_id']

        cr = get_catalog_record(cr_id, False, False)
        if not cr:
            abort(400, message="Unable to get catalog record")

        if user_is_allowed_to_download_from_ida(cr, is_authenticated()):
            file_ids = args['file_id'] or []
            dir_ids = args['dir_id'] or []
            return self.dl_api.download(cr_id, file_ids, dir_ids)
        else:
            abort(403, message="Not authorized")
