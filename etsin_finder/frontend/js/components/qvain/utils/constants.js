export const AccessTypeURLs = {
  EMBARGO: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo',
  OPEN: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
  LOGIN: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/login',
  PERMIT: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/permit',
  RESTRICTED: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted',
}

export const LicenseUrls = {
  CCBY4: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
}

export const FileAPIURLs = {
  DIR_URL: '/api/files/directory/',
  PROJECT_DIR_URL: '/api/files/project/',
  DATASET_DIR_URL: '/api/files/'
}

export const UseCategoryURLs = {
  OUTCOME_MATERIAL: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/outcome',
}

export const DataCatalogIdentifiers = {
  IDA: 'urn:nbn:fi:att:data-catalog-ida',
  ATT: 'urn:nbn:fi:att:data-catalog-att',
  PAS: 'urn:nbn:fi:att:data-catalog-pas'
}

export const CumulativeStates = {
  NO: 0,
  YES: 1,
  CLOSED: 2,
}

export const EntityType = {
  PERSON: 'person',
  ORGANIZATION: 'organization',
}

export const Role = {
  CREATOR: 'creator',
  PUBLISHER: 'publisher',
  CURATOR: 'curator',
  RIGHTS_HOLDER: 'rights_holder',
  CONTRIBUTOR: 'contributor',
}

const PreservationStateColor = {
  WAIT: 'primary',
  FAIL: 'error',
  SUCCESS: 'success'
}

export const PreservationStates = {
  0: {
    name: 'Waits for validation',
    type: 'wait',
    who: 'other',
    color: PreservationStateColor.WAIT
  },
  10: {
    name: 'Proposed for digital preservation',
    type: 'wait',
    who: 'system',
    color: PreservationStateColor.WAIT
  },
  20: {
    name: 'Technical metadata generated',
    type: 'wait',
    who: 'system',
    color: PreservationStateColor.WAIT
  },
  30: {
    name: 'Technical metadata generation failed',
    type: 'fail',
    who: 'system',
    color: PreservationStateColor.FAIL
  },
  40: {
    name: 'Invalid metadata',
    type: 'wait',
    who: 'user',
    color: PreservationStateColor.WAIT
  },
  50: {
    name: 'Metadata validation failed',
    type: 'fail',
    who: 'user',
    color: PreservationStateColor.FAIL
  },
  60: {
    name: 'Validated metadata updated',
    type: 'wait',
    who: 'system',
    color: PreservationStateColor.WAIT
  },
  70: {
    name: 'Valid metadata',
    type: 'wait',
    who: 'other',
    color: PreservationStateColor.WAIT
  },
  80: {
    name: 'Accepted to digital preservation',
    type: 'wait',
    who: 'system',
    color: PreservationStateColor.WAIT
  },
  90: {
    name: 'In packaging service',
    type: 'wait',
    who: 'system',
    color: PreservationStateColor.WAIT
  },
  100: {
    name: 'Packaging failed',
    type: 'fail',
    who: 'system',
    color: PreservationStateColor.FAIL
  },
  110: {
    name: 'SIP sent to ingestion in digital preservation service',
    type: 'wait',
    who: 'system',
    color: PreservationStateColor.WAIT
  },
  120: {
    name: 'In digital preservation',
    type: 'success',
    who: 'system',
    color: PreservationStateColor.SUCCESS
  },
  130: {
    name: 'Rejected in digital preservation service',
    type: 'fail',
    who: 'system',
    color: PreservationStateColor.FAIL
  },
  140: {
    name: 'In dissemination',
    type: 'success',
    who: 'system',
    color: PreservationStateColor.SUCCESS
  }
}
