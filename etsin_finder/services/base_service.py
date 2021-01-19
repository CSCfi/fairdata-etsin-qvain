"""Base class for services"""

from etsin_finder.log import log

class ConfigValidationMixin:
    """Mixin class that provides config validation for services"""

    def validate_config(self, verbose=False):
        """Validate self.config using self.schema"""
        if self.config is None:
            errors = ['No config found']
        else:
            errors = self.schema.validate(self.config)
        if len(errors) > 0:
            if verbose:
                log.error(f'Error validating configuration for {self.__class__.__name__}: {errors}')
            return False

        if verbose:
            log.info(f'Configuration for {self.__class__.__name__} ok')
        return True


class BaseService:
    """Use as base class for external dependency services"""

    pass
