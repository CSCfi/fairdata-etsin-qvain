import requests
from requests import HTTPError
import json
from etsin_finder.finder import app

log = app.logger

TIMEOUT = 30


class MetaxAPIService:

    def __init__(self, metax_api_config):
        self.METAX_CATALOG_RECORDS_BASE_URL = 'https://{0}/rest/datasets'.format(metax_api_config['HOST'])
        self.METAX_GET_URN_IDENTIFIERS_URL = self.METAX_CATALOG_RECORDS_BASE_URL + '/urn_identifiers'
        self.METAX_GET_CATALOG_RECORD_URL = self.METAX_CATALOG_RECORDS_BASE_URL + '/{0}'

    def get_catalog_record(self, urn_identifier):
        """ Get a catalog record with a given urn_identifier from MetaX API.

        :return: Metax catalog record as json
        """

        r = requests.get(self.METAX_GET_CATALOG_RECORD_URL.format(urn_identifier),
                         headers={'Content-Type': 'application/json'},
                         timeout=TIMEOUT)
        try:
            r.raise_for_status()
        except HTTPError as e:
            log.error('Failed to get catalog record: \nurn_identifier={urn_id}, \nerror={error}, \njson={json}'.format(
                urn_id=urn_identifier, error=repr(e), json=self.json_or_empty(r)))
            return None
            log.debug('Response text: %s', r.text)

        return json.loads(r.text)

    def get_all_catalog_record_urn_identifiers(self):
        """ Get urn_identifiers of all catalog records in MetaX API.

        :return: List of urn_identifiers
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

    def check_catalog_record_exists(self, urn_identifier):
        """ Ask MetaX whether the catalog record exists in MetaX by using urn_identifier.

        :return: True/False
        """
        r = requests.get(
            self.METAX_CATALOG_RECORDS_BASE_URL + '/{id}/exists'.format(id=urn_identifier), timeout=TIMEOUT)
        try:
            r.raise_for_status()
        except Exception as e:
            log.error(e)
            log.error("Error when connecting to MetaX dataset exists API")
            raise e
            log.debug('Checked catalog record existence in MetaX: ({code}) {json}'.format(
                code=r.status_code, json=r.json()))
        return r.json()

    @staticmethod
    def json_or_empty(response):
        response_json = ""
        try:
            response_json = response.json()
        except Exception:
            pass
        return response_json
