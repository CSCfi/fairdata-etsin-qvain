# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""URL variable converters"""

from werkzeug.routing import BaseConverter

identifier_regex = r"[0-9a-z\-]+"

class IdentifierConverter(BaseConverter):
    """Restrict allowed characters for catalog record identifiers."""

    regex = identifier_regex
