# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""RESTful API endpoints, meant to be used by Qvain form."""

from etsin_finder.services.qvain_lock_service import QvainLockService
from marshmallow import ValidationError
from flask import request, current_app
from flask.views import MethodView
from flask_mail import Message
from webargs import fields

from etsin_finder.utils.abort import abort
from etsin_finder.utils.parser import parser
from etsin_finder.auth import authentication
from etsin_finder.log import log
from etsin_finder.utils.localization import get_language, translate, get_multilang_value

from etsin_finder.services import cr_service
from etsin_finder.services.ldap_service import LDAPIdmService
from etsin_finder.utils.flags import flag_enabled
from etsin_finder.utils.utils import datetime_to_header
from etsin_finder.schemas.qvain_dataset_schema_v2 import (
    validate,
    FileActionsValidationSchema,
    data_catalog_matcher,
)
from etsin_finder.utils.qvain_utils import (
    data_to_metax,
    check_dataset_edit_permission,
    check_dataset_edit_permission_and_lock,
    check_authentication,
    edited_data_to_metax,
    get_access_granter,
    merge_and_sort_dataset_lists,
    add_sources,
    merge_metax_and_ldap_user_data,
    abort_on_fail,
    get_editor_source_func,
)

from etsin_finder.services.qvain_service import MetaxQvainAPIService
from etsin_finder.services.common_service import MetaxCommonAPIService

from etsin_finder.utils.log_utils import log_request


class FileCharacteristics(MethodView):
    """REST endpoint for updating file_characteristics of a file."""

    def _parse_args(self):
        return parser.parse(
            {
                "cr_identifier": fields.Str(),
            },
            request,
            location="query",
        )

    def _update_characteristics(self, file_id, replace=False):
        """Update file_characteristics of a file.

        Args:
            file_id (str): File identifier.

        Returns:
            Metax response.

        """
        if request.content_type != "application/json":
            return "Expected content-type application/json", 403

        service = MetaxQvainAPIService()
        file_obj = service.get_file(file_id)
        if not file_obj:
            return "Access denied or file not found", 404
        project_identifier = file_obj.get("project_identifier")
        user_ida_projects = authentication.get_user_ida_projects() or []

        allow_access = project_identifier in user_ida_projects

        # Allow updating file characteristics in dataset even if not project member
        args = self._parse_args()
        cr_id = args.get("cr_identifier")
        if cr_id:
            error = check_dataset_edit_permission(cr_id)
            if error is not None:
                return error
            if allow_access or service.get_dataset_file(cr_id, file_id) is not None:
                allow_access = True

        if not allow_access:
            log.warning(
                "User not authenticated or does not have access to project {0} for file {1}".format(
                    project_identifier, file_id
                )
            )
            return "Project missing from user or user is not authenticated", 403

        try:
            new_characteristics = request.json
        except Exception as e:
            return str(e), 400

        characteristics = file_obj.get("file_characteristics", {})

        # Make sure that only fields specified here are changed
        allowed_fields = {
            "file_format",
            "format_version",
            "encoding",
            "csv_delimiter",
            "csv_record_separator",
            "csv_quoting_char",
            "csv_has_header",
        }
        for key, value in new_characteristics.items():
            if (key not in characteristics) or (characteristics[key] != value):
                if key not in allowed_fields:
                    return "Changing field {} is not allowed".format(key), 400

        if replace:
            for key in allowed_fields:
                if key in characteristics:
                    del characteristics[key]

        # Update file_characteristics with new values
        characteristics.update(new_characteristics)
        data = {"file_characteristics": characteristics}

        return service.patch_file(file_id, data)

    @log_request
    def put(self, file_id):
        """Replace file_characteristics with supplied values."""
        return self._update_characteristics(file_id, replace=True)

    @log_request
    def patch(self, file_id):
        """Update file_characteristics with supplied values."""
        return self._update_characteristics(file_id)


class QvainDatasets(MethodView):
    """Listing and creating Metax datasets for logged in user in Qvain."""

    def _get_datasets_from_response(self, response, status, source):
        """Get datasets from response dict, add source information."""
        datasets = []
        if status != 200:
            user_id = authentication.get_user_csc_name()
            projects = authentication.get_user_ida_projects()
            log.warning(
                f"Failed to get datasets ({status})\nuser_id:{user_id}\nsource:{source}\nprojects:{projects}"
            )
            abort(status, message="Failed to get datasets")
        if type(response) is dict and response.get("results"):
            datasets = response.get("results")
        else:
            datasets = response
        add_sources(datasets, source)
        return datasets

    @log_request
    def get(self):
        """
        Get datasets for current user. Used by the Qvain dataset table. If request has query parameter no_pagination=true, fetches ALL datasets for user (warning: might result in performance issue).

        Used by the Qvain dataset table. If request has query parameter no_pagination=true,
        fetches ALL datasets for user (warning: might result in performance issue).

        Args:
            user_id (str): User identifier.

        Returns:
            tuple: Response with user datasets if successfull.

        """
        # Return data only if authenticated
        error = check_authentication()
        if error is not None:
            return error

        datasets = []
        user_id = authentication.get_user_csc_name()
        service = MetaxQvainAPIService()
        if not flag_enabled("PERMISSIONS.EDITOR_RIGHTS"):
            # Datasets listing parameters
            args = parser.parse(
                {
                    "limit": fields.Str(),
                    "offset": fields.Str(),
                    "no_pagination": fields.Boolean(),
                },
                request,
            )
            limit = args.get("limit", None)
            offset = args.get("offset", None)
            no_pagination = args.get("no_pagination", None)
            response, status = service.get_datasets_for_user(
                user_id,
                limit,
                offset,
                no_pagination,
                data_catalog_matcher=data_catalog_matcher,
            )
            datasets = self._get_datasets_from_response(response, status, "creator")
        else:
            # datasets from editor permissions
            response, status = service.get_datasets_for_editor(
                user_id,
                data_catalog_matcher=data_catalog_matcher,
            )
            datasets = self._get_datasets_from_response(
                response, status, get_editor_source_func(user_id)
            )

            # datasets from user projects
            projects = authentication.get_user_ida_projects()
            if projects:
                projects_response, status = service.get_datasets_for_projects(
                    projects=projects,
                    data_catalog_matcher=data_catalog_matcher,
                )
                datasets.extend(
                    self._get_datasets_from_response(
                        projects_response, status, "project"
                    )
                )
        datasets = merge_and_sort_dataset_lists(datasets)

        if datasets or type(datasets) is list:
            return datasets, 200

        log.warning(
            "User not authenticated or result for user_id is invalid\nuser_id: {0}".format(
                user_id
            )
        )
        return "", 404

    @log_request
    def post(self):
        """Create a dataset to Metax with the form data from the frontend.

        Returns:
            The response from metax or if error an error message.

        """
        error = check_authentication()
        if error is not None:
            return error

        params = {}

        args = parser.parse({"draft": fields.Boolean()}, request, location="query")
        draft = args.get("draft")
        if draft:
            params["draft"] = "true"

        try:
            data = validate(request.data, params)
        except ValidationError as err:
            log.warning("Invalid form data: {0}".format(err.messages))
            return err.messages, 400

        metadata_provider_org = authentication.get_user_home_organization_id()
        metadata_provider_user = authentication.get_user_csc_name()

        if not metadata_provider_org or not metadata_provider_user:
            log.warning("The Metadata provider is not specified\n")
            return {
                "PermissionError": "The Metadata provider is not found in login information."
            }, 401

        if data["use_doi"] is True:
            params["pid_type"] = "doi"

        metax_ready_data = data_to_metax(
            data, metadata_provider_org, metadata_provider_user
        )
        metax_ready_data["access_granter"] = get_access_granter()
        service = MetaxQvainAPIService()
        metax_response = service.create_dataset(metax_ready_data, params)
        return metax_response


class QvainDataset(MethodView):
    """Single Qvain dataset."""

    @log_request
    def get(self, cr_id):
        """
        Get dataset for editing from Metax. Returns with an error if the logged in user does not own the requested dataset.

        Arguments:
            cr_id {str} -- Identifier of dataset.

        Returns:
            [type] -- Metax response.

        """
        error = check_dataset_edit_permission(cr_id)
        if error is not None:
            return error

        service = MetaxQvainAPIService()
        response, status = service.get_dataset(cr_id)
        return response, status

    @log_request
    def patch(self, cr_id):
        """Update existing dataset.

        Returns:
            The response from metax or if error an error message.

        """
        params = {}
        error = check_dataset_edit_permission_and_lock(cr_id)
        if error is not None:
            return error

        try:
            data = validate(request.data, params)
        except ValidationError as err:
            log.warning("Invalid form data: {0}".format(err.messages))
            return err.messages, 400

        original = data.get("original")
        if not original:
            return {"Error": "Missing original dataset."}, 400
        del data["original"]

        original_cr_id = original.get("identifier")
        if cr_id != original_cr_id:
            return {"Error": "Changing dataset identifier is not allowed."}, 400

        # If date_modified not present, then the dataset has not been modified
        # after it was created, use date_created instead
        last_edit = original.get("date_modified") or original.get("date_created")

        log.debug(f"in patch: data: {data}")

        metax_ready_data = edited_data_to_metax(data, original)
        metax_ready_data["access_granter"] = get_access_granter()
        params = {}
        service = MetaxQvainAPIService()
        metax_response = service.update_dataset(
            metax_ready_data, cr_id, last_edit, params
        )
        log.debug("METAX RESPONSE: \n{0}".format(metax_response))

        # clear dataset from cache
        current_app.cr_cache.delete(cr_id)
        current_app.cr_permission_cache.delete(cr_id)
        return metax_response

    @log_request
    def delete(self, cr_id):
        """
        Delete dataset from Metax. Returns with an error if the logged in user does not own the requested dataset.

        Arguments:
            cr_id {str} -- Identifier of dataset.

        Returns:
            Metax response.

        """
        # only creator of the dataset is allowed to delete it
        error = check_dataset_edit_permission_and_lock(cr_id)
        if error is not None:
            return error

        service = MetaxQvainAPIService()
        metax_response = service.delete_dataset(cr_id)

        # clear dataset from cache
        current_app.cr_cache.delete(cr_id)
        current_app.cr_permission_cache.delete(cr_id)
        return metax_response


class QvainDatasetFiles(MethodView):
    """Update files of a dataset."""

    def __init__(self):
        """Init endpoint."""
        self.validationSchema = FileActionsValidationSchema()

    @log_request
    def post(self, cr_id):
        """Add or remove files for dataset.

        Arguments:
            cr_id (str): Identifier of dataset.

        Returns:
            Metax response.

        """
        error = check_dataset_edit_permission_and_lock(cr_id)
        if error is not None:
            return error

        try:
            data = self.validationSchema.loads(request.data)
        except ValidationError as err:
            log.warning("Invalid form data: {0}".format(err.messages))
            return err.messages, 400

        ida_projects = authentication.get_user_ida_projects()
        if ida_projects is None:
            return {
                "IdaError": "Error in IDA group user permission or in IDA user groups."
            }, 403

        # Make Metax check that files belong to projects that the user is allowed to use
        params = {"allowed_projects": ",".join(ida_projects)}

        service = MetaxQvainAPIService()
        response, status = service.update_dataset_files(cr_id, data, params)
        if status != 200:
            return response, status

        # adding or removing files may change permissions, clear them from cache
        current_app.cr_cache.delete(cr_id)
        current_app.cr_permission_cache.delete(cr_id)
        return response, status


class QvainDatasetLock(MethodView):
    """Endpoints for handling dataset write locks."""

    def __init__(self):
        """Initialize common for all methods."""
        if not flag_enabled("PERMISSIONS.WRITE_LOCK"):
            abort(405)

    def put(self, cr_id):
        """Request/refresh write lock for dataset.

        The response status code is 200 if successful, 409 otherwise.

        Arguments:
            cr_id {str} -- Identifier of dataset.
            force {bool} -- Attempt to get lock regardless of its current holder.

        Returns:
            lock {dict} -- lock object or {} if there is no lock currently

        """
        error = check_dataset_edit_permission(cr_id)
        if error is not None:
            return error

        args = parser.parse(
            {"force": fields.Boolean()},
            request,
        )
        force = args.get("force", None)

        lock_service = QvainLockService()
        success, data = lock_service.request_lock(cr_id, force)

        if success:
            return data, 200
        return data, 409

    def delete(self, cr_id):
        """Release write lock for dataset.

        Arguments:
            cr_id {str} -- Identifier of dataset.

        """
        error = check_dataset_edit_permission(cr_id)
        if error is not None:
            return error

        lock_service = QvainLockService()
        lock_service.release_lock(cr_id)
        return "", 200


class QvainDatasetEditorPermissions(MethodView):
    """Endpoints for dataset editor permissions."""

    def __init__(self):
        """Initialization common for all methods"""
        if not flag_enabled("PERMISSIONS.EDITOR_RIGHTS"):
            abort(405)

    @log_request
    def get(self, cr_id):
        """Get editor permissions for dataset.

        Arguments:
            cr_id {str} -- Identifier of dataset.

        Returns editor permission data as a dict:
            {
                project: project id if any
                users: [{
                    uid: username,
                    email: email address,
                    name: real name,
                    role: role,
                    is_project_member: True if user is member of project
                }, {...}]
            }

        """
        error = check_dataset_edit_permission(cr_id)
        if error is not None:
            return error

        # get user permission data from metax
        qvain_service = MetaxQvainAPIService()
        metax_user_data = abort_on_fail(
            qvain_service.get_dataset_editor_permissions_users(cr_id)
        )
        usernames = [user.get("user_id") for user in metax_user_data]

        # get project from metax
        common_service = MetaxCommonAPIService()
        projects = abort_on_fail(common_service.get_dataset_projects(cr_id))
        project = projects[0] if len(projects) > 0 else None

        # get project members and user data from ldap
        project_users = []
        with LDAPIdmService() as ldap_service:
            if project:
                project_users = abort_on_fail(ldap_service.get_project_users(project))
                usernames = list(set(usernames + project_users))
            ldap_user_data = abort_on_fail(ldap_service.get_users_details(usernames))

        users = merge_metax_and_ldap_user_data(
            usernames, project_users, metax_user_data, ldap_user_data
        )

        perms = {"users": users}
        if project:
            perms["project"] = project

        return perms, 200

    @log_request
    def post(self, cr_id):
        """Add editor permissions to dataset.

        Arguments:
            cr_id {str} -- Identifier of dataset.
            data {json} -- Array of usernames to give permission to.

        Returns operation success as dict:
            {
                users: [{
                    uid: username,
                    email: email address,
                    name: real name,
                    success: was adding permission successful,
                    status: status code
                }, {...}],
                {
                    success: was sending emails succssful
                }
            }
        """
        error = check_dataset_edit_permission(cr_id)
        if error is not None:
            return error

        args = parser.parse(
            {"users": fields.List(fields.Str()), "message": fields.Str()},
            request,
        )
        users = args.get("users")
        message = args.get("message")

        # verify that users exist in LDAP
        user_data = []
        with LDAPIdmService() as ldap_service:
            user_data = abort_on_fail(ldap_service.get_users_details(users))
            found_users = set(user.get("uid") for user in user_data)
            missing_users = list(set(users) - found_users)
            if len(missing_users) > 0:
                missing_users.sort()
                abort(400, message=f'Users not found: {", ".join(missing_users)}')

        service = MetaxQvainAPIService()
        for user in user_data:
            response, status = service.create_dataset_editor_permissions_user(
                cr_id, user.get("uid")
            )
            if status == 201:
                user.update({"success": True, "status": status})
            else:
                user.update({"success": False, "status": status})
                log.error(f"Creating permission failed: {response}")

        recipients = [
            {"uid": user.get("uid"), "email": user.get("email")}
            for user in user_data
            if user.get("email") and user.get("success")
        ]

        username = "{} {}".format(
            authentication.get_user_firstname(), authentication.get_user_lastname()
        )
        if len(username) < 2:
            username = authentication.get_user_csc_name()

        email_success = False
        if len(recipients) > 0:
            try:
                self._send_share_notification_email(
                    cr_id, sender_user=username, recipients=recipients, message=message
                )
                email_success = True
            except Exception as e:
                log.error(f"Failed to send share notification email: {repr(e)}")

        # clear permissions cache
        current_app.cr_cache.delete(cr_id)
        current_app.cr_permission_cache.delete(cr_id)
        return {"users": user_data, "email": {"success": email_success}}, 200

    def _send_share_notification_email(
        self, cr_id, sender_user, recipients, message=""
    ):
        """Send notification email."""
        message = message.strip()
        if len(message) > 0:
            message += "\n"
        language = get_language()
        title = ""
        try:
            cr = cr_service.get_catalog_record(cr_id, False, False)
            if not cr:
                log.warning(f"Notifications: Catalog record {cr_id} not found.")
                abort(404, message="Catalog record not found")
            title = (
                get_multilang_value(
                    language, cr.get("research_dataset", {}).get("title", {})
                )
                or cr_id
            )
        except Exception as e:
            log.error(e)
            abort(500, message=repr(e))

        with current_app.mail.record_messages() as outbox:
            log.info(f"Sending share notification mail for dataset {cr_id}")
            sender = current_app.config.get("MAIL_DEFAULT_SENDER")
            domain = current_app.config.get("SERVER_QVAIN_DOMAIN_NAME")
            qvain_url = f"https://{domain}/dataset/{cr_id}"
            for recipient in recipients:
                context = dict(
                    sender_user=sender_user,
                    recipient_uid=recipient.get("uid"),
                    title=title,
                    message=message,
                    qvain_url=qvain_url,
                )
                subject = translate(
                    language, "qvain.share.notification.subject", context
                )
                body = translate(language, "qvain.share.notification.body", context)
                msg = Message(
                    recipients=[recipient.get("email")],
                    sender=sender,
                    reply_to=sender,
                    subject=subject,
                    body=body,
                )
                current_app.mail.send(msg)
            if len(outbox) != len(recipients):
                raise Exception


class QvainDatasetEditorPermissionsUser(MethodView):
    """Endpoints for single user editor permission."""

    @log_request
    def delete(self, cr_id, user_id):
        """Delete editor permissions for a single user.

        Arguments:
            cr_id {str} -- Identifier of dataset.
            user_id {str} -- Username of user permission to remove.

        Returns:
            Metax response

        """
        error = check_dataset_edit_permission(cr_id)
        if error is not None:
            return error

        service = MetaxQvainAPIService()
        response, status = service.delete_dataset_editor_permissions_user(
            cr_id, user_id
        )
        # clear permissions cache
        current_app.cr_cache.delete(cr_id)
        current_app.cr_permission_cache.delete(cr_id)
        return response, status
