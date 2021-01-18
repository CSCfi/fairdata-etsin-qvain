# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Utils for making requests"""

import requests
from etsin_finder.log import log

from etsin_finder.utils.utils import json_or_text


def get_request_url(url, *args, **kwargs):
    """Returns url parameter that request will use"""
    return url


def make_request(request_func, *args, **kwargs):
    """
    Helper for handling and logging errors from requests.

    Arguments:
      request_func (function): Function that will make the request
      *args, **kwargs: Arguments that will be passed to request_func

    Returns (as tuple):
      body (dict|str): The response body as parsed json (if possible) or text
      status (int): Response HTTP status code
      success (bool): True if no exceptions occurred

    """
    response = None
    success = False
    url = get_request_url(*args, **kwargs)
    try:
        response = request_func(*args, **kwargs)
        response.raise_for_status()
        success = True
    except requests.Timeout as e:
        log.error(f'Request to {url} timed out\n{e}')
        return str(e), 503, False
    except requests.ConnectionError as e:
        log.error(f'Unable to connect to {url}\n{e}')
        return str(e), 503, False
    except requests.HTTPError:
        log.warning(
            "\nResponse status code: {0}\nResponse text: {1}".format(
                response.status_code,
                json_or_text(response)
            ))
    except Exception as e:
        log.error(f'Error {type(e)} at {url}\n{e}')
        return str(e), 500, False
    return json_or_text(response), response.status_code, success
