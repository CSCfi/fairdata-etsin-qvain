from flask import Flask
from flask_apscheduler import APScheduler
import logging
from logging.handlers import RotatingFileHandler
from etsin_finder.app_config import get_app_config
from etsin_finder.utils import executing_travis


def create_app(config=None):
    app = Flask(__name__, static_folder="./frontend/dist", template_folder="./frontend")
    _set_app_config(app, config)
    if not app.testing:
        _setup_app_logging(app)
        _setup_scheduler_config(app)

    return app


def _set_app_config(app, config):
    if config:
        app.config.update(config)
    else:
        app.config.update(get_app_config())

    app.logger.info("Application configuration: {0}".format(app.config))


def _setup_app_logging(app):
    level = logging.getLevelName(app.config.get('APP_LOG_LEVEL', 'INFO'))
    log_file_path = app.config.get('APP_LOG_PATH', None)
    if log_file_path:
        handler = RotatingFileHandler(log_file_path, maxBytes=10000000, mode='a', backupCount=30)
        handler.setLevel(level)
        app.logger.setLevel(level)
        app.logger.addHandler(handler)
    else:
        app.logger.error('Logging not correctly set up due to missing app log path configuration')


def _setup_scheduler_config(app):
    app.config.update({
        'JOBS': [{
            'id': 'es_reindex_task',
            'func': 'etsin_finder.reindex_task:reindex',
            'trigger': 'cron',
            'hour': 5,
        }]
    })


def _init_reindex_task(app):
    if app.testing or executing_travis():
        return

    scheduler = APScheduler()
    scheduler.init_app(app)
    scheduler.start()


def _do_imports():
    import etsin_finder.views


app = create_app()
_do_imports()
# from etsin_finder.reindex_task import reindex
# reindex()
# _init_reindex_task(app)

if __name__ == "__main__":
    app.run()
