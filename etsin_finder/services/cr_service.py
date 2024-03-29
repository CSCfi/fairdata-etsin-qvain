# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations related to Metax"""

import requests
from flask import current_app

from etsin_finder.log import log
from etsin_finder.app_config import get_metax_api_config
from etsin_finder.utils.utils import FlaskService, format_url
from etsin_finder.utils.constants import ACCESS_TYPES
from etsin_finder.utils.request_utils import make_request
from etsin_finder.services.common_service import MetaxCommonAPIService


class MetaxAPIService(FlaskService):
    """Metax API Service"""

    def __init__(self, app):
        """Init Metax API Service."""
        super().__init__(app)

        metax_api_config = get_metax_api_config(app)

        if metax_api_config:
            self.METAX_GET_CATALOG_RECORD_URL = (
                "https://{0}/rest/v2/datasets".format(metax_api_config.get("HOST"))
                + "/{0}?expand_relation=data_catalog&include_legacy=true"
            )

            self.METAX_GET_REMOVED_CATALOG_RECORD_URL = (
                self.METAX_GET_CATALOG_RECORD_URL + "&removed=true"
            )

            self.user = metax_api_config.get("USER")
            self.pw = metax_api_config.get("PASSWORD")
            self.verify_ssl = metax_api_config.get("VERIFY_SSL", True)
            self.proxies = None
            if metax_api_config.get("HTTPS_PROXY"):
                self.proxies = dict(https=metax_api_config.get("HTTPS_PROXY"))
        elif not self.is_testing:
            log.error("Unable to initialize MetaxAPIService due to missing config")

    def get_catalog_record(self, identifier):
        """Get a catalog record with a given identifier from Metax API v2.

        Args:
            identifier (str): Catalog record identifier.

        Returns:
            dict: Return the responce from Metax as dict, else None.

        """
        url = format_url(self.METAX_GET_CATALOG_RECORD_URL, identifier)
        resp, _, success = make_request(
            requests.get,
            url,
            headers={"Accept": "application/json"},
            auth=(self.user, self.pw),
            verify=self.verify_ssl,
            proxies=self.proxies,
            timeout=30,
        )
        if not success:
            log.warning(
                "Failed to get catalog record {0} from Metax API".format(identifier)
            )
            return None
        return resp

    def get_removed_catalog_record(self, identifier):
        """Get a catalog record with a given identifier from MetaX API

        Should return only datasets that are removed.

        Args:
            identifier (str): Catalog record identifier.

        Returns:
            dict: Return the responsce from Metax as dict, else None.

        """
        url = format_url(self.METAX_GET_REMOVED_CATALOG_RECORD_URL, identifier)
        resp, _, success = make_request(
            requests.get,
            url,
            headers={"Accept": "application/json"},
            auth=(self.user, self.pw),
            verify=self.verify_ssl,
            proxies=self.proxies,
            timeout=30,
        )
        if not success:
            log.warning(
                "Failed to get removed catalog record {0} from Metax API".format(
                    identifier
                )
            )
            return None
        return resp


def get_catalog_record(cr_id, check_removed_if_not_exist, refresh_cache=False):
    """Get single catalog record from Metax API v2.

    If it does not exist, try checking/fetching from deleted catalog records.

    Args:
        cr_id (str): Catalog record identifier.
        check_removed_if_not_exist (bool): Checck if catalog record has been removed if it does not exist.
        refresh_cache (bool, optional): Should the cache be refreshed. Defaults to False.

    Returns:
        dict: The wanted catalog record.

    """
    if refresh_cache:
        cr = _get_cr_from_metax(cr_id, check_removed_if_not_exist)
        current_app.cr_cache.update(cr_id, cr)
        return cr

    cr = current_app.cr_cache.get(cr_id)
    if cr is None:
        cr = _get_cr_from_metax(cr_id, check_removed_if_not_exist)
        current_app.cr_cache.update(cr_id, cr)
        return cr
    else:
        return cr


def get_catalog_record_permissions(cr_id, refresh_cache=False):
    """Get permissions for a single catalog record from Metax API.

    Args:
        cr_id (str): Catalog record identifier.
        refresh_cache (bool, optional): Should the cache be refreshed. Defaults to False.

    Returns:
        dict: Permissions dict

    """

    def get_perm():
        """Retrieve permissions from Metax"""
        common_service = MetaxCommonAPIService()
        projects, projects_status = common_service.get_dataset_projects(cr_id)
        if projects_status != 200:
            log.error(
                f"Getting list of projects for dataset {cr_id} failed with {projects_status}: {projects}"
            )
            return None
        perms, perms_status = common_service.get_dataset_editor_permissions_users(cr_id)
        if perms_status != 200:
            log.error(
                f"Getting editor permissions users for dataset {cr_id} failed with {perms_status}: {perms}"
            )
            return None
        return {
            "projects": projects,
            "users": perms,
        }  # list of dataset projects and editor users

    perm = None
    if not refresh_cache:
        # try to get cached permissions
        perm = current_app.cr_permission_cache.get(cr_id)
    if perm is None:
        perm = get_perm()
        if perm:
            current_app.cr_permission_cache.update(cr_id, perm)
            return perm
        else:
            # getting permissions failed, remove previous entry from cache if any
            current_app.cr_permission_cache.delete(cr_id)
            return None
    else:
        return perm


def get_catalog_record_access_type(cr):
    """Get the type of access_type of a catalog record.

    Args:
        cr (dict): A catalog record as dict.

    Returns:
        str: Returns the Access type of the dataset. If not found then ''.

    """
    return (
        cr.get("research_dataset", {})
        .get("access_rights", {})
        .get("access_type", {})
        .get("identifier", "")
    )


def get_catalog_record_embargo_available(cr):
    """Get access rights embargo available date as string for a catalog record.

    Args:
        cr (dict): A catalog record

    Returns:
        str: The embargo available for a dataset. Id not found then ''.

    """
    return cr.get("research_dataset", {}).get("access_rights", {}).get("available", "")


def get_catalog_record_data_catalog_id(cr):
    """Get identifier for a catalog record.

    Args:
        cr (dict): A catalog record

    Returns:
        str: Returns the datacatalog id for a dataset. If not found then ''.

    """
    return cr.get("data_catalog", {}).get("catalog_json", {}).get("identifier", "")


def get_catalog_record_preferred_identifier(cr):
    """Get preferred identifier for a catalog record.

    Args:
        cr (dict): A catalog record.

    Returns:
        str: The preferred identifier of e dataset. If not found then ''.

    """
    return cr.get("research_dataset", {}).get("preferred_identifier", "")


def get_catalog_record_REMS_identifier(cr):
    """Get REMS identifier for a catalog record.

    Args:
        cr (dict): A catalog record.

    Returns:
        str: Retruns the REMS identifier for a dataset. If not foyunf then ''.

    """
    return cr.get("rems_identifier", "")


def is_rems_catalog_record(catalog_record):
    """Is the catalog record a rems dataset or not.

    Args:
        catalog_record (dict): A catalog record

    Returns:
        bool: Returns True if catalog record has the 'permit' Access type. Else return False.

    """
    if get_catalog_record_access_type(catalog_record) == ACCESS_TYPES.get("permit"):
        return True
    return False


def is_draft(catalog_record):
    """
    Is the catalog record a draft or not.

    Args:
        catalog_record (dict): A catalog record

    Returns:
        bool: True if record is a draft

    """
    if catalog_record.get("state") == "draft":
        return True
    return False


def is_published(catalog_record):
    """
    Is the catalog record published or not.

    Args:
        catalog_record (dict): A catalog record

    Returns:
        bool: True if record is published

    """
    if catalog_record.get("state") == "published":
        return True
    return False


def is_catalog_record_metadata_provider_user(catalog_record, user_id):
    """
    Does user_id own catalog_record.

    :param catalog_record:
    :param user_id:
    :return:
    """
    if user_id and catalog_record.get("metadata_provider_user") == user_id:
        return True
    return False


def _get_cr_from_metax(cr_id, check_removed_if_not_exist):
    """Get removed catalog record from Metax

    Args:
        cr_id (str): Catalog record identifier.
        check_removed_if_not_exist (bool): -

    Returns:
        dict: Return the responce from Metax as dict, else None.

    """
    _metax_api = MetaxAPIService(current_app)
    cr = _metax_api.get_catalog_record(cr_id)
    if not cr and check_removed_if_not_exist:
        cr = _metax_api.get_removed_catalog_record(cr_id)
    return cr
