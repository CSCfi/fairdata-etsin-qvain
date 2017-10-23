from flask import Flask
from flask_apscheduler import APScheduler
import logging
from logging.handlers import RotatingFileHandler
from etsin_finder.app_config import get_app_config
from etsin_finder.utils import executing_travis, load_test_data_into_es


def create_app(config=None):
    app = Flask(__name__, static_folder="./frontend/dist", template_folder="./frontend")
    _set_app_config(app, config)
    if not app.testing and not executing_travis():
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


def _setup_scheduler_config(app):
    app.config.update({
        'JOBS': [
            {
                'id': 'es_reindex_without_emptying_index_task',
                'func': 'etsin_finder.reindexer:reindex_all_without_emptying_index',
                'trigger': 'cron',
                'hour': 5,
                'day_of_week': 'mon-sat'
            },
            {
                'id': 'es_reindex_by_emptying_index_task',
                'func': 'etsin_finder.reindexer:reindex_all_by_emptying_index',
                'trigger': 'cron',
                'hour': 5,
                'day_of_week': 'sun'
            }
        ]
    })


def _init_reindex_task(app):
    """
    Initialize reindexing cron-style task. Do not do it if Flask debug mode is on (e.g. local dev env)
    or if tests are run or if Travis is running this

    :param app:
    :return:
    """
    if app.debug or app.testing or executing_travis():
        return

    scheduler = APScheduler()
    scheduler.init_app(app)
    scheduler.start()


def _do_imports():
    import etsin_finder.views


app = create_app()
_do_imports()

# Load test data only in local dev env
if not app.testing and not executing_travis() and app.debug:
    load_test_data_into_es(app.config, True)

# Uncomment these if testing full reindexing is needed
# from etsin_finder.reindexer import reindex_all_by_emptying_index
# reindex_all_by_emptying_index()

_init_reindex_task(app)

if __name__ == "__main__":
    app.run()
