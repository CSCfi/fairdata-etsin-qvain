"""Download endpoints that use Metax V3."""
from etsin_finder.resources.download_resources_common import PackageRequests, Authorize, Subscriptions, Notifications

from etsin_finder.utils.abort import abort
from etsin_finder.log import log
from etsin_finder.services.metax_v3_service import MetaxV3APIService

def get_pid_for_email_v3(self, cr_id):
    """Get dataset PID for email"""
    try:
        metax_service = MetaxV3APIService()
        dataset = metax_service.get_dataset(cr_id)
        if not dataset:
            log.warning(f"Notifications: Catalog record {cr_id} not found.")
            abort(404, message="Catalog record not found")
        pref_id = dataset["persistent_identifier"]
    except Exception as e:
        log.error(e)
        abort(500, message=repr(e))
    return pref_id


def check_download_permission_v3(self, cr_id):
    """Abort if user is not allowed to download files from a V3 dataset."""
    metax_service = MetaxV3APIService()
    dataset = metax_service.get_dataset(cr_id)
    if not dataset:
        abort(404)
    if not dataset["allowed_actions"]["download"]:
        abort(403, message="Not authorized")
    return True


class PackageRequestsV3(PackageRequests):
    """Class for generating and retrieving download package requests. Uses Metax V3."""

    check_permission = check_download_permission_v3

    def get_package_byte_size(self, cr_id, path):
        """Check package byte size before generating the package."""
        metax_service = MetaxV3APIService()
        directory_details, status = metax_service.get_directory(cr_id, path)
        if status != 200:
            abort(
                status,
                message="Error occured when Etsin tried to fetch package details from Metax.",
            )
        byte_size = directory_details.get("results", {}).get("directory", None).get("size", None)
        return byte_size


class AuthorizeV3(Authorize):
    """Class for requesting download authorizations. Uses Metax V3."""

    check_permission = check_download_permission_v3


class SubscriptionsV3(Subscriptions):
    """Class for subscribing to package creation emails. Uses Metax V3."""

    check_permission = check_download_permission_v3
    get_pid_for_email = get_pid_for_email_v3


class NotificationsV3(Notifications):
    """Email notification sending. Uses Metax V3."""

    get_pid_for_email = get_pid_for_email_v3
