// Constants used in Etsin and Qvain

export const DOWNLOAD_API_REQUEST_STATUS = {
  PENDING: 'PENDING',
  STARTED: 'STARTED',
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

export const REMOTE_RESOURCES_DATA_CATALOGS = [DATA_CATALOG_IDENTIFIER.ATT]

export const FILES_DATA_CATALOGS = [DATA_CATALOG_IDENTIFIER.IDA, DATA_CATALOG_IDENTIFIER.PAS]

export const REMS_URL = 'https://vm1446.kaj.pouta.csc.fi'

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
  OTHER: 'http://uri.suomi.fi/codelist/fairdata/license/code/other',
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
  PERSON: 'Person',
  ORGANIZATION: 'Organization',
}

export const ROLE = {
  CREATOR: 'creator',
  PUBLISHER: 'publisher',
  CURATOR: 'curator',
  RIGHTS_HOLDER: 'rights_holder',
  CONTRIBUTOR: 'contributor',
  PROVENANCE: 'provenance',
}

export const PAS_CODE = {
  WAIT_FOR_VALIDATION: 0,
  PROPOSED_FOR_DPS: 10,
  TECHNICAL_METADATA_GENERATED: 20,
  TECHNICAL_METADATA_GENERATION_FAILED: 30,
  INVALID_METADATA: 40,
  METADATA_VALIDATION_FAILED: 50,
  VALIDATED_METADATA_UPDATED: 60,
  METADATA_IS_BEING_VALIDATED: 65,
  VALID_METADATA: 70,
  METADATA_CONFIRMED: 75,
  ACCEPTED_FOR_DPS: 80,
  IN_PACKAGING_SERVICE: 90,
  PACKAGING_FAILED: 100,
  SIP_SENT_TO_INGESTION_IN_DPS: 110,
  IN_DPS: 120,
  REJECTED_IN_DPS: 130,
  IN_DISSEMINATION: 140,
}

export const PRESERVATION_STATE = {
  0: {
    name: 'Waits for validation',
    type: 'wait',
    who: 'other',
    color: 'primary',
  },
  10: {
    name: 'Proposed for digital preservation',
    type: 'wait',
    who: 'system',
    color: 'primary',
  },
  20: {
    name: 'Technical metadata generated',
    type: 'wait',
    who: 'system',
    color: 'primary',
  },
  30: {
    name: 'Technical metadata generation failed',
    type: 'fail',
    who: 'system',
    color: 'primary',
  },
  40: {
    name: 'Invalid metadata',
    type: 'wait',
    who: 'user',
    color: 'primary',
  },
  50: {
    name: 'Metadata validation failed',
    type: 'fail',
    who: 'user',
    color: 'primary',
  },
  60: {
    name: 'Validated metadata updated',
    type: 'wait',
    who: 'system',
    color: 'primary',
  },
  65: {
    name: 'Metadata is being validated',
    type: 'wait',
    who: 'system',
    color: 'primary',
  },
  70: {
    name: 'Valid metadata',
    type: 'wait',
    who: 'other',
    color: 'primary',
  },
  75: {
    name: 'Metadata confirmed',
    type: 'wait',
    who: 'other',
    color: 'primary',
  },
  80: {
    name: 'Accepted to digital preservation',
    type: 'wait',
    who: 'system',
    color: 'primary',
  },
  90: {
    name: 'In packaging service',
    type: 'wait',
    who: 'system',
    color: 'primary',
  },
  100: {
    name: 'Packaging failed',
    type: 'fail',
    who: 'system',
    color: 'primary',
  },
  110: {
    name: 'SIP sent to ingestion in digital preservation service',
    type: 'wait',
    who: 'system',
    color: 'primary',
  },
  120: {
    name: 'In digital preservation',
    type: 'success',
    who: 'system',
    color: 'primary',
  },
  130: {
    name: 'Rejected in digital preservation service',
    type: 'fail',
    who: 'system',
    color: 'primary',
  },
  140: {
    name: 'In dissemination',
    type: 'success',
    who: 'system',
    color: 'primary',
  },
}

export const PRESERVATION_EVENT_CREATED =
  'http://uri.suomi.fi/codelist/fairdata/preservation_event/code/cre'

export const DATASET_STATE = {
  NEW: 'NEW',
  DRAFT: 'DRAFT',
  UNPUBLISHED_DRAFT: 'UNPUBLISHED_DRAFT',
  PUBLISHED: 'PUBLISHED',
  UNKNOWN: 'UNKNOWN',
}

export const RESOURCE_ENTITY_TYPE = {
  PUBLICATION: {
    label: { fi: 'Julkaisu', en: 'Publication', und: 'Julkaisu' },
    url: 'http://uri.suomi.fi/codelist/fairdata/resource_type/code/publication',
  },
}

export const RELATION_TYPE = {
  RELATED_DATASET: {
    label: { fi: 'Liittyy', en: 'Relation', und: 'Liittyy' },
    url: 'http://purl.org/dc/terms/relation',
  },
}
