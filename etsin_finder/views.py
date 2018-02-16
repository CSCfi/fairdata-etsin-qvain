from etsin_finder.finder import app, mail
from flask import render_template, jsonify, request, Response
from etsin_finder.metax_api import MetaxAPIService
from etsin_finder.utils import get_metax_api_config, strip_catalog_record
from flask_mail import Message

log = app.logger
metax_service = MetaxAPIService(get_metax_api_config(app.config))


# This route is used by React app
@app.route('/', defaults={'path': ''})
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
    cr = metax_service.get_catalog_record(dataset_id)
    log.info(cr)
    return jsonify(strip_catalog_record(cr))


# This route is used to send email message
@app.route('/api/dataset/<string:dataset_id>/contact', methods=['POST'])
def contact(dataset_id):
    """
    This route expects a json with three key-values: sender, subject and body.
    Having these three this method will send an email message to recipients
    defined in the catalog record in question

    :param dataset_id: id to use to fetch the record from metax
    :return: 200 if success
    """
    if not request.is_json or not request.json:
        return Response(status=400)

    # Extract user's email address (OR SHOULD THE SENDER BE THE PERSON OR THE APP?)
    sender = request.json.get('sender', None)
    # Extract message subject
    subject = request.json.get('subject', None)
    # Extract message body
    body = request.json.get('body', None)
    # Validate incoming request values are all there and are valid

    # Get the full catalog record from Metax
    cr = metax_service.get_catalog_record(dataset_id)
    # Get email addresses from cr to decide who to send the message to
    # but for now use fixed value
    recipients = ['test@test.fi']

    # Create the message
    msg = Message(sender=sender, recipients=recipients, subject=subject, body=body)

    # Send the message
    with mail.record_messages() as outbox:
        try:
            mail.send(msg)
        except Exception:
            log.error("Unable to send email message for {sender}".format(sender=[sender]))
            return Response(status=500)

    return Response(status=200)
