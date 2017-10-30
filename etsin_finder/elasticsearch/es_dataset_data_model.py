import json


class ESDatasetModel:
    """
    Class for Metax dataset data that can be indexed into Etsin Elasticsearch
    """

    def __init__(self, doc_obj):
        self.doc_obj = doc_obj

    def to_es_document_string(self):
        return json.dumps(self.doc_obj)

    def get_es_document_id(self):
        return self.doc_obj['urn_identifier']
