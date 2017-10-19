import requests
from requests import HTTPError
import json
from etsin_finder.finder import app

log = app.logger

TIMEOUT = 30


class MetaxAPIService:

    def __init__(self):
        self.METAX_DATASETS_BASE_URL = 'https://{0}/rest/datasets'.format(app.config['METAX_API']['HOST'])
        self.METAX_GET_URN_IDENTIFIERS_URL = self.METAX_DATASETS_BASE_URL + '/urn_identifiers'
        self.METAX_GET_DATASET_URL = self.METAX_DATASETS_BASE_URL + '/{0}'

    def json_or_empty(response):
        response_json = ""
        try:
            response_json = response.json()
        except:
            pass
        return response_json

    def get_dataset(self, urn_identifier):
        """ Get a dataset with a given urn_identifier from MetaX API.

        :return: Metax response as json
        """

        r = requests.get(self.METAX_GET_DATASET_URL.format(urn_identifier),
                            headers={'Content-Type': 'application/json'},
                            timeout=TIMEOUT)
        try:
            r.raise_for_status()
        except HTTPError as e:
            log.error('Failed to get dataset: \nurn_identifier={urn_id}, \nerror={error}, \njson={json}'.format(
                urn_id=urn_identifier, error=repr(e), json=self.json_or_empty(r)))
            return None
            log.debug('Response text: %s', r.text)

        return json.loads(r.text)

    def get_all_dataset_urn_identifiers(self):
        """ Get urn_identifiers of all datasets in MetaX API.

        :return: List of urn_identfiers
        """
        r = requests.get(self.METAX_GET_URN_IDENTIFIERS_URL,
                            headers={'Content-Type': 'application/json'},
                            timeout=TIMEOUT)
        try:
            r.raise_for_status()
        except HTTPError as e:
            log.error('Failed to urn_identifiers from Metax: \nerror={error}, \njson={json}'.format(
                error=repr(e), json=self.json_or_empty(r)))
            return None

        return json.loads(r.text)

    def check_dataset_exists(self, urn_identifier):
        """ Ask MetaX whether the dataset exists in MetaX by using urn_identifier.

        :return: True/False
        """
        r = requests.get(
            self.METAX_DATASETS_BASE_URL + '/{id}/exists'.format(id=urn_identifier), timeout=TIMEOUT)
        try:
            r.raise_for_status()
        except Exception as e:
            log.error(e)
            log.error("Error when connecting to MetaX dataset exists API")
            raise e
            log.debug('Checked dataset existence in MetaX: ({code}) {json}'.format(
            code=r.status_code, json=r.json()))
        return r.json()
