# This file is part of the Etsin service
#
# Copyright 2017-2020 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Get saml configurations for authentication purposes"""

import json

def get_etsin_saml_config_from_file():
    """Get Etsin saml config.

    Returns:
        saml_config

    """
    with open('/home/etsin-user/etsin/settings.json') as saml_json_file:
        return json.load(saml_json_file)
