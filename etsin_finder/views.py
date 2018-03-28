from flask import render_template, jsonify, request, Response
from flask_mail import Message

from etsin_finder.app_config import get_app_config
from etsin_finder.finder import app, mail
from etsin_finder.metax_api import MetaxAPIService
from etsin_finder.email_utils import \
    create_email_message_body, \
    get_email_info, \
    get_email_message_subject, \
    get_email_recipient_address, \
    validate_send_message_request
from etsin_finder.utils import \
    get_metax_api_config, \
    strip_catalog_record

log = app.logger
metax_service = MetaxAPIService(get_metax_api_config(app.config))


# This route is used by React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def frontend_app(path):
    return render_template('index.html', title='Front Page')


# This route is used to get dataset from Metax for the frontend
# TODO: Change frontend app to use this in case sensitive info cannot otherwise be hidden
@app.route('/api/dataset/<string:dataset_id>', methods=['GET'])
def get_dataset(dataset_id):
    """
    Get dataset from metax and strip it from having sensitive information

    :param dataset_id: id to use to fetch the record from metax
    :return:
    """
    cr = metax_service.get_catalog_record_with_file_details(dataset_id) or metax_service.get_removed_catalog_record(dataset_id)
    if not cr:
        return Response(status=400)

    return jsonify({'catalog_record': strip_catalog_record(cr), 'email_info': get_email_info(cr)})


# This route is used to send email message
@app.route('/api/dataset/<string:dataset_id>/contact', methods=['POST'])
def send_message_to_contact(dataset_id):
    """
    This route expects a json with three key-values: user_email, user_subject and user_body.
    Having these three this method will send an email message to recipients
    defined in the catalog record in question

    :param dataset_id: id to use to fetch the record from metax
    :return: 200 if success
    """
    if not request.is_json or not request.json:
        return Response(status=400)

    # Extract user's email address to be used as reply-to address
    user_email = request.json.get('user_email', None)
    # Extract user's message subject to be used as part of the email body to be sent
    user_subject = request.json.get('user_subject', None)
    # Extract user's message body to be used as part of the email body to be sent
    user_body = request.json.get('user_body', None)
    # Extract recipient role
    recipient_agent_role = request.json.get('agent_type')
    # Validate incoming request values are all there and are valid
    if not validate_send_message_request(user_email, user_subject, user_body, recipient_agent_role):
        return Response(status=400)

    # Get the full catalog record from Metax
    cr = metax_service.get_catalog_record_with_file_details(dataset_id)
    # Get the chose email recipient
    recipient = get_email_recipient_address(cr, recipient_agent_role)
    if not recipient:
        return Response(status=500)

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
            return Response(status=500)

    return Response(status=200)
