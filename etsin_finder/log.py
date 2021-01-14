"""Logger for flask current app context"""

from flask import current_app

class CurrentAppLogger():
    """Convenience class for logger."""

    def __getattr__(self, name):
        """Mapping logger methods"""
        return getattr(current_app.logger, name)


log = CurrentAppLogger()
