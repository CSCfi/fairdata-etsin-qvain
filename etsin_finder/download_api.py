# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

from flask import Response, stream_with_context
from requests import get

from etsin_finder.finder import app


log = app.logger


class DownloadAPIService:
    def __init__(self, download_api_config):
        if download_api_config:
            self.DOWNLOAD_API_BASE_URL = 'https://{0}/api/v1/dataset'.format(download_api_config['HOST']) + '/{0}'
            self.TIMEOUT = 1800

    def download(self, cr_id, file_ids, dir_ids):
        url = self._create_url(cr_id, file_ids, dir_ids)
        req = get(url, stream=True, timeout=self.TIMEOUT)
        res = Response(response=stream_with_context(req.iter_content(chunk_size=1024)), status=req.status_code)

        if 'Content-Type' in req.headers:
            res.headers['Content-Type'] = req.headers['Content-Type']
        if 'Content-Disposition' in req.headers:
            res.headers['Content-Disposition'] = req.headers['Content-Disposition']
        if 'Content-Length' in req.headers:
            res.headers['Content-Length'] = req.headers['Content-Length']
        return res

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
