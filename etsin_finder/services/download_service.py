# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Functionalities for download data from Download API"""

from flask import Response, stream_with_context, current_app
import requests
from urllib import parse

from etsin_finder.app_config import get_download_api_config
from etsin_finder.log import log

from etsin_finder.utils.utils import FlaskService, format_url


class DownloadAPIService(FlaskService):
    """Download API Service"""

    def __init__(self, app):
        """Setup Download API Service.

        Args:
            app (object): flask.Flask object instance.

        """
        super().__init__(app)

        dl_api_config = get_download_api_config(app)

        if dl_api_config:
            self.API_BASE_URL = 'https://{0}:{1}/secure/api/v1/dataset'.format(
                dl_api_config.get('HOST'), dl_api_config.get('PORT')) + '/{0}'
            self.USER = dl_api_config.get('USER')
            self.PASSWORD = dl_api_config.get('PASSWORD')
        elif not self.is_testing:
            log.error('Unable to initialize DownloadAPIService due to missing config')

    def download(self, cr_id, file_ids, dir_ids):
        """Download files from Download API.

        Args:
            cr_id (string): Catalog record identifier.
            file_ids (list): File identifiers.
            dir_ids (list): Directory identifiers.

        Returns:
            flask.Response: If success, stream the download to the frontend, else, return an unsuccessfull response.

        """
        if self.is_testing:
            return self._get_error_response(200)

        url = self._create_url(cr_id, file_ids, dir_ids)
        try:
            dl_api_response = requests.get(url, stream=True, timeout=15, auth=(self.USER,
                                                                               self.PASSWORD.encode('utf-8')))
            dl_api_response.raise_for_status()
        except requests.Timeout as t:
            log.error('Request to Download API timed out\n{0}'.format(t))
            return self._get_error_response(dl_api_response.status_code)
        except requests.ConnectionError as c:
            log.error('Unable to connect to Download API\n{0}'.format(c))
            return self._get_error_response(dl_api_response.status_code)
        except requests.HTTPError:
            log.warning('Download API returned an unsuccessful status code: {0}\n\
                Response: {1}'.format(dl_api_response.status_code, dl_api_response))
            return self._get_error_response(dl_api_response.status_code)
        except Exception as e:
            log.error('Error in Download:\n{0}'.format(e))
            return self._get_error_response(dl_api_response.status_code)
        else:
            response = Response(response=stream_with_context(dl_api_response.iter_content(chunk_size=1024)),
                                status=dl_api_response.status_code)

            if 'Content-Type' in dl_api_response.headers:
                response.headers['Content-Type'] = dl_api_response.headers.get('Content-Type')
            if 'Content-Disposition' in dl_api_response.headers:
                response.headers['Content-Disposition'] = dl_api_response.headers.get('Content-Disposition')
            if 'Content-Length' in dl_api_response.headers:
                response.headers['Content-Length'] = dl_api_response.headers.get('Content-Length')

            log.debug('Download URL: {0} Responded with HTTP status {1}'.format(url, dl_api_response.status_code))
            return response

    @staticmethod
    def _get_error_response(status_code):
        """Create an error response

        Args:
            status_code (int): The status code returned from the response.

        Returns:
            flask.Response: A flask Response object with the correct error.

        """
        response = Response(status=status_code)
        response.headers['Content-Type'] = 'application/octet-stream'
        response.headers['Content-Disposition'] = 'attachment; filename="error"'
        return response

    def _create_url(self, cr_id, file_ids, dir_ids):
        """Create url

        Create a formatted url form the arguments to use with download.

        Args:
            cr_id (str): The catalog record identifier.
            file_ids (list): List with the file identifiers.
            dir_ids (list): List with the directory identifiers.

        Returns:
            str: Returns a formatted url.

        """
        url = format_url(self.API_BASE_URL, cr_id)
        if file_ids or dir_ids:
            params = {}
            if file_ids:
                params['file'] = file_ids
            if dir_ids:
                params['dir'] = dir_ids
            params_str = parse.urlencode(params, doseq=True, quote_via=parse.quote, safe='')
            url += '?' + params_str

        log.debug('Download service URL to be requested: ' + url)
        return url


def download_data(cr_id, file_ids, dir_ids):
    """Public method for downloading data from Download API."""
    _dl_api = DownloadAPIService(current_app)
    return _dl_api.download(cr_id, file_ids, dir_ids)
