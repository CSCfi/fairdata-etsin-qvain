"""Download endpoints that use Metax V2."""
from etsin_finder.resources.download_resources_common import PackageRequests, Authorize, Subscriptions, Notifications

from etsin_finder.utils.abort import abort
from etsin_finder.log import log
from etsin_finder.auth import authentication
from etsin_finder.auth import authorization
from etsin_finder.services import cr_service, common_service


def get_pid_for_email_v2(self, cr_id):
    """Get catalog record PID for email."""
    try:
        cr = cr_service.get_catalog_record(cr_id, False, False)
        if not cr:
            log.warning(f"Notifications: Catalog record {cr_id} not found.")
            abort(404, message="Catalog record not found")
        pref_id = cr_service.get_catalog_record_preferred_identifier(cr)
    except Exception as e:
        log.error(e)
        abort(500, message=repr(e))
    return pref_id


def check_download_permission_v2(self, cr_id):
    """Abort if user is not allowed to download files from a V2 dataset."""
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


class PackageRequestsV2(PackageRequests):
    """Class for generating and retrieving download package requests. Uses Metax V2."""

    check_permission = check_download_permission_v2

    def get_package_byte_size(self, cr_id, path):
        """Check package byte size before generating the package."""
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
        directory_details, status = common_service.get_directory_for_project_using_path(
            cr_id, project, (path or ["/"])[0]
        )
        if status != 200:
            abort(
                status,
                message="Error occured when Etsin tried to fetch package details from Metax.",
            )
        byte_size = directory_details.get("results", {}).get("byte_size", None)
        return byte_size


class AuthorizeV2(Authorize):
    """Class for requesting download authorizations. Uses Metax V2."""

    check_permission = check_download_permission_v2


class SubscriptionsV2(Subscriptions):
    """Class for subscribing to package creation emails. Uses Metax V2."""

    check_permission = check_download_permission_v2
    get_pid_for_email = get_pid_for_email_v2


class NotificationsV2(Notifications):
    """Email notification sending. Uses Metax V2."""

    get_pid_for_email = get_pid_for_email_v2
