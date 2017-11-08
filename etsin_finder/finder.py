from flask import Flask
import logging
from logging.handlers import RotatingFileHandler
from etsin_finder.app_config import get_app_config
from etsin_finder.utils import executing_travis


def create_app(config=None):
    app = Flask(__name__, static_folder="./frontend/dist", template_folder="./frontend")
    _set_app_config(app, config)
    if not app.testing and not executing_travis():
        _setup_app_logging(app)

    return app


def _set_app_config(app, config):
    if config:
        app.config.update(config)
    else:
        app.config.update(get_app_config())

    app.logger.info("Application configuration: {0}".format(app.config))


def _setup_app_logging(app):
    log_file_path = app.config.get('APP_LOG_PATH', None)
    if log_file_path:
        level = logging.getLevelName(app.config.get('APP_LOG_LEVEL', 'INFO'))
        app.logger.setLevel(level)

        handler = RotatingFileHandler(log_file_path, maxBytes=10000000, mode='a', backupCount=30)
        handler.setLevel(level)
        formatter = logging.Formatter(
            "[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s")
        handler.setFormatter(formatter)
        app.logger.addHandler(handler)
    else:
        app.logger.error('Logging not correctly set up due to missing app log path configuration')


def _do_imports():
    import etsin_finder.views


app = create_app()
_do_imports()

if __name__ == "__main__":
    app.run()
