# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""RESTful API endpoints, meant to be used by the frontend."""

import re
from flask import session, current_app, request
from flask.views import MethodView
from flask_mail import Message
from webargs import fields, validate

from etsin_finder.utils.abort import abort
from etsin_finder.utils.parser import parser
from etsin_finder.auth import authentication
from etsin_finder.auth import authentication_direct_proxy
from etsin_finder.auth import authorization
from etsin_finder.services import cr_service
from etsin_finder.services.download_metadata_service import download_metadata
from etsin_finder.services import rems_service
from etsin_finder.services.common_service import (
    get_dataset_exists_by_preferred_identifier,
)
from etsin_finder.utils.contact_utils import (
    create_email_message_body,
    get_email_info,
    get_email_message_subject,
    get_email_recipient_addresses,
    get_harvest_info,
    validate_send_message_request,
)
from etsin_finder.log import log
from etsin_finder.utils.flags import get_supported_flags
from etsin_finder.utils.localization import get_language, set_language

from etsin_finder.utils.constants import PACKAGE_SIZE_LIMIT
from etsin_finder.utils.utils import sort_array_of_obj_by_key
from etsin_finder.utils.log_utils import log_request
from etsin_finder.app_config import (
    get_fairdata_rems_api_config,
)


class Dataset(MethodView):
    """Dataset related REST endpoints for frontend."""

    @log_request
    def get(self, cr_id):
        """Get dataset from metax and strip it from having sensitive information.

        Args:
            cr_id (str): Catalog record identifier.

        Returns:
            tuple: catalog record and a status code.

        """
        if not authorization.user_can_view_dataset(cr_id):
            abort(404)

        is_authd = authentication.is_authenticated()
        cr = cr_service.get_catalog_record(cr_id, True, True)
        if not cr:
            abort(400, message="Unable to get catalog record from Metax")

        if "draft_of" in cr:
            del cr["draft_of"]

        # Sort data items
        sort_array_of_obj_by_key(
            cr.get("research_dataset", {}).get("remote_resources", []), "title"
        )
        sort_array_of_obj_by_key(
            cr.get("research_dataset", {}).get("directories", []),
            "details",
            "directory_name",
        )
        sort_array_of_obj_by_key(
            cr.get("research_dataset", {}).get("files", []), "details", "file_name"
        )

        ret_obj = {
            "catalog_record": authorization.strip_information_from_catalog_record(
                cr, is_authd
            ),
            "email_info": get_email_info(cr),
        }
        if (
            cr_service.is_rems_catalog_record(cr)
            and is_authd
            and get_fairdata_rems_api_config() is not None
        ):
            user_id = authentication.get_user_id()
            state = rems_service.get_application_state_for_resource(cr, user_id)
            ret_obj["application_state"] = state
            ret_obj["has_permit"] = state == "approved"

        return ret_obj, 200


class V2Dataset(MethodView):
    """Metax API v2 dataset related REST endpoints for frontend."""

    @log_request
    def get(self, cr_id):
        """Get dataset from metax and strip it from having sensitive information.

        Args:
            cr_id (str): Catalog record identifier.

        Returns:
            tuple: catalog record and a status code.

        """
        if not authorization.user_can_view_dataset(cr_id):
            abort(404)

        is_authd = authentication.is_authenticated()
        cr = cr_service.get_catalog_record(cr_id, True, True)
        if not cr:
            abort(400, message="Unable to get catalog record from Metax")

        # Sort data items
        sort_array_of_obj_by_key(
            cr.get("research_dataset", {}).get("remote_resources", []), "title"
        )

        ret_obj = {
            "catalog_record": authorization.strip_information_from_catalog_record(
                cr, is_authd
            ),
            "email_info": get_email_info(cr),
        }
        if (
            cr_service.is_rems_catalog_record(cr)
            and is_authd
            and get_fairdata_rems_api_config() is not None
        ):
            user_id = authentication.get_user_id()
            state = rems_service.get_application_state_for_resource(cr, user_id)
            ret_obj["application_state"] = state
            ret_obj["has_permit"] = state == "approved"

        return ret_obj, 200


class DatasetMetadata(MethodView):
    """DatasetMetadata."""

    @log_request
    def get(self):
        """Download dataset metadata.

        Returns:
            obj: Returns a Flask.Response object streaming the response from metax
        """
        args = parser.parse(
            {
                "cr_id": fields.Str(required=True, validate=validate.Length(min=1)),
                "format": fields.Str(required=True, validate=validate.Length(min=1)),
            },
            request,
        )
        cr_id = args.get("cr_id")
        metadata_format = args.get("format")

        cr = cr_service.get_catalog_record(cr_id, False, False)
        if not cr:
            abort(400, message="Unable to get catalog record")

        if not authorization.user_can_view_dataset(cr_id):
            abort(404)

        need_auth = cr_service.is_draft(cr)
        return download_metadata(cr_id, metadata_format, need_auth=need_auth)


def _transform_url_to_persistent_id(url):
    doi_replaced = re.sub("^https://doi.org/", "doi:", url)
    urn_replaced = re.sub("^http://urn.fi/", "", doi_replaced)
    return urn_replaced


class RelatedDatasets(MethodView):
    """RelatedDatasets."""

    @log_request
    def get(self, cr_id):
        """Get all existing published dataset relations for a dataset.

        Returns:
            list: Returns a list of preferred identifiers of existing datasets.
                  that has relation to this dataset.
        """
        cr = cr_service.get_catalog_record(cr_id, True, False)
        if not cr:
            abort(400, message="Unable to get catalog record")

        if not authorization.user_can_view_dataset(cr_id):
            abort(404)

        identifiers = _get_catalog_record_relations_by_identifier(cr)
        existing_ids = _get_existing_identifiers(cr_id, identifiers)

        # map individual variations of identifiers into a list of dicts
        # variation represents user created relation or other identifier in dataset
        # one identifier can be mentioned multiple times in different context which makes this code
        # more complicated.
        response = [
            variation
            for variations in existing_ids.values()
            for variation in variations
        ]

        return response, 200


class Contact(MethodView):
    """Contact form related REST endpoints for frontend."""

    @log_request
    def post(self, cr_id):
        """Send email.

        This route expects a json with three key-values: user_email, user_subject and user_body.
        Having these three this method will send an email message to recipients
        defined in the catalog record in question

        Args:
            cr_id (str): Catalog record identifier

        Raises:
            Exception: Email sending failed.

        Returns:
            tuple: Payload and status code. If success, empty payload, else, an error message.

        """
        # Check request query parameters are present
        args = parser.parse(
            {
                "user_email": fields.Str(
                    required=True, validate=validate.Length(min=1)
                ),
                "user_subject": fields.Str(
                    required=True, validate=validate.Length(min=1)
                ),
                "user_body": fields.Str(required=True, validate=validate.Length(min=1)),
                "agent_type": fields.Str(
                    required=True, validate=validate.Length(min=1)
                ),
            },
            request,
        )
        # Extract user's email address to be used as reply-to address
        user_email = args.get("user_email")
        # Extract user's message subject to be used as part of the email body to be sent
        user_subject = args.get("user_subject")
        # Extract user's message body to be used as part of the email body to be sent
        user_body = args.get("user_body")
        # Extract recipient role
        recipient_agent_role = args.get("agent_type")

        # Validate incoming request values are all there and are valid
        if not validate_send_message_request(
            user_email, user_body, recipient_agent_role
        ):
            message = "Request parameters are not valid"
            log.warning(message)
            abort(400, message=message)

        if not authorization.user_can_view_dataset(cr_id):
            abort(404)

        # Get the full catalog record from Metax
        cr = cr_service.get_catalog_record(cr_id, False, False)

        # Ensure dataset is not harvested
        harvested = get_harvest_info(cr)
        if harvested:
            message = "Contact form is not available for harvested datasets"
            log.warning(message)
            abort(400, message=message)

        # Get the email recipients
        recipients = get_email_recipient_addresses(cr, recipient_agent_role)
        if not recipients:
            message = "No recipients could be inferred from the dataset"
            log.error(message)
            abort(500, message=message)

        app_config = current_app.config
        sender = app_config.get("MAIL_DEFAULT_SENDER", "etsin-no-reply@fairdata.fi")
        subject = get_email_message_subject()
        body = create_email_message_body(
            cr_service.get_catalog_record_preferred_identifier(cr),
            user_email,
            user_subject,
            user_body,
        )

        # Create the message
        msg = Message(
            sender=sender,
            reply_to=user_email,
            recipients=recipients,
            subject=subject,
            body=body,
        )

        # Send the message
        with current_app.mail.record_messages() as outbox:
            try:
                current_app.mail.send(msg)
                if len(outbox) != 1:
                    raise Exception
            except Exception as e:
                message = "Sending email failed"
                current_app.logger.error("{0}\n{1}\n{2}".format(message, msg, e))
                abort(500, message=message)
        log.debug("Sending email OK\n{0}".format(msg))
        return "", 204


class User(MethodView):
    """Saml attributes: https://wiki.eduuni.fi/pages/viewpage.action?spaceKey=cscfairdata&title=Proxy+Attributes."""

    @log_request
    def get(self):
        """Get (logged-in) user info.

        Returns:
            tuple: User info and status code.

        """
        user_info = {
            "is_authenticated": authentication.is_authenticated(),
            "is_authenticated_CSC_user": authentication.is_authenticated_CSC_user(),
            "home_organization_id": authentication.get_user_home_organization_id(),
            "home_organization_name": authentication.get_user_home_organization_name(),
        }
        csc_user = authentication.get_user_csc_name()
        first_name = authentication.get_user_firstname()
        last_name = authentication.get_user_lastname()
        groups = authentication.get_user_ida_projects() or []
        user_info["user_ida_projects"] = groups

        is_using_rems_response = get_fairdata_rems_api_config()
        is_using_rems = False

        if is_using_rems_response is not None:
            is_using_rems = is_using_rems_response.get("ENABLED", False)
        user_info["is_using_rems"] = is_using_rems

        if csc_user is not None:
            user_info["user_csc_name"] = csc_user
        if first_name:
            user_info["first_name"] = first_name
        if last_name:
            user_info["last_name"] = last_name
        return user_info, 200


class REMSApplyForPermission(MethodView):
    """REMS Apply for permission."""

    @log_request
    def get(self, cr_id):
        """Apply for permission to REMS resource.

        Arguments:
            cr_id (str): Catalog record identifier

        Returns:
            tuple: The id of the application and status code.

        """
        # Create user
        user_id = authentication.get_user_id()
        firstname = authentication.get_user_firstname()
        lastname = authentication.get_user_lastname()
        email = authentication.get_user_email()

        if not (user_id and (firstname or lastname) and email):
            return "Unauthorized request", 401
        _rems_api = rems_service.RemsAPIService(current_app, user_id)
        userdata = {
            "userid": user_id,
            "name": "{0} {1}".format(firstname, lastname),
            "email": email,
        }
        res_create_user = _rems_api.create_user(userdata)
        log.debug("res_create_user: {0}".format(res_create_user))

        if not res_create_user or not res_create_user.get("success", None):
            log.error("Could not create user, res: {}".format(res_create_user))
            return "Could not create user", 500

        # Get catalog item id
        cr = cr_service.get_catalog_record(cr_id, False, False)
        if cr and cr_service.is_rems_catalog_record(cr):
            pref_id = cr_service.get_catalog_record_preferred_identifier(cr)
            rems_identifier = cr_service.get_catalog_record_REMS_identifier(cr)

        log.info("Get catalog item id for resource: {0}".format(pref_id))
        log.info("rems_identifier: {0}".format(rems_identifier))
        if not rems_identifier:
            log.warning("No rems_identifier found for resource: {0}".format(pref_id))
            return "No rems_identifier found for resource", 500
        res_get_catalogue_item = _rems_api.get_catalogue_item_for_resource(
            rems_identifier
        )
        log.debug("res_get_catalogue_item: {0}".format(res_get_catalogue_item))

        if not res_get_catalogue_item:
            if res_get_catalogue_item == []:
                log.warning("No catalogue item found for resource: {0}".format(pref_id))
                return "No catalogue item found for resource", 500
            else:
                log.warning(
                    "Unable to get catalogue item id for resource: {0}".format(pref_id)
                )
                return "Could not get catalogue item id", 500
        catalog_item_id = res_get_catalogue_item[0].get("id", None)

        if not catalog_item_id:
            log.error(
                "Error in getting catalogue item id for resource: {0}".format(pref_id)
            )
            return "Failed to get catalogue item id", 500

        # Check if User has any applications for the resource
        application_id = session.get("REMS_application_id", None)
        if application_id:
            log.info(
                "Application with id: {0} found from session.".format(application_id)
            )
            return application_id, 200
        else:
            # Create Application
            log.info(
                "No application id in session, creating new application for resource: {0}".format(
                    pref_id
                )
            )
            res_create_application = _rems_api.create_application(catalog_item_id)
            if not res_create_application.get("success", None):
                if res_create_application.get("errers", None) is None:
                    log.error(
                        "Error in creating application for resource: {0}".format(
                            pref_id
                        )
                    )
                    return "Failed to create application", 500
                else:
                    log.warning(
                        "Failed to create application for resource {0}, errors: {1}".format(
                            pref_id, res_create_application.get("errers")
                        )
                    )
                    return "Failed to create application", 500

            application_id = res_create_application.get("application-id", None)
            if application_id is None:
                log.error("Failed to get application_id")
                return "Failed to get application_id", 500
            log.info(
                "Created application for user with application-id: {0}".format(
                    application_id
                )
            )

            return application_id, 200


class Session(MethodView):
    """Session related endpoints."""

    @log_request
    def get(self):
        """Renew Flask session, used by frontend.

        Returns:
            tuple: Empty payload and status code.

        """
        if authentication.is_authenticated():
            session.modified = True
            return "", 200
        return "No session or session expired", 401

    @log_request
    def delete(self):
        """Delete Flask session, used by frontend.

        Returns:
            tuple: bool and status code

        """
        authentication_direct_proxy.reset_flask_session_on_logout()
        return not authentication.is_authenticated(), 200


class Language(MethodView):
    """Language setting endpoints."""

    @log_request
    def get(self):
        """Get current language."""
        return {"language": get_language()}

    @log_request
    def post(self):
        """Set language for current session."""
        args = parser.parse(
            {
                "language": fields.Str(required=True, validate=validate.Length(min=1)),
            },
            request,
        )
        language = args.get("language")
        if set_language(language):
            return "", 200
        return "Unsupported language", 404


class AppConfig(MethodView):
    """Dataset related REST endpoints for frontend."""

    @log_request
    def get(self):
        """Endpoint for importing app_config values to the frontend.

        Returns:
            app_config for frontend

        """
        app_config = current_app.config
        sso_config = app_config.get("SSO", {})
        sso_cookie_domain = sso_config.get("COOKIE_DOMAIN") or app_config.get(
            "SESSION_COOKIE_DOMAIN", ""
        )
        metax_v3_config = app_config.get("METAX_V3_API", {})
        return {
            "SERVER_ETSIN_DOMAIN_NAME": app_config.get("SERVER_ETSIN_DOMAIN_NAME", ""),
            "SERVER_QVAIN_DOMAIN_NAME": app_config.get("SERVER_QVAIN_DOMAIN_NAME", ""),
            "FLAGS": app_config.get("FLAGS", {}),
            "SSO_PREFIX": sso_config.get("PREFIX", ""),
            "SSO_COOKIE_DOMAIN": sso_cookie_domain,
            "PACKAGE_SIZE_LIMIT": PACKAGE_SIZE_LIMIT,
            "METAX_V3_DOMAIN_NAME": metax_v3_config.get("HOST"),
            "METAX_V3_PORT": metax_v3_config.get("PORT", 443),
        }


class SupportedFlags(MethodView):
    """Supported flags endpoint."""

    @log_request
    def get(self):
        """Return list of supported flags.

        Used for flag validation in the frontend.

        Returns:
            list of supported flags

        """
        return sorted(list(get_supported_flags(current_app)))


def _get_catalog_record_relations_by_identifier(cr):
    dataset = cr.get("research_dataset", {})
    relation_objs = dataset.get("relation", [])
    relations = {}
    for relation in relation_objs:
        entity = relation.get("entity", {})
        identifier = entity.get("identifier", None)
        if identifier is not None:
            persistent_id = _transform_url_to_persistent_id(identifier)
            relations[persistent_id] = relation

    other_identifier_objs = dataset.get("other_identifier", [])
    other_identifiers = [x.get("notation", None) for x in other_identifier_objs]
    identifiers = {}
    for other_id in other_identifiers:
        persistent_id = _transform_url_to_persistent_id(other_id)
        if other_id not in identifiers:
            identifiers[persistent_id] = []
        identifiers[persistent_id].append(
            {"type": "other_identifier", "identifier": persistent_id}
        )

    for key, value in relations.items():
        if key not in identifiers:
            identifiers[key] = []
        identifiers[key].append({"type": value["relation_type"], "identifier": key})

    return identifiers


def _get_existing_identifiers(cr_id, identifiers):
    delete_items = []
    for persistent_id, dataset in identifiers.items():
        existing_id = get_dataset_exists_by_preferred_identifier(persistent_id)
        if existing_id is None:
            delete_items.append(persistent_id)
        else:
            for variations in dataset:
                variations["metax_identifier"] = existing_id

    for i in delete_items:
        del identifiers[i]

    return identifiers
