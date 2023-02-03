"""Test suite for common resource."""
from pytest import fixture
import requests

from etsin_finder.resources.common_resources import (
    DatasetProjects,
    DatasetUserMetadata,
    DirectoryFiles,
    ProjectFiles,
)
from .basetest import BaseTest, make_sso_cookie


class TestCommonResource(BaseTest):
    """Test class for common resource."""

    @fixture
    def sso_cookie(self):
        """Return sso_cookie with a IDA project and id."""
        return make_sso_cookie(
            {
                "authenticated_user": {"id": "teppo"},
                "services": {"IDA": {"projects": ["IDA01:project"]}},
            }
        )

    @fixture
    def view_permissions(self, mocker):
        """Mock user_can_view_dataset to grant access to dataset."""
        mocker.patch(
            "etsin_finder.resources.common_resources.authorization.user_can_view_dataset",
            return_value=True,
        )

    @fixture
    def edit_permissions(self, mocker):
        """Mock check_user_edit_permissions to grant permissions to edit dataset."""
        return mocker.patch(
            "etsin_finder.resources.common_resources.check_dataset_edit_permission",
            return_value=None,
        )

    def test_project_files_get_not_autenticated(self, app):
        """Return status 400 and error message."""
        with app.test_request_context():
            project_files = ProjectFiles()
            response, status = project_files.get("IDA01:project")
            assert (
                response
                == "The cr_identifier parameter is required if user is not authenticated"
            )
            assert status == 400

    def test_project_files_get_incorrect_pid(self, app, expect_log):
        """Return status 400 and error message."""
        sso_cookie = make_sso_cookie(
            {
                "authenticated_user": {"id": "teppo"},
                "services": {"IDA": {"projects": ["incorrect"]}},
            }
        )
        with app.test_request_context(headers={"COOKIE": sso_cookie}):
            project_files = ProjectFiles()
            response, status = project_files.get("IDA01:project")
            assert response == ""
            assert status == 404
            expect_log(
                warnings=[
                    "User is missing project or project_dir_obj is invalid\npid: IDA01:project"
                ]
            )

    def test_project_files_get(self, app, mocker, sso_cookie):
        """Return with expected (sorted) project files and status 200."""
        project_files = {
            "directories": [{"directory_name": "bb"}, {"directory_name": "aa"}],
            "files": [{"file_name": "bb"}, {"file_name": "aa"}],
        }

        expected_project_files = {
            "directories": [{"directory_name": "aa"}, {"directory_name": "bb"}],
            "files": [{"file_name": "aa"}, {"file_name": "bb"}],
        }

        make_request = mocker.patch(
            "etsin_finder.services.common_service.make_request",
            return_value=(project_files, 200, True),
        )

        with app.test_request_context(headers={"COOKIE": sso_cookie}):
            project_files_class = ProjectFiles()
            response, status = project_files_class.get("IDA01:project")
            assert response == expected_project_files
            assert status == 200
            make_request.assert_called_once_with(
                requests.get,
                "https://mock-metax/rest/v2/directories/files?project=IDA01%3Aproject&path=%2F&include_parent",
                params={},
                auth=("qvain", "test-qvain"),
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                proxies=None,
                timeout=10,
                verify=True,
            )

    def test_get_directory_files_no_cr_id_or_auth(self, app):
        """Return error message and status code 400."""
        dir_id = "id"
        with app.test_request_context():
            directory_files_class = DirectoryFiles()
            response, status = directory_files_class.get(dir_id)

            assert (
                response
                == "The cr_identifier parameter is required if user is not authenticated"
            )
            assert status == 400

    def test_get_directory_files_no_catalog_record(self, app):
        """Return empty error message and status code 404."""
        dir_id = "id"

        with app.test_request_context(json={"cr_identifier": "cr_id"}):
            directory_files_class = DirectoryFiles()
            response, status = directory_files_class.get(dir_id)

            assert response == ""
            assert status == 404

    def test_get_directory_files_no_success(
        self, app, mocker, sso_cookie, view_permissions
    ):
        """Return empty error message and status code 404."""
        dir_id = "id"

        make_request = mocker.patch(
            "etsin_finder.services.common_service.make_request",
            return_value=("metax_error", 123, False),
        )

        with app.test_request_context(
            json={"cr_identifier": "cr_id"}, headers={"COOKIE": sso_cookie}
        ):
            directory_files_class = DirectoryFiles()
            response, status = directory_files_class.get(dir_id)

            assert response == "metax_error"
            assert status == 123
            make_request.assert_called_once_with(
                requests.get,
                "https://mock-metax/rest/v2/directories/id/files",
                auth=("qvain", "test-qvain"),
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                params={
                    "include_parent": "true",
                    "file_ordering": "file_path",
                    "directory_ordering": "directory_path",
                    "cr_identifier": "cr_id",
                    "directory_fields": "directory_name,project_identifier,id,identifier,directory_path,file_count,description,use_category,title,byte_size,service_created",
                    "file_fields": "file_name,project_identifier,file_characteristics,id,identifier,file_path,description,use_category,title,file_type,byte_size,checksum_value,checksum_algorithm,service_created",
                },
                proxies=None,
                timeout=10,
                verify=True,
            )

    def test_get_directory_files_success(
        self, app, mocker, sso_cookie, view_permissions
    ):
        """Return empty error message and status code 404."""
        dir_id = "id"
        directory_files = {"project_identifier": ""}

        make_request = mocker.patch(
            "etsin_finder.services.common_service.make_request",
            return_value=(directory_files, 200, True),
        )

        with app.test_request_context(
            json={"cr_identifier": "cr_id"}, headers={"COOKIE": sso_cookie}
        ):
            directory_files_class = DirectoryFiles()
            response, status = directory_files_class.get(dir_id)

            assert response == directory_files
            assert status == 200
            make_request.assert_called_once_with(
                requests.get,
                "https://mock-metax/rest/v2/directories/id/files",
                auth=("qvain", "test-qvain"),
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                params={
                    "include_parent": "true",
                    "file_ordering": "file_path",
                    "directory_ordering": "directory_path",
                    "cr_identifier": "cr_id",
                    "directory_fields": "directory_name,project_identifier,id,identifier,directory_path,file_count,description,use_category,title,byte_size,service_created",
                    "file_fields": "file_name,project_identifier,file_characteristics,id,identifier,file_path,description,use_category,title,file_type,byte_size,checksum_value,checksum_algorithm,service_created",
                },
                proxies=None,
                timeout=10,
                verify=True,
            )

    def test_dataset_projects_no_auth(self, app, mocker):
        """Return empty error and 404."""
        mocker.patch(
            "etsin_finder.resources.common_resources.authorization.user_can_view_dataset",
            return_value=False,
        )

        with app.test_request_context(json={"cr_identifier": "cr_id"}):
            dataset_projects = DatasetProjects()
            response, status = dataset_projects.get("IDA01:project")
            assert response == ""
            assert status == 404

    def test_dataset_projects(self, app, mocker, view_permissions):
        """Return dataset projects and 200."""
        make_request = mocker.patch(
            "etsin_finder.services.common_service.make_request",
            return_value=("dataset_projects", 200, True),
        )

        with app.test_request_context(json={"cr_identifier": "cr_id"}):
            dataset_projects = DatasetProjects()
            response, status = dataset_projects.get("IDA01:project")
            assert response == "dataset_projects"
            assert status == 200
            make_request.assert_called_once_with(
                requests.get,
                "https://mock-metax/rest/v2/datasets/IDA01%3Aproject/projects",
                auth=("qvain", "test-qvain"),
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                proxies=None,
                timeout=10,
                verify=True,
            )

    def test_dataset_user_metadata_get_no_auth(self, app, mocker, view_permissions):
        """Return empty error and 404."""
        mocker.patch(
            "etsin_finder.resources.common_resources.authorization.user_can_view_dataset",
            return_value=False,
        )

        with app.test_request_context(json={"cr_identifier": "cr_id"}):
            dataset_user_metadata = DatasetUserMetadata()
            response, status = dataset_user_metadata.get("IDA01:project")
            assert response == ""
            assert status == 404

    def test_dataset_user_metadata_get(self, app, mocker, view_permissions):
        """Return dataset user meta and 200."""
        make_request = mocker.patch(
            "etsin_finder.services.common_service.make_request",
            return_value=("dataset_user_meta", 200, True),
        )

        with app.test_request_context(json={"cr_identifier": "cr_id"}):
            dataset_user_metadata = DatasetUserMetadata()
            response, status = dataset_user_metadata.get("IDA01:project")
            assert response == "dataset_user_meta"
            assert status == 200
            make_request.assert_called_once_with(
                requests.get,
                "https://mock-metax/rest/v2/datasets/IDA01%3Aproject/files/user_metadata",
                auth=("qvain", "test-qvain"),
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                proxies=None,
                timeout=10,
                verify=True,
            )

    def test_dataset_user_metadata_put_not_logged_in(self, app):
        """Return error and 401."""
        with app.test_request_context(
            json={
                "cr_identifier": "cr_id",
            },
        ):
            dataset_user_metadata = DatasetUserMetadata()
            response, status = dataset_user_metadata.put("IDA=!")
            assert response == {"PermissionError": "User not logged in."}
            assert status == 401

    def test_dataset_user_metadata_put_no_permission(self, app, sso_cookie):
        """Return error and 403."""
        with app.test_request_context(
            headers={"COOKIE": sso_cookie},
            json={
                "cr_identifier": "cr_id",
            },
        ):
            dataset_user_metadata = DatasetUserMetadata()
            response, status = dataset_user_metadata.put("IDA01:project")
            assert response == {
                "PermissionError": "Dataset does not exist or user is not allowed to edit the dataset."
            }
            assert status == 403

    def test_dataset_user_metadata_put_not_valid_data(
        self, app, sso_cookie, edit_permissions
    ):
        """Return validation error and 400."""
        with app.test_request_context(
            "test",
            headers={"COOKIE": sso_cookie},
            json={"test": "test"},
        ):
            dataset_user_metadata = DatasetUserMetadata()
            response, status = dataset_user_metadata.put("IDA01:project")
            assert response == {"test": ["Unknown field."]}
            assert status == 400

    def test_dataset_user_metadata_put(self, app, mocker, sso_cookie, edit_permissions):
        """Return validation error and 200."""
        make_request = mocker.patch(
            "etsin_finder.services.common_service.make_request",
            return_value=("dataset_user_meta", 200, True),
        )

        with app.test_request_context(
            "test",
            headers={"COOKIE": sso_cookie},
            json={"files": [], "directories": []},
        ):
            dataset_user_metadata = DatasetUserMetadata()
            response, status = dataset_user_metadata.put("IDA01:project")
            assert response == "dataset_user_meta"
            assert status == 200
            make_request.assert_called_once_with(
                requests.put,
                "https://mock-metax/rest/v2/datasets/IDA01%3Aproject/files/user_metadata",
                auth=("qvain", "test-qvain"),
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                json={"files": [], "directories": []},
                proxies=None,
                timeout=10,
                verify=True,
            )
