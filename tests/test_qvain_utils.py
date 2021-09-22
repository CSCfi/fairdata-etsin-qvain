"""Test suite for qvain_utils.py."""

import pytest
from etsin_finder.services import cr_service
from etsin_finder.utils.flags import set_flags
from copy import deepcopy
from etsin_finder.utils.qvain_utils import (
    alter_projects_to_metax,
    check_authentication,
    check_dataset_edit_permission,
    check_if_data_in_user_IDA_project,
    clean_empty_keyvalues_from_dict,
    data_to_metax,
    edited_data_to_metax,
    get_access_granter,
    get_dataset_creator,
    other_identifiers_to_metax,
    remove_deleted_datasets_from_results,
)

from .basetest import BaseTest
from .frontend_test_data import (
    original_project_list,
    expected_project_list,
    original_other_identifiers,
    expected_other_identifiers,
    original_open_rights,
    expected_open_rights,
    original_embargo_rights,
    expected_embargo_rights,
    original_custom_rights,
    expected_custom_rights,
    original_remote_resources,
    expected_remote_resources,
    original_complete_dataset,
    expected_complete_dataset,
    expected_edited_dataset,
    datasets_partly_deleted,
    files_and_directories,
)

"Test Qvain utils"


class TestQvainUtils(BaseTest):
    """class for testing Qvain utils."""

    def test_clean_empty_keyvalues_from_dict(app):
        """Test that function cleans keys that have empty values."""
        dict = {"key1": "populated", "key2": None}
        cleaned_up_dict = clean_empty_keyvalues_from_dict(dict)
        assert list(cleaned_up_dict.keys()) == ["key1"]

    def test_alter_projects_to_metax(app):
        """Test that function alters project list suitable to metax."""
        modified_list = alter_projects_to_metax(original_project_list)
        assert modified_list == expected_project_list

    def test_other_identifiers_to_metax(app):
        """Test that function alters other identifiers suitable for Metax."""
        modified_identifiers = other_identifiers_to_metax(original_other_identifiers)
        assert modified_identifiers == expected_other_identifiers

    def test_data_to_metax(self):
        """Test that function alters dataset for metax."""
        metadata_provider_org = "provider_org"
        metadata_provider_user = "provider_user"
        expected_dataset = deepcopy(expected_complete_dataset)
        expected_dataset["metadata_provider_org"] = metadata_provider_org
        expected_dataset["metadata_provider_user"] = metadata_provider_user
        modified_dataset = data_to_metax(
            original_complete_dataset, metadata_provider_org, metadata_provider_user
        )
        assert modified_dataset == expected_dataset

    def test_get_access_granter(self, user_details):
        """Test that function returns proper access granter object."""
        expected_access_granter = user_details
        access_granter = get_access_granter()
        assert access_granter == expected_access_granter

    def test_get_dataset_creator(self, open_catalog_record):
        """Test that function returns creator of the dataset."""
        creator = get_dataset_creator("open")
        assert creator == "abc-user-123"

    def test_check_authentication_not_logged_in(self, unauthd_client):
        """Test that function returns correct status and message when user is not logged in."""
        error, status = check_authentication()
        assert error.get("PermissionError", "") == "User not logged in."
        assert status == 401

    def test_check_authentication_missing_user_name(self, authd_no_user_name):
        """Test that function returns correct status and message when user name is missing."""
        error, status = check_authentication()
        assert error.get("PermissionError", "") == "Missing user CSC identifier."
        assert status == 401

    def test_check_authentication_ok(app, user_details):
        """Test that function returns None when auth is ok."""
        return_value = check_authentication()
        assert return_value is None

    def test_remove_deleted_datasets_from_results(self):
        """Test that function removes items that are marked as removed."""
        result = remove_deleted_datasets_from_results(datasets_partly_deleted)
        results = result.get("results", [])
        assert len(results) == 2
        for dataset in results:
            assert dataset.get("removed", True) is False

    def test_edited_data_to_metax(self):
        """Test that function maps dataset to Metax format."""
        original_old_dataset = original_complete_dataset.get("original")
        returned_dataset = edited_data_to_metax(
            original_complete_dataset, original_old_dataset
        )
        assert returned_dataset == expected_edited_dataset

    def test_check_data_in_user_IDA_project_no_projects(self, app, no_IDA_projects):
        """Test that function returns true if user ida projects returns None."""
        with app.app_context():
            result = check_if_data_in_user_IDA_project({})
            assert result is True

    def test_check_data_in_user_IDA_project_info_missing(
        self, app, IDA_project_info_missing, expect_log
    ):
        """Test that function returns false and warns if user ida projects are missing."""
        with app.app_context():
            result = check_if_data_in_user_IDA_project({})
            assert result is False
            expect_log(warnings=["Could not get user IDA projects."])

    def test_check_data_in_user_IDA_wrong_project(
        self, app, IDA_projects_dont_match, expect_log
    ):
        """Test that function returns false and warns if user ida projects dont match with files and directories."""
        with app.app_context():
            result = check_if_data_in_user_IDA_project(files_and_directories)
            assert result is False
            expect_log(
                warnings=[
                    "File projectIdentifier not in user projects.\nidentifier: project_x, user_ida_projects: ['project_y']"
                ]
            )

    def test_check_data_in_user_IDA_ok(self, app, IDA_projects_ok):
        """Test that function returns true."""
        with app.app_context():
            result = check_if_data_in_user_IDA_project(files_and_directories)
            assert result is True

class TestCheckDatasetEditPermission(BaseTest):
    """Tests for check_dataset_edit_permission."""

    deniedOrNotExistResult = ({"PermissionError": "Dataset does not exist or user is not allowed to edit the dataset."}, 403)

    nonStandardCatalogResult = ({
        "PermissionError": f"Editing datasets from catalog nonstandard is not supported by Qvain."
    }, 403)

    @pytest.fixture
    def flagged_app(self, app):
        """App with PERMISSIONS.SHARE_PROJECT flag enabled"""
        set_flags({'PERMISSIONS.SHARE_PROJECT': True}, app)
        return app

    @pytest.fixture
    def cr_permissions_empty(self, monkeypatch):
        """Dataset without projects"""
        monkeypatch.setattr(cr_service, "get_catalog_record_permissions", lambda *x: {'projects': []})

    @pytest.fixture
    def cr_permissions_project_x(self, monkeypatch):
        """Dataset in project_x"""
        monkeypatch.setattr(cr_service, "get_catalog_record_permissions", lambda *x: {'projects': ['project_x']})

    @pytest.fixture
    def cr_permissions_project_y(self, monkeypatch):
        """Dataset in project_y"""
        monkeypatch.setattr(cr_service, "get_catalog_record_permissions", lambda *x: {'projects': ['project_y']})

    def test_dataset_edit_permissions_no_catalog_record(
        self, flagged_app, nonexisting_catalog_record, user_details, expect_log
    ):
        """Test that function returns correct error when there's no catalog record available."""
        with flagged_app.app_context():
            result = check_dataset_edit_permission("testcatalog")
            expect_log(
                warnings=['Dataset "testcatalog" not found. Editing not allowed.']
            )
            assert result == self.deniedOrNotExistResult

    def test_dataset_edit_permissions_user_is_not_creator(
        self, flagged_app, expect_log, user_details, IDA_project_info_missing, open_catalog_record, cr_permissions_project_x
    ):
        """Test that function returns error when the user is not creator of the dataset."""
        with flagged_app.app_context():
            result = check_dataset_edit_permission("testcatalog")
            expect_log(
                warnings=[
                    'User: "teppo_testaaja" is not an editor of the dataset. Editing not allowed.'
                ]
            )
            assert result == self.deniedOrNotExistResult

    def test_dataset_edit_permissions_catalog_format_not_supported(
        self, flagged_app, expect_log, user_details, IDA_project_info_missing, nonstandard_catalog_record
    ):
        """Test that function returns error when the user is not creator of the dataset."""
        with flagged_app.app_context():
            result = check_dataset_edit_permission("testcatalog")
            expect_log(
                warnings=[
                    "Catalog nonstandard is not supported by Qvain. Editing not allowed"
                ]
            )
            assert result == self.nonStandardCatalogResult

    def test_dataset_edit_permissions_ok_creator(
        self, flagged_app, user_123_details, IDA_project_info_missing, open_catalog_record
    ):
        """Test that function returns None when user is owner of record."""
        with flagged_app.app_context():
            result = check_dataset_edit_permission("testcatalog")
            assert result is None

    def test_dataset_edit_permissions_ok_project(
        self, flagged_app, expect_log, user_details, IDA_projects_ok, open_catalog_record, cr_permissions_project_x
    ):
        """Test that function returns None when user is member of dataset project."""
        with flagged_app.app_context():
            result = check_dataset_edit_permission("testcatalog")
            assert result is None

    def test_dataset_edit_permissions_project_disabled(
        self, flagged_app, expect_log, user_details, IDA_projects_ok, open_catalog_record, cr_permissions_project_x
    ):
        """Test that editing by other project members is denied when PERMISSIONS.SHARE_PROJECT is disabled."""
        set_flags({'PERMISSIONS.SHARE_PROJECT': False}, flagged_app)
        with flagged_app.app_context():
            result = check_dataset_edit_permission("testcatalog")
            assert result == self.deniedOrNotExistResult
