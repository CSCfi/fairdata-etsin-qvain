// Constants used in Etsin and Qvain

export const DOWNLOAD_API_REQUEST_STATUS = {
  PENDING: 'PENDING',
  STARTED: 'STARTED',
  SUCCESS: 'SUCCESS',
} as const

export const ACCESS_TYPE_URL = {
  EMBARGO: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo',
  OPEN: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
  LOGIN: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/login',
  PERMIT: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/permit',
  RESTRICTED: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted',
} as const

export type AccessTypeCode = keyof typeof ACCESS_TYPE_URL

export const DATA_CATALOG_IDENTIFIER = {
  IDA: 'urn:nbn:fi:att:data-catalog-ida',
  ATT: 'urn:nbn:fi:att:data-catalog-att',
  PAS: 'urn:nbn:fi:att:data-catalog-pas',
  DFT: 'urn:nbn:fi:att:data-catalog-dft',
  DAAS: 'urn:nbn:fi:att:data-catalog-daas',
} as const

export const REMOTE_RESOURCES_DATA_CATALOGS = [DATA_CATALOG_IDENTIFIER.ATT] as const

export const FILES_DATA_CATALOGS = [DATA_CATALOG_IDENTIFIER.IDA, DATA_CATALOG_IDENTIFIER.PAS] as const

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
  LUMIAIF: {
    FI: 'https://docs.lumi-supercomputer.eu/laif/data/daas-guide/',
    EN: 'https://docs.lumi-supercomputer.eu/laif/data/daas-guide/',
  }
}

export const LUMI_AIF_PORTAL_URL = 'https://lumi-ai-factory.eu/'

export const LICENSE_URL = {
  CCBY4: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
  OTHER: 'http://uri.suomi.fi/codelist/fairdata/license/code/other',
} as const

export const USE_CATEGORY_URL = {
  OUTCOME_MATERIAL: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/outcome',
} as const

export const CUMULATIVE_STATE = {
  NO: 0,
  YES: 1,
  CLOSED: 2,
} as const

export const ENTITY_TYPE = {
  PERSON: 'Person',
  ORGANIZATION: 'Organization',
} as const

export const ROLE = {
  CREATOR: 'creator',
  PUBLISHER: 'publisher',
  CURATOR: 'curator',
  RIGHTS_HOLDER: 'rights_holder',
  CONTRIBUTOR: 'contributor',
  PROVENANCE: 'provenance',
} as const

export const PRESERVATION_EVENT_CREATED =
  'http://uri.suomi.fi/codelist/fairdata/preservation_event/code/cre'

export const DATASET_STATE = {
  NEW: 'NEW',
  DRAFT: 'DRAFT',
  UNPUBLISHED_DRAFT: 'UNPUBLISHED_DRAFT',
  PUBLISHED: 'PUBLISHED',
  UNKNOWN: 'UNKNOWN',
} as const

export const RESOURCE_ENTITY_TYPE = {
  PUBLICATION: {
    label: { fi: 'Julkaisu', en: 'Publication', und: 'Julkaisu' },
    url: 'http://uri.suomi.fi/codelist/fairdata/resource_type/code/publication',
  },
} as const

export const RELATION_TYPE = {
  RELATED_DATASET: {
    label: { fi: 'Liittyy', en: 'Relation', und: 'Liittyy' },
    url: 'http://purl.org/dc/terms/relation',
  },
} as const

export const DAAS_CATALOG_SERVICE_USERS = 'daas_catalog_service_users'

export const LOGINERRORS = {
  MISSING_FAIRDATA_USER: 'missing_fairdata_user_id',
  MISSING_ORGANIZATION: 'missing_organization_id',
} as const
