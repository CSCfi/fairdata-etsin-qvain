import os
from os import path
import json


def executing_travis():
    """
    Returns True whenever code is being executed by travis
    """
    return True if os.getenv('TRAVIS', False) else False


def get_elasticsearch_config(config):
    es_conf = config.get('ELASTICSEARCH', None)
    if not es_conf or not isinstance(es_conf, dict):
        return None

    return es_conf


def get_metax_api_config(config):
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


def load_test_data_into_es(config, delete_index_first=False):
    from etsin_finder.elasticsearch.elasticsearch_service import ElasticSearchService
    es_config = get_elasticsearch_config(config)
    test_data_file_path = path.abspath(os.path.dirname(__file__)) + '/test_data/es_dataset_bulk_request_1.txt'

    if es_config:
        es_client = ElasticSearchService(es_config)
        if es_client:
            if delete_index_first:
                es_client.delete_index()

            if not es_client.index_exists():
                if not es_client.create_index_and_mapping():
                    return False

            with open(test_data_file_path, 'r') as file:
                data = file.read()
            if es_client and data:
                es_client.do_bulk_request(data)
