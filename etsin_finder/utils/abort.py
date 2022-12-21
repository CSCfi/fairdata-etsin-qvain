"""Abort helper utils."""

from flask import abort as flask_abort, make_response


def abort(code, **kwargs):
    """Replacement for flask_resful abort"""
    if len(kwargs) > 0:
        flask_abort(make_response({**kwargs}, code))
    else:
        flask_abort(code)
