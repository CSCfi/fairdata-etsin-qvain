import json
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
from os import path

import logging

log = logging.getLogger(__name__)


class ElasticSearchService:
    """
    Service for operating with Elasticsearch APIs
    """

    INDEX_NAME = 'metax'
    INDEX_CONFIG_FILENAME = 'metax_index_definition.json'
    INDEX_DOC_TYPE_NAME = 'dataset'
    INDEX_DOC_TYPE_MAPPING_FILENAME = 'dataset_type_mapping.json'
    BULK_OPERATION_ROW_SIZE = 5

    def __init__(self, app, hosts, connection_parameters):
        self.app = app
        self.es = Elasticsearch(hosts, **connection_parameters)

    def index_exists(self):
        return self.es.indices.exists(index=self.INDEX_NAME)

    def create_index(self):
        log.info("Trying to create index " + self.INDEX_NAME)
        return self._operation_ok(self.es.indices.create(index=self.INDEX_NAME,
                                                         body=self._get_json_file_as_str(self.INDEX_CONFIG_FILENAME)))

    def delete_index(self):
        log.info("Trying to delete index " + self.INDEX_NAME)
        return self._operation_ok(self.es.indices.delete(index=self.INDEX_NAME, ignore=[404]))

    def create_type_mapping(self):
        log.info("Trying to create mapping type " + self.INDEX_DOC_TYPE_NAME + " for index " + self.INDEX_NAME)
        return self._operation_ok(
            self.es.indices.put_mapping(index=self.INDEX_DOC_TYPE_NAME, doc_type=self.INDEX_DOC_TYPE_NAME,
                                        body=self._get_json_file_as_str(self.INDEX_DOC_TYPE_MAPPING_FILENAME)))

    def bulk_update_data(self, dataset_data_models):
        bulk_update_str = ''
        for item_no, dataset_data in enumerate(dataset_data_models, start=1):
            bulk_update_str += self._create_bulk_update_row(dataset_data) + "\n"
            if item_no % self.BULK_OPERATION_ROW_SIZE == 0:
                log.info("Trying to bulk update data with type " + self.INDEX_DOC_TYPE_NAME +
                         " to index " + self.INDEX_NAME + " with batch size of " + self.BULK_OPERATION_ROW_SIZE)
                log.info(bulk_update_str)
                self._operation_ok(self.es.bulk(body=bulk_update_str, request_timeout=30))
                bulk_update_str = ''

    def bulk_delete_data(self, doc_id_list):
        bulk_delete_str = ''
        for item_no, doc_id in enumerate(doc_id_list, start=1):
            bulk_delete_str += self._create_bulk_delete_row(doc_id) + "\n"
            if item_no % self.BULK_OPERATION_ROW_SIZE == 0:
                log.info("Trying to bulk delete data with type " + self.INDEX_DOC_TYPE_NAME +
                         " to index " + self.INDEX_NAME + " with batch size of " + self.BULK_OPERATION_ROW_SIZE)
                log.info(bulk_delete_str)
                self._operation_ok(self.es.bulk(body=bulk_delete_str, request_timeout=30))
                bulk_delete_str = ''

    def _delete_all_documents_from_index(self):
        print("Trying to delete all documents from index " + self.INDEX_NAME)
        return self._operation_ok(self.es.delete_by_query(index=self.INDEX_NAME,
                                                          body="{\"query\": { \"match_all\": {}}}"))

    def _empty_all_documents_from_index(self):
        log.info("Trying to delete all documents from index " + self.INDEX_NAME)
        return self._operation_ok(self.es.delete_by_query(index=self.INDEX_NAME,
                                                          body="{\"query\": { \"match_all\": {}}}"))

    def _create_bulk_update_row(self, dataset_data_model):
        return "{\"index\":{\"_index\": \"" + self.INDEX_NAME + "\", \"_type\": \"" + self.INDEX_DOC_TYPE_NAME \
               + "\", \"_id\":\"" + dataset_data_model.get_es_document_id() + "\"}}\n" + \
               dataset_data_model.to_es_document()

    def _create_bulk_delete_row(self, doc_id):
        return "{\"delete\":{\"_index\": \"" + self.INDEX_NAME + "\", \"_type\": \"" + self.INDEX_DOC_TYPE_NAME + \
              "\", \"_id\":\"" + doc_id + "\"}}"

    def get_all_doc_ids_from_index(self):
        if not self.index_exists():
            log.error("No index exists")
            return None

        all_rows = scan(self.es, query={'query': {'match_all': {}}, "_source": False}, index=self.INDEX_NAME)
        all_doc_ids = map(lambda doc: doc['_id'], all_rows)
        log.info(all_doc_ids)
        return all_doc_ids

    def _operation_ok(self, op_response):
        if op_response.get('acknowledged'):
            return True
        return False

    def _get_json_file_as_str(self, filename):
        with open(path.dirname(__file__) + '/resources/' + filename) as json_data:
            return json.load(json_data)
