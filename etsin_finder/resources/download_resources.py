# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Download API endpoints."""

from flask_mail import Message

from flask import current_app, request, make_response
from flask.views import MethodView
from webargs import fields, validate

from etsin_finder.utils.parser import parser
from etsin_finder.utils.abort import abort
from etsin_finder.log import log
from etsin_finder.auth import authentication
from etsin_finder.auth import authorization
from etsin_finder.utils.localization import get_language, translate, default_language
from etsin_finder.services import cr_service, common_service
from etsin_finder.services.download_service import DownloadAPIService
from etsin_finder.utils.constants import PACKAGE_SIZE_LIMIT

from etsin_finder.utils.log_utils import log_request


def send_email(language, cr_id, scope, email):
    """Send notification email."""
    if not scope:
        scope = ["/"]
    try:
        cr = cr_service.get_catalog_record(cr_id, False, False)
        if not cr:
            log.warning(f"Notifications: Catalog record {cr_id} not found.")
            abort(404, message="Catalog record not found")
        pref_id = cr_service.get_catalog_record_preferred_identifier(cr)
    except Exception as e:
        log.error(e)
        abort(500, message=repr(e))

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
    if type(error) != dict:
        return False

    status_conflict = error.get("name") == "Conflict"
    status_success = "SUCCESS" in error.get("error", "")
    return status_conflict and status_success


def check_download_permission(cr_id):
    """Abort if user is not allowed to download files from dataset."""
    if not authorization.user_can_view_dataset(cr_id):
        abort(404)

    cr = cr_service.get_catalog_record(cr_id, False, False)
    if not cr:
        abort(400, description="Unable to get catalog record")

    allowed, reason = authorization.user_is_allowed_to_download_from_ida(
        cr, authentication.is_authenticated()
    )
    if not allowed:
        abort(403, message="Not authorized", reason=reason)
    return True


class Requests(MethodView):
    """Class for generating and retrieving download package requests."""

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
        check_download_permission(cr_id)
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
        check_download_permission(cr_id)

        projects, status = common_service.get_dataset_projects(cr_id)

        if status != 200:
            abort(
                status,
                message="Error occured when Etsin tried to fetch project details from Metax.",
            )
        if projects is None or len(projects) == 0:
            abort(
                404,
                message=f"Etsin could not find project for dataset using catalog record identifier {cr_id}",
            )

        project = projects[0]
        path = args.get("scope")

        directory_details, status = common_service.get_directory_for_project_using_path(
            cr_id, project, (path or ["/"])[0]
        )

        if status != 200:
            abort(
                status,
                message="Error occured when Etsin tried to fetch package details from Metax.",
            )

        byte_size = directory_details.get("results", {}).get("byte_size", None)

        if byte_size > PACKAGE_SIZE_LIMIT:
            abort(400, message="Package is too large.")

        download_service = DownloadAPIService(current_app)
        return download_service.post_request(cr_id, path)


class Authorize(MethodView):
    """Class for requesting download authorizations."""

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
        check_download_permission(cr_id)

        download_service = DownloadAPIService(current_app)
        resp, status = download_service.authorize(cr_id, file=file, package=package)
        if status != 200:
            return resp, status

        token = resp.get("token")
        if not token:
            abort(500, message="Token missing from response")

        return {"url": download_service.get_download_url(token)}


class Subscriptions(MethodView):
    """Class for subscribing to package creation emails."""

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
        check_download_permission(cr_id)

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
            send_email(language, cr_id, scope, email)
            return "", 200
        return resp, status


class Notifications(MethodView):
    """Email notification sending."""

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
        send_email(language, cr_id, scope, email)

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
