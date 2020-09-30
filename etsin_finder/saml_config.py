# This file is part of the Etsin service
#
# Copyright 2017-2020 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Get saml configurations for authentication purposes"""

import json
from etsin_finder.log import log

def get_saml_config_from_file():
    """Get saml config.

    Returns:
        saml_config

    """
    with open('/home/etsin-user/etsin/settings.json') as saml_json_file:
        return json.load(saml_json_file)

def get_sso_key():
    """Get SSO key from saml config.

    Returns:
        saml_config

    """
    data = get_saml_config_from_file()
    return data.get('sp').get('privateKey')
