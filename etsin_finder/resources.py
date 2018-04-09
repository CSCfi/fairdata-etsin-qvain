from flask_mail import Message
from flask_restful import abort, reqparse, Resource

from etsin_finder.app_config import get_app_config
from etsin_finder.finder import app, mail
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
