# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Functionalities for download data from Download API"""

from flask import Response, stream_with_context, current_app
import requests

from etsin_finder.app_config import get_metax_api_config
from etsin_finder.log import log

from etsin_finder.utils.utils import FlaskService, format_url


class DatasetMetadataService(FlaskService):
    """Dataset Metadata Service"""

    def __init__(self, app):
        """Initialize with necessary configs for metax

        Arguments:
            app (object): The Flask app

        """
        super().__init__(app)
        metax_api_config = get_metax_api_config(app)

        if metax_api_config:
            self.HOST = 'https://{0}'.format(metax_api_config.get('HOST'))
            self.user = metax_api_config.get('USER')
            self.password = metax_api_config.get('PASSWORD')
            self.verify_ssl = metax_api_config.get('VERIFY_SSL', True)
        elif not self.is_testing:
            log.error('Unable to initialize DatasetMetadataService due to missing config')

    @staticmethod
    def _get_error_response(status_code):
        """Create an error response for service

        Arguments:
            status_code (int): The status code to return

        Returns:
            obj: Returns a Flask.Response object

        """
        response = Response(status=status_code)
        response.headers['Content-Type'] = 'application/octet-stream'
        response.headers['Content-Disposition'] = 'attachment; filename="error"'
        return response

    def download_metadata(self, cr_id, metadata_format):
        """Stream metadata download of a dataset to frontend

        Arguments:
            cr_id (str): Identifier of dataset
            metadata_format (str): The format to download in

        Returns:
            Returns a Flask.Response object streaming the response from metax

        """
        if self.is_testing:
            return self._get_error_response(200)

        if metadata_format == 'metax':
            url = format_url(self.HOST + '/rest/datasets/{}.json', cr_id)
        else:
            url = format_url(self.HOST + '/rest/datasets/{}?dataset_format={}', cr_id, metadata_format)

        log.info('Request dataset metadata from: {0}'.format(url))

        try:
            metax_response = requests.get(url,
                                          stream=True,
                                          timeout=15,
                                          verify=self.verify_ssl,
                                          auth=(self.user, self.password))
            metax_response.raise_for_status()
        except requests.Timeout as t:
            log.error('Attempt to download dataset metadata timed out\n{0}'.format(t))
            return self._get_error_response(metax_response.status_code)
        except requests.ConnectionError as c:
            log.error('Unable to connect to Metax\n{0}'.format(c))
            return self._get_error_response(metax_response.status_code)
        except requests.HTTPError:
            log.warning('Metax returned an unsuccessful status code: {0}\n\
                Response: {1}'.format(metax_response.status_code, metax_response))
            return self._get_error_response(metax_response.status_code)
        except Exception as e:
            log.error('Error trying to download dataset metadata:\n{0}'.format(e))
            return self._get_error_response(metax_response.status_code)
        else:
            response = Response(response=stream_with_context(metax_response.iter_content(chunk_size=1024)),
                                status=metax_response.status_code)

            if 'Content-Type' in metax_response.headers:
                response.headers['Content-Type'] = metax_response.headers.get('Content-Type')
            if 'Content-Disposition' in metax_response.headers:
                response.headers['Content-Disposition'] = metax_response.headers.get('Content-Disposition')
            if 'Content-Length' in metax_response.headers:
                response.headers['Content-Length'] = metax_response.headers.get('Content-Length')

            log.debug('Download URL: {0} Responded with HTTP status {1}'.format(url, response.status_code))
            return response

def download_metadata(cr_id, metadata_format):
    """Stream metadata download of a dataset to frontend"""
    metadata_api = DatasetMetadataService(current_app)
    return metadata_api.download_metadata(cr_id, metadata_format)
