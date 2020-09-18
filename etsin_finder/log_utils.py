"""Logging-related utils.

Moved here to avoid having finder.app dependency in utils.py.
"""

from functools import wraps
from flask import request

from etsin_finder.app import app
from etsin_finder import authentication
log = app.logger

def log_request(f):
    """Log request when used as decorator."""
    @wraps(f)
    def func(*args, **kwargs):
        """Log requests"""
        csc_name = authentication.get_user_csc_name() if not app.testing else ''
        log.info('[{0}.{1}] {2} {3} {4} USER AGENT: {5}'.format(
            args[0].__class__.__name__,
            f.__name__,
            csc_name if csc_name else 'UNAUTHENTICATED',
            request.environ.get('REQUEST_METHOD'),
            request.path,
            request.user_agent))
        return f(*args, **kwargs)
    return func
