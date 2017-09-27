import yaml
from utils import executing_travis

def _get_app_config_from_file():
    with open('/home/etsin-user/app_config') as app_config_file:
        return yaml.load(app_config_file)

def get_from_app_config(key):
    if not executing_travis():
        return _get_app_config_from_file.get(key, None)

def get_app_config():
    if not executing_travis():
        return _get_app_config_from_file()
