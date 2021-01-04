# This file is part of the Etsin service
#
# Copyright 2017-2020 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Feature flag utilities"""

import re

from etsin_finder.utils.utils import ensure_app

default_supported_flags = {
    'DOWNLOAD_API_V2.BACKEND',
    'DOWNLOAD_API_V2.FRONTEND',
    'METAX_API_V2.BACKEND',
    'METAX_API_V2.FRONTEND',
    'UI.BOTTOM_SUBMIT_BUTTONS',
}

# Match last part of dot-separated path (including the period), e.g. '.last' in 'first.second.last'
re_last_part = re.compile(r'\.?[^\.]*$')

def _get_partial_paths(paths, include_full=False):
    """Split flag paths into groups."""
    partials = set()
    for path in paths:
        parts = path.split('.')
        limit = len(parts)
        if not include_full:
            limit -= 1
        for i in range(limit):
            partials.add('.'.join(parts[0:i + 1]))
    return partials

def set_flags(value, app):
    """Set flags for app (useful for testing)"""
    app.config['FLAGS'] = value

def set_supported_flags(app, flags):
    """Set supported flags for app (useful for testing)"""
    app.config['SUPPORTED_FLAGS'] = set(flags)

def initialize_supported_flags(app):
    """Assign default supported flags for app"""
    app.config['SUPPORTED_FLAGS'] = set(default_supported_flags)

def validate_flags(app=None):
    """Validate flags

    Logs warning if a flag in config is not in supported flags or
    is not a group containing supported flags.
    """
    app = ensure_app(app)
    supported = _get_partial_paths(get_supported_flags(app), True)
    flags = app.config.get('FLAGS', {})
    for path, value in flags.items():
        if type(value) is not bool and value is not None:
            app.logger.warning(f'validate_flags: invalid flag value {path}={value}')

    flag_paths = set(flags.keys())
    unknown_flags = list(flag_paths.difference(supported))
    if len(unknown_flags) > 0:
        app.logger.warning(f'validate_flags: unsupported flags {sorted(unknown_flags)}')

def get_flags(app):
    """Get feature flag dictionary"""
    return app.config.get('FLAGS', {})

def get_supported_flags(app):
    """Get set of supported feature flags"""
    return app.config.get('SUPPORTED_FLAGS', set())

def flag_enabled(flag_path, app=None):
    """Get state of flag for feature

    Example:
      flag_path='FEATURE_GROUP.FEATURE.SUBFEATURE'
    will search
    - flags['FEATURE_GROUP.FEATURE.SUBFEATURE']
    - flags['FEATURE_GROUP.FEATURE']
    - flags['FEATURE_GROUP']
    and return the first matching not-None value, or False if no matches are found.

    Requesting a flag not in supported flags will cause a warning.

    """
    app = ensure_app(app)

    if flag_path not in get_supported_flags(app):
        app.logger.warning(f'flag_enabled: requesting value for unsupported flag {flag_path}')

    flags = get_flags(app)
    while flag_path:
        value = flags.get(flag_path)
        if value is not None:
            return value
        flag_path = re_last_part.sub('', flag_path)

    return False
