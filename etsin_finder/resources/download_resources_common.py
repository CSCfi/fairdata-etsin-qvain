"""Common download functionalities. Metax access defined by child classes."""
from flask import current_app, request
from flask.views import MethodView
from flask_mail import Message
from webargs import fields, validate

from etsin_finder.services.download_service import DownloadAPIService
from etsin_finder.utils.log_utils import log_request
from etsin_finder.utils.abort import abort
from etsin_finder.utils.parser import parser
from etsin_finder.log import log
from etsin_finder.utils.localization import get_language, default_language, translate
from etsin_finder.utils.constants import PACKAGE_SIZE_LIMIT

def check_download_permission(self, cr_id):
    """Placeholder for debugging"""
    abort(500, description="Download permission check not implemented.")


def get_pid_for_email_common(self, cr_id):
    """Placeholder for debugging"""
    abort(500, description="Dataset pid check not implemented.")


def send_email(language, cr_id, scope, email, pref_id):
    """Send package notification email."""
    if not scope:
        scope = ["/"]
    with current_app.mail.record_messages() as outbox:
        try:
            log.info(f"Sending notification mail for dataset {cr_id}")
            sender = current_app.config.get("MAIL_DEFAULT_SENDER")
            domain = current_app.config.get("SERVER_ETSIN_DOMAIN_NAME")
            data_url = f"https://{domain}/dataset/{cr_id}/data?show={scope[0]}"
            recipients = [email]
            context = dict(folder=scope[0], pref_id=pref_id, data_url=data_url)
            subject = translate(
                language, "etsin.download.notification.subject", context
            )
            if scope == ["/"]:
                body = translate(
                    language, "etsin.download.notification.body.full", context
                )
            else:
                body = translate(
                    language, "etsin.download.notification.body.partial", context
                )
            msg = Message(
                recipients=recipients,
                sender=sender,
                reply_to=sender,
                subject=subject,
                body=body,
            )
            current_app.mail.send(msg)
            if len(outbox) != 1:
                raise Exception
        except Exception as e:
            log.error(f"Failed to send notification email: {repr(e)}")
            return abort(500, message=repr(e))


def package_already_created(error):
    """Check if error is due to package being already created."""
    if not isinstance(error, dict):
        return False

    status_conflict = error.get("name") == "Conflict"
    status_success = "SUCCESS" in error.get("error", "")
    return status_conflict and status_success


class PackageRequests(MethodView):
    """Parent view for generating requests for getting and creating packages. Child classes direct queries to correct Metax."""

    check_permission = check_download_permission

    def get_package_byte_size(self, cr_id, path):
        """Placeholder method, overridden by child class."""
        abort(500, description="Package size check not implemented.")

    @log_request
    def get(self):
        """Get download package requests.

        Args:
            cr_id (str): Dataset identifier.

        Returns:
            Response from download service.

        """
        args = parser.parse(
            {"cr_id": fields.Str(required=True, validate=validate.Length(min=1))},
            request,
        )
        cr_id = args.get("cr_id")
        self.check_permission(cr_id)
        download_service = DownloadAPIService(current_app)
        return download_service.get_requests(cr_id)

    @log_request
    def post(self):
        """Create download package request.

        Args:
            cr_id (str): Dataset identifier.
            scope (list of str): Paths to be included (if not defined, include all files).

        Returns:
            Response from download service.

        """
        args = parser.parse(
            {
                "cr_id": fields.Str(required=True, validate=validate.Length(min=1)),
                "scope": fields.List(fields.Str()),
            },
            request,
        )
        cr_id = args.get("cr_id")
        path = args.get("scope")

        self.check_permission(cr_id)

        byte_size = self.get_package_byte_size(cr_id, path)

        if byte_size > PACKAGE_SIZE_LIMIT:
            abort(400, message="Package is too large.")

        download_service = DownloadAPIService(current_app)
        return download_service.post_request(cr_id, path)


class Authorize(MethodView):
    """Parent view for generating a download url. Child classes direct queries to correct Metax."""

    check_permission = check_download_permission

    @log_request
    def post(self):
        """
        Authorize file or package for download.

        Args:
            cr_id (str): Dataset identifier
            file (str): File path
            package (str): Package name

        Returns:
            Object with the dowload URL, or error from download service.

        """
        args = parser.parse(
            {
                "cr_id": fields.Str(required=True, validate=validate.Length(min=1)),
                "file": fields.Str(),
                "package": fields.Str(),
            },
            request,
        )
        file = args.get("file")
        package = args.get("package")

        if not (file or package):
            abort(
                400,
                message="Either 'file' or 'package' json_or_query parameter required",
            )
        if file and package:
            abort(400, message="Specify either 'file' or 'package', not both")

        cr_id = args.get("cr_id")
        self.check_permission(cr_id)

        download_service = DownloadAPIService(current_app)
        resp, status = download_service.authorize(cr_id, file=file, package=package)
        if status != 200:
            return resp, status

        token = resp.get("token")
        if not token:
            abort(500, message="Token missing from response")

        return {"url": download_service.get_download_url(token)}


class Subscriptions(MethodView):
    """Parent view for subscribing to package ready -notifications. Child classes direct queries to correct Metax."""

    check_permission = check_download_permission
    get_pid_for_email = get_pid_for_email_common

    @log_request
    def post(self):
        """Subscribe to package ready notification.

        Args:
            cr_id (str): Dataset identifier.
            scope (list of str): Paths to be included (optional).
            email (str): Notification email address.

        Returns:
            Empty response, or error if unsuccessful.

        """
        args = parser.parse(
            {
                "cr_id": fields.Str(required=True, validate=validate.Length(min=1)),
                "scope": fields.List(fields.Str()),
                "email": fields.Email(required=True),
            },
            request,
        )
        cr_id = args.get("cr_id")
        self.check_permission(cr_id)

        scope = args.get("scope")
        email = args.get("email")
        language = get_language()

        download_service = DownloadAPIService(current_app)

        try:
            payload = download_service.encode_notification(
                {
                    "cr_id": cr_id,
                    "scope": scope,
                    "email": email,
                    "language": language,
                }
            )
        except Exception as e:
            log.warning(f"Notifications: Encoding payload failed, {e}")
            abort(500, message="Encoding payload failed")

        resp, status = download_service.subscribe(cr_id, scope, payload)
        if status == 200 or status == 201:
            return "", status

        # Error due to package being already created, send mail immediately
        if package_already_created(resp):
            pid = self.get_pid_for_email(cr_id)
            send_email(language, cr_id, scope, email, pid)
            return "", 200
        return resp, status


class Notifications(MethodView):
    """Parent view for sending a package notification. Child classes direct queries to correct Metax."""

    get_pid_for_email = get_pid_for_email_common

    @log_request
    def post(self):
        """Send an email notification for a package ready for download.

        Args:
            subscriptionData (str): Encrypted payload as created by Subscriptions.post().

        Returns:
            Empty response, or error if unsuccessful.

        """
        args = parser.parse(
            {
                "subscriptionData": fields.Str(required=True),
            },
            request,
        )
        payload_encoded = args.get("subscriptionData")
        try:
            download_service = DownloadAPIService(current_app)
            payload = download_service.decode_notification(payload_encoded)
        except Exception as e:
            log.warning(f"Notifications: Decoding payload failed, {e}")
            abort(400, message="Decoding payload failed")

        cr_id = payload.get("cr_id")
        scope = payload.get("scope") or ["/"]
        email = payload["email"]
        language = payload.get("language", default_language)
        pid = self.get_pid_for_email(cr_id)
        send_email(language, cr_id, scope, email, pid)

        return "", 200


class Status(MethodView):
    """Class for checking download service status."""

    @log_request
    def get(self):
        """Request status of download service

        Returns:
            Status text. Status code is 200 if downloads are available.

        """
        download_service = DownloadAPIService(current_app)

        _, status = download_service.status()
        if status != 200:
            return "Downloads are not currently available.", 503
        return "Downloads are available.", 200
