// Constants used in Etsin and Qvain Light

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
}

export const REMS_URL = 'https://vm1446.kaj.pouta.csc.fi'

export const QVAIN_URL = 'https://qvain.fairdata.fi'

export const METAX_FAIRDATA_ROOT_URL = 'https://metax.fairdata.fi'

export const FAIRDATA_WEBSITE_URL = {
  FI: 'https://www.fairdata.fi/etsin/',
  EN: 'https://www.fairdata.fi/en/etsin/'
}

export const LICENSE_URL = {
  CCBY4: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
}

// Qvain Light

export const DATASET_URLS = {
  EDIT_DATASET_URL: '/api/datasets/edit',
  DATASET_URL: '/api/dataset',
  USER_DATASETS_URL: '/api/datasets/',
  V2_EDIT_DATASET_URL: '/api/v2/datasets/edit',
  V2_DATASET_URL: '/api/v2/dataset',
  V2_USER_DATASETS_URL: '/api/v2/datasets/',
  V2_CREATE_NEW_VERSION: '/api/v2/rpc/datasets/create_new_version',
  V2_CREATE_DRAFT: '/api/v2/rpc/datasets/create_draft',
  V2_MERGE_DRAFT: '/api/v2/rpc/datasets/merge_draft',
  V2_PUBLISH_DATASET: '/api/v2/rpc/datasets/publish_dataset',
}

export const FILE_API_URLS = {
  DIR_URL: '/api/files/directory/',
  PROJECT_DIR_URL: '/api/files/project/',
  DATASET_DIR_URL: '/api/files/',
  V2_DIR_URL: '/api/v2/files/directory/',
  V2_PROJECT_DIR_URL: '/api/v2/files/project/',
  V2_DATASET_DIR_URL: '/api/v2/files/',
  V2_DATASET_PROJECTS: '/api/v2/datasets/projects/',
  V2_DATASET_FILES: '/api/v2/datasets/files/',
  V2_DATASET_USER_METADATA: '/api/v2/datasets/user_metadata/',
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
}

const PRESERVATION_STATE_COLOR = {
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
  70: {
    name: 'Valid metadata',
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
