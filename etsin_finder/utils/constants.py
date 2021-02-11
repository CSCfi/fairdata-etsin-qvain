"""Various constants"""

ACCESS_TYPES = {
    'open': 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
    'login': 'http://uri.suomi.fi/codelist/fairdata/access_type/code/login',
    'permit': 'http://uri.suomi.fi/codelist/fairdata/access_type/code/permit',
    'embargo': 'http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo',
    'restricted': 'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted'
}

ACCESS_DENIED_REASON = {
    'EMBARGO': 'EMBARGO',
    'NEED_LOGIN': 'NEED_LOGIN',
    'NEED_REMS_PERMISSION': 'NEED_REMS_PERMISSION',
    'RESTRICTED': 'RESTRICTED',
}

SAML_ATTRIBUTES = {
    'first_name': 'urn:oid:2.5.4.42',
    'last_name': 'urn:oid:2.5.4.4',
    'email': 'urn:oid:0.9.2342.19200300.100.1.3',
    'haka_id': 'urn:oid:1.3.6.1.4.1.5923.1.1.1.6',
    'haka_org_id': 'urn:oid:1.3.6.1.4.1.25178.1.2.9',
    'haka_org_name': 'urn:oid:1.3.6.1.4.1.16161.4.0.88',
    'CSC_username': 'urn:oid:1.3.6.1.4.1.16161.4.0.53',
    'idm_groups': 'urn:oid:1.3.6.1.4.1.8057.2.80.26'
}

DATA_CATALOG_IDENTIFIERS = {
    'ida': 'urn:nbn:fi:att:data-catalog-ida',
    'att': 'urn:nbn:fi:att:data-catalog-att'
}

AGENT_TYPE = {
    'CREATOR': 'CREATOR',
    'PUBLISHER': 'PUBLISHER',
    'CONTRIBUTOR': 'CONTRIBUTOR',
    'RIGHTS_HOLDER': 'RIGHTS_HOLDER',
    'CURATOR': 'CURATOR'
}
