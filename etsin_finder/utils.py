import json
import os


def executing_travis():
    """
    Returns True whenever code is being executed by travis
    """
    return True if os.getenv('TRAVIS', False) else False


def get_elasticsearch_config(config):
    if executing_travis():
        return None

    es_conf = config.get('ELASTICSEARCH', None)
    if not es_conf or not isinstance(es_conf, dict):
        return None

    return es_conf


def get_metax_api_config(config):
    if executing_travis():
        return None

    metax_api_conf = config.get('METAX_API')
    if not metax_api_conf or not isinstance(metax_api_conf, dict):
        return None

    return metax_api_conf


def write_json_to_file(json_data, filename):
    with open(filename, "w") as output_file:
        json.dump(json_data, output_file)


def write_string_to_file(string, filename):
    with open(filename, "w") as output_file:
        print(f"{string}", file=output_file)


def strip_catalog_record(catalog_record):
    """
    This method should strip catalog record of any confidential/private information not supposed to be sent for
    the frontend.

    :param catalog_record:
    :return:
    """
    return _remove_keys(catalog_record, ['email', 'telephone', 'phone'])


def _remove_keys(obj, rubbish):
    if isinstance(obj, dict):
        obj = {
            key: _remove_keys(value, rubbish) for key, value in obj.items() if key not in rubbish
        }
    elif isinstance(obj, list):
        obj = [
            _remove_keys(item, rubbish) for item in obj if item not in rubbish
        ]
    return obj
