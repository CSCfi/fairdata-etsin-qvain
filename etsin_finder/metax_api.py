import json

import requests
from requests import HTTPError

from etsin_finder.finder import app

log = app.logger

TIMEOUT = 30


class MetaxAPIService:

    def __init__(self, metax_api_config):
        if metax_api_config:
            METAX_CATALOG_RECORDS_BASE_URL = 'https://{0}/rest/datasets'.format(metax_api_config['HOST'])
            METAX_GET_CATALOG_RECORD_URL = METAX_CATALOG_RECORDS_BASE_URL + '/{0}?preferred_identifier'

            self.METAX_GET_CATALOG_RECORD_WITH_FILE_DETAILS_URL = METAX_GET_CATALOG_RECORD_URL + '&file_details'
            self.METAX_GET_REMOVED_CATALOG_RECORD_URL = METAX_GET_CATALOG_RECORD_URL + '&removed=true'

    def get_catalog_record_with_file_details(self, identifier):
        """ Get a catalog record with a given identifier from MetaX API.

        :return: Metax catalog record as json
        """
        r = requests.get(self.METAX_GET_CATALOG_RECORD_WITH_FILE_DETAILS_URL.format(identifier),
                         headers={'Content-Type': 'application/json'},
                         timeout=TIMEOUT)
        try:
            r.raise_for_status()
        except HTTPError as e:
            log.error('Failed to get catalog record: \nidentifier={identifier}, \nerror={error}, \njson={json}'.format(
                identifier=identifier, error=repr(e), json=self.json_or_empty(r)))
            log.debug('Response text: %s', r.text)
            return None

        return json.loads(r.text)

    def get_removed_catalog_record(self, identifier):
        """ Get a catalog record with a given identifier from a MetaX API which should return only datasets that
            are removed.

        :return: Metax catalog record as json
        """

        r = requests.get(self.METAX_GET_REMOVED_CATALOG_RECORD_URL.format(identifier),
                         headers={'Content-Type': 'application/json'},
                         timeout=TIMEOUT)
        try:
            r.raise_for_status()
        except HTTPError as e:
            log.error('Failed to get catalog record: \nidentifier={identifier}, \nerror={error}, \njson={json}'.format(
                identifier=identifier, error=repr(e), json=self.json_or_empty(r)))
            log.debug('Response text: %s', r.text)
            return None

        return json.loads(r.text)

    @staticmethod
    def json_or_empty(response):
        response_json = ""
        try:
            response_json = response.json()
        except Exception:
            pass
        return response_json
