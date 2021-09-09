"""Test data for utils test suite."""

expected_log_config = {
    "version": 1,
    "formatters": {
        "standard": {
            "format": "--------------\n[%(asctime)s] [%(process)d] %(levelname)s in %(filename)s:%(lineno)d: %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S %z",
        }
    },
    "handlers": {
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "standard",
            "filename": "log_file_path/file.log",
            "maxBytes": 10000000,
            "mode": "a",
            "backupCount": 30,
        },
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
            "stream": "ext://sys.stdout",
        },
    },
    "root": {"level": 3, "handlers": ["file", "console"]},
}
