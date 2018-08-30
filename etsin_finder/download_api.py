# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

from flask import Response, stream_with_context
from flask_restful import abort
from requests import get, exceptions

from etsin_finder.finder import app


log = app.logger


class DownloadAPIService:
    def __init__(self, download_api_config):
        if download_api_config:
            self.DOWNLOAD_API_BASE_URL = 'https://{0}/api/v1/dataset'.format(download_api_config['HOST']) + '/{0}'
            self.TIMEOUT = 5 # If no bytes have been received on the underlying socket for timeout seconds

    def download(self, cr_id, file_ids, dir_ids):
        url = self._create_url(cr_id, file_ids, dir_ids)
        try:
            dl_api_response = get(url, stream=True, timeout=self.TIMEOUT)
            dl_api_response.raise_for_status()
        except exceptions.Timeout:
            log.error("Request to Download API timed out")
            return abort(400, message="Unable to get files. Please try again later.")
        except exceptions.ConnectionError:
            log.error("Unable to connect to Download API")
            return abort(400, message="Unable to get files. Please try again later.")
        except exceptions.HTTPError:
            log.debug("Download API returned an unsuccessful status code")
            return '', 404
        else:
            response = Response(response=stream_with_context(dl_api_response.iter_content(chunk_size=1024)),
                                status=dl_api_response.status_code)

            if 'Content-Type' in dl_api_response.headers:
                response.headers['Content-Type'] = dl_api_response.headers['Content-Type']
            if 'Content-Disposition' in dl_api_response.headers:
                response.headers['Content-Disposition'] = dl_api_response.headers['Content-Disposition']
            if 'Content-Length' in dl_api_response.headers:
                response.headers['Content-Length'] = dl_api_response.headers['Content-Length']

            return response

    def _create_url(self, cr_id, file_ids, dir_ids):
        url = self.DOWNLOAD_API_BASE_URL.format(cr_id)
        if file_ids or dir_ids:
            params = ''
            for file_id in file_ids:
                params += '&file={0}'.format(file_id) if params else 'file={0}'.format(file_id)
            for dir_id in dir_ids:
                params += '&dir={0}'.format(dir_id) if params else 'dir={0}'.format(dir_id)
            url += '?' + params

        log.debug("Download service URL to be requested: " + url)
        return url
