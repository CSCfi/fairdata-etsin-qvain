"""Service for managing Qvain dataset write locks."""

from flask import request, current_app

from etsin_finder.auth import authentication


class QvainLockService:
    """Write locks for datasets in Qvain.

    Allows exclusive write access to a dataset for a short time. A lock
    should be refreshed periodically to keep it from expiring.

    Lock objects are dicts containing:
    {
        "cr_id": Identifier of locked dataset
        "user_id": User who currently owns the lock
    }
    """

    def _get_lock_data(self, cr_id):
        user_id = authentication.get_user_csc_name()
        return {"cr_id": cr_id, "user_id": user_id}

    def request_lock(self, cr_id, force=False):
        """Request/refresh lock for dataset.

        Uses Check-And-Set to confirm that the lock is available
        before setting the new value atomically.

        Arguments:
            cr_id {str} -- Identifier of dataset.

        Returns
            bool -- True if lock is free now, False otherwise

        """
        data = self._get_lock_data(cr_id)
        prev_data, token = current_app.cr_lock_cache.gets(cr_id)

        locked_by_other = prev_data and data != prev_data
        success = False
        if force or not locked_by_other:
            if token:
                success = current_app.cr_lock_cache.cas(cr_id, data, token)
            else:
                success = current_app.cr_lock_cache.add(cr_id, data)
            if success:
                return success, data

        return success, (prev_data or {})

    def release_lock(self, cr_id):
        """Release lock for dataset.

        Because the cache API does not support reading and deleting keys atomically,
        this uses Check-And-Set to assign None value to the key.

        Arguments:
            cr_id {str} -- Identifier of dataset.

        Returns
            bool -- True if lock is free now, False otherwise

        """
        prev_data, token = current_app.cr_lock_cache.gets(cr_id)
        if not token:
            return True  # lock already released

        data = self._get_lock_data(cr_id)
        locked_by_other = (prev_data or token) and data != prev_data
        if locked_by_other:
            return False

        success = current_app.cr_lock_cache.cas(cr_id, None, token)
        if not success:
            return False

        return True
