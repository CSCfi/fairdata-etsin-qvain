// Constants used in Etsin and Qvain

export const DOWNLOAD_API_REQUEST_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
}

export const ACCESS_TYPE_URL = {
  EMBARGO: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo',
  OPEN: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
  LOGIN: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/login',
  PERMIT: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/permit',
  RESTRICTED: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted',
}

export const DATA_CATALOG_IDENTIFIER = {
  IDA: 'urn:nbn:fi:att:data-catalog-ida',
  ATT: 'urn:nbn:fi:att:data-catalog-att',
  PAS: 'urn:nbn:fi:att:data-catalog-pas',
  DFT: 'urn:nbn:fi:att:data-catalog-dft',
}

export const REMS_URL = 'https://vm1446.kaj.pouta.csc.fi'

export const LEGACY_QVAIN_URL = 'https://qvain.fairdata.fi'

export const METAX_FAIRDATA_ROOT_URL = 'https://metax.fairdata.fi'

export const FAIRDATA_WEBSITE_URL = {
  ETSIN: {
    FI: 'https://www.fairdata.fi/etsin/',
    EN: 'https://www.fairdata.fi/en/etsin/',
  },
  QVAIN: {
    FI: 'https://www.fairdata.fi/qvain/',
    EN: 'https://www.fairdata.fi/en/qvain/',
  },
}

export const LICENSE_URL = {
  CCBY4: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
}

export const USE_CATEGORY_URL = {
  OUTCOME_MATERIAL: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/outcome',
}

export const CUMULATIVE_STATE = {
  NO: 0,
  YES: 1,
  CLOSED: 2,
}

export const ENTITY_TYPE = {
  PERSON: 'person',
  ORGANIZATION: 'organization',
}

export const ROLE = {
  CREATOR: 'creator',
  PUBLISHER: 'publisher',
  CURATOR: 'curator',
  RIGHTS_HOLDER: 'rights_holder',
  CONTRIBUTOR: 'contributor',
  PROVENANCE: 'provenance',
}

export const PRESERVATION_STATE_COLOR = {
  DEFAULT: 'primary',
  // WAIT: 'primary',
  // FAIL: 'error',
  // SUCCESS: 'success'
}

export const PRESERVATION_STATE = {
  0: {
    name: 'Waits for validation',
    type: 'wait',
    who: 'other',
    color: PRESERVATION_STATE_COLOR.DEFAULT,
  },
  10: {
    name: 'Proposed for digital preservation',
    type: 'wait',
    who: 'system',
    color: PRESERVATION_STATE_COLOR.DEFAULT,
  },
  20: {
    name: 'Technical metadata generated',
    type: 'wait',
    who: 'system',
    color: PRESERVATION_STATE_COLOR.DEFAULT,
  },
  30: {
    name: 'Technical metadata generation failed',
    type: 'fail',
    who: 'system',
    color: PRESERVATION_STATE_COLOR.DEFAULT,
  },
  40: {
    name: 'Invalid metadata',
    type: 'wait',
    who: 'user',
    color: PRESERVATION_STATE_COLOR.DEFAULT,
  },
  50: {
    name: 'Metadata validation failed',
    type: 'fail',
    who: 'user',
    color: PRESERVATION_STATE_COLOR.DEFAULT,
  },
  60: {
    name: 'Validated metadata updated',
    type: 'wait',
    who: 'system',
    color: PRESERVATION_STATE_COLOR.DEFAULT,
  },
  65: {
    name: 'Metadata is being validated',
    type: 'wait',
    who: 'system',
    color: PRESERVATION_STATE_COLOR.DEFAULT,
  },
  70: {
    name: 'Valid metadata',
    type: 'wait',
    who: 'other',
    color: PRESERVATION_STATE_COLOR.DEFAULT,
  },
  75: {
    name: 'Metadata confirmed',
    type: 'wait',
    who: 'other',
    color: PRESERVATION_STATE_COLOR.DEFAULT,
  },
  80: {
    name: 'Accepted to digital preservation',
    type: 'wait',
    who: 'system',
    color: PRESERVATION_STATE_COLOR.DEFAULT,
  },
  90: {
    name: 'In packaging service',
    type: 'wait',
    who: 'system',
    color: PRESERVATION_STATE_COLOR.DEFAULT,
  },
  100: {
    name: 'Packaging failed',
    type: 'fail',
    who: 'system',
    color: PRESERVATION_STATE_COLOR.DEFAULT,
  },
  110: {
    name: 'SIP sent to ingestion in digital preservation service',
    type: 'wait',
    who: 'system',
    color: PRESERVATION_STATE_COLOR.DEFAULT,
  },
  120: {
    name: 'In digital preservation',
    type: 'success',
    who: 'system',
    color: PRESERVATION_STATE_COLOR.DEFAULT,
  },
  130: {
    name: 'Rejected in digital preservation service',
    type: 'fail',
    who: 'system',
    color: PRESERVATION_STATE_COLOR.DEFAULT,
  },
  140: {
    name: 'In dissemination',
    type: 'success',
    who: 'system',
    color: PRESERVATION_STATE_COLOR.DEFAULT,
  },
}

export const DATASET_STATE = {
  NEW: 'NEW',
  DRAFT: 'DRAFT',
  UNPUBLISHED_DRAFT: 'UNPUBLISHED_DRAFT',
  PUBLISHED: 'PUBLISHED',
  UNKNOWN: 'UNKNOWN',
}
