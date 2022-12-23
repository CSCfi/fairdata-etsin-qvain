export const dataset = {
  id: 1,
  identifier: 'f1e245e4-2d0c-4bd9-8f61-cc9a08f47516',
  data_catalog: {
    id: 9,
    identifier: 'urn:nbn:fi:att:data-catalog-ida',
  },
  dataset_version_set: [
    {
      identifier: 'f1e245e4-2d0c-4bd9-8f61-cc9a08f47516',
      preferred_identifier: 'urn:nbn:fi:att:c434c426-d4ee-401c-ac5e-0d486c86434e',
      removed: false,
      date_created: '2020-03-17T13:23:03+02:00',
    },
    {
      identifier: '0fc05acb-0587-4239-8680-b372effcf0de',
      preferred_identifier: 'urn:nbn:fi:att:c469d059-0688-4c7c-9d29-6c7334ed26b3',
      removed: false,
      date_created: '2020-03-17T13:22:56+02:00',
    },
    {
      identifier: '4cdf8dd4-97a9-4eed-b7e7-f898830c9dc5',
      preferred_identifier: 'urn:nbn:fi:att:1332de35-2581-4564-b879-ae944c9cc014',
      removed: false,
      date_created: '2020-03-16T16:48:50+02:00',
    },
    {
      identifier: 'b46c3593-1cd3-4fd2-96ae-769ff2fa4084',
      preferred_identifier: 'urn:nbn:fi:att:31f34173-7ef6-4e5f-94e4-2b562a45ce09',
      removed: false,
      date_created: '2020-03-16T13:07:32+02:00',
    },
    {
      identifier: '52815829-e2cb-4c7b-9acc-370d3ccd1853',
      preferred_identifier: 'urn:nbn:fi:att:ecc1db7e-c9c6-4b40-9676-064ac29d414a',
      removed: false,
      date_created: '2020-03-16T13:07:01+02:00',
    },
    {
      identifier: '0d8f9245-f8fe-47f4-9587-41bdcfe59126',
      preferred_identifier: 'urn:nbn:fi:att:b0bda036-9cae-4aed-a4a9-641f0651b4f8',
      removed: false,
      date_created: '2020-03-16T13:06:07+02:00',
    },
  ],
  deprecated: false,
  metadata_owner_org: 'ylipoisto.fi',
  metadata_provider_org: 'ylipoisto.fi',
  metadata_provider_user: 'OQ6DB2ZUPEB63MUE2TPS3NSEQZIJROUJpas',
  research_dataset: {
    title: {
      fi: 'testtitle',
    },
    creator: [
      {
        name: {
          en: 'Department of Media',
          fi: 'Department of Media',
          und: 'Department of Media',
        },
        '@type': 'Organization',
        identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076-A802',
        is_part_of: {
          name: {
            en: 'Aalto University',
            fi: 'Aalto yliopisto',
            sv: 'Aalto universitetet',
            und: 'Aalto yliopisto',
          },
          '@type': 'Organization',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076',
        },
      },
      {
        name: 'Teppo Testihenkilö',
        '@type': 'Person',
        member_of: {
          name: {
            en: 'Some University',
          },
          '@type': 'Organization',
        },
      },
      {
        name: 'Asdasd J. Qwerty',
        '@type': 'Person',
        email: 'asdasd@test.com',
        member_of: {
          name: {
            en: 'Aalto University',
            fi: 'Aalto yliopisto',
            sv: 'Aalto universitetet',
            und: 'Aalto yliopisto',
          },
          '@type': 'Organization',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076',
        },
      },
      {
        name: {
          en: 'Some Organization',
        },
        '@type': 'Organization',
        identifier: 'http://example.com/org',
      },
      {
        name: {
          en: 'Manual Org',
        },
        email: 'manual@notreference.com',
        '@type': 'Organization',
        is_part_of: {
          name: {
            en: 'Not Really a Reference Org',
          },
          '@type': 'Organization',
          identifier:
            'http://uri.suomi.fi/codelist/fairdata/organization/code/NOT-REALLY-REFERENCE-ORG',
        },
      },
    ],
    curator: [
      {
        name: {
          en: 'Department of Media',
          fi: 'Department of Media',
          und: 'Department of Media',
        },
        '@type': 'Organization',
        identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076-A802',
        is_part_of: {
          name: {
            en: 'Aalto University',
            fi: 'Aalto yliopisto',
            sv: 'Aalto universitetet',
            und: 'Aalto yliopisto',
          },
          '@type': 'Organization',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076',
        },
      },
    ],
    keyword: ['testkeyword'],
    publisher: {
      name: 'Asdasd J. Qwerty',
      '@type': 'Person',
      email: 'asdasd@test.com',
      member_of: {
        name: {
          en: 'Aalto University',
          fi: 'Aalto yliopisto',
          sv: 'Aalto universitetet',
          und: 'Aalto yliopisto',
        },
        '@type': 'Organization',
        identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076',
      },
    },
    rights_holder: [
      {
        name: 'Asdasd J. Qwerty',
        '@type': 'Person',
        email: 'asdasd@test.com',
        member_of: {
          name: {
            en: 'Aalto University',
            fi: 'Aalto yliopisto',
            sv: 'Aalto universitetet',
            und: 'Aalto yliopisto',
          },
          '@type': 'Organization',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076',
        },
      },
      {
        name: 'Teppo Testihenkilö',
        '@type': 'Person',
        member_of: {
          name: {
            en: 'Some University',
          },
          '@type': 'Organization',
        },
      },
    ],
    contributor: [
      {
        name: 'Teppo Testihenkilö',
        '@type': 'Person',
        member_of: {
          name: {
            en: 'Some University',
          },
          '@type': 'Organization',
        },
      },
    ],
    description: {
      fi: 'testdescription',
    },
    access_rights: {
      license: [
        {
          title: {
            en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
            fi: 'Creative Commons Nime\u00e4 4.0 Kansainv\u00e4linen (CC BY 4.0)',
            und: 'Creative Commons Nime\u00e4 4.0 Kansainv\u00e4linen (CC BY 4.0)',
          },
          license: 'https://creativecommons.org/licenses/by/4.0/',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
        },
      ],
      access_type: {
        in_scheme: 'http://uri.suomi.fi/codelist/fairdata/access_type',
        identifier: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
        pref_label: {
          en: 'Open',
          fi: 'Avoin',
          und: 'Avoin',
        },
      },
    },
    preferred_identifier: 'urn:nbn:fi:att:c434c426-d4ee-401c-ac5e-0d486c86434e',
    total_files_byte_size: 12288,
    metadata_version_identifier: 'b379875e-98dd-46d0-b31f-772481333628',
  },
  preservation_state: 0,
  previous_dataset_version: {
    id: 521,
    identifier: '0fc05acb-0587-4239-8680-b372effcf0de',
    preferred_identifier: 'urn:nbn:fi:att:c469d059-0688-4c7c-9d29-6c7334ed26b3',
  },
  state: 'published',
  cumulative_state: 0,
  date_modified: '2020-03-18T10:56:48+02:00',
  date_created: '2020-03-17T13:23:03+02:00',
  service_modified: 'qvain',
  service_created: 'qvain',
  removed: false,
}

const orgsResponsesByParentId = {
  '': {
    hits: {
      total: 3,
      hits: [
        {
          _index: 'organization_data',
          _type: 'organization',
          _id: 'organization_10076',
          _score: 3.79977,
          _source: {
            id: 'organization_10076',
            code: '10076',
            type: 'organization',
            uri: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076',
            org_csc: '2',
            parent_id: '',
            label: {
              fi: 'Aalto yliopisto',
              und: 'Aalto yliopisto',
              en: 'Aalto University',
              sv: 'Aalto universitetet',
            },
            same_as: ['http://isni.org/isni/0000000108389418'],
            scheme: 'http://uri.suomi.fi/codelist/fairdata/organization',
          },
        },
        {
          _index: 'organization_data',
          _type: 'organization',
          _id: 'organization_10088',
          _score: 3.79977,
          _source: {
            id: 'organization_10088',
            code: '10088',
            type: 'organization',
            uri: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10088',
            org_csc: 'SXTDpC1TdW9tZW4geWxpb3Bpc3Rv',
            parent_id: '',
            label: {
              fi: 'It\u00e4-Suomen yliopisto',
              und: 'It\u00e4-Suomen yliopisto',
              en: 'University of Eastern Finland',
              sv: '\u00d6stra Finlands universitet',
            },
            same_as: ['http://isni.org/isni/0000000121143658'],
            scheme: 'http://uri.suomi.fi/codelist/fairdata/organization',
          },
        },
      ],
    },
  },
  organization_10076: {
    hits: {
      total: 6,
      max_score: 3.6962297,
      hits: [
        {
          _index: 'organization_data',
          _type: 'organization',
          _id: 'organization_10076-A800',
          _score: 3.6962297,
          _source: {
            id: 'organization_10076-A800',
            code: '10076-A800',
            type: 'organization',
            uri: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076-A800',
            org_csc: '',
            parent_id: 'organization_10076',
            label: {
              en: 'School services, ARTS',
              fi: 'School services, ARTS',
              und: 'School services, ARTS',
            },
            same_as: [],
            scheme: 'http://uri.suomi.fi/codelist/fairdata/organization',
          },
        },
        {
          _index: 'organization_data',
          _type: 'organization',
          _id: 'organization_10076-A801',
          _score: 3.6962297,
          _source: {
            id: 'organization_10076-A801',
            code: '10076-A801',
            type: 'organization',
            uri: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076-A801',
            org_csc: '',
            parent_id: 'organization_10076',
            label: {
              en: 'Department of Film, Television and Scenography',
              fi: 'Department of Film, Television and Scenography',
              und: 'Department of Film, Television and Scenography',
            },
            same_as: [],
            scheme: 'http://uri.suomi.fi/codelist/fairdata/organization',
          },
        },
        {
          _index: 'organization_data',
          _type: 'organization',
          _id: 'organization_10076-A802',
          _score: 3.6962297,
          _source: {
            id: 'organization_10076-A802',
            code: '10076-A802',
            type: 'organization',
            uri: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076-A802',
            org_csc: '',
            parent_id: 'organization_10076',
            label: {
              en: 'Department of Media',
              fi: 'Department of Media',
              und: 'Department of Media',
            },
            same_as: [],
            scheme: 'http://uri.suomi.fi/codelist/fairdata/organization',
          },
        },
        {
          _index: 'organization_data',
          _type: 'organization',
          _id: 'organization_10076-A803',
          _score: 3.6962297,
          _source: {
            id: 'organization_10076-A803',
            code: '10076-A803',
            type: 'organization',
            uri: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076-A803',
            org_csc: '',
            parent_id: 'organization_10076',
            label: {
              en: 'Department of Design',
              fi: 'Department of Design',
              und: 'Department of Design',
            },
            same_as: [],
            scheme: 'http://uri.suomi.fi/codelist/fairdata/organization',
          },
        },
        {
          _index: 'organization_data',
          _type: 'organization',
          _id: 'organization_10076-A899',
          _score: 3.6962297,
          _source: {
            id: 'organization_10076-A899',
            code: '10076-A899',
            type: 'organization',
            uri: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076-A899',
            org_csc: '',
            parent_id: 'organization_10076',
            label: {
              en: 'School Common ARTS',
              fi: 'School Common ARTS',
              und: 'School Common ARTS',
            },
            same_as: [],
            scheme: 'http://uri.suomi.fi/codelist/fairdata/organization',
          },
        },
        {
          _index: 'organization_data',
          _type: 'organization',
          _id: 'organization_10076-E700',
          _score: 3.6962297,
          _source: {
            id: 'organization_10076-E700',
            code: '10076-E700',
            type: 'organization',
            uri: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076-E700',
            org_csc: '',
            parent_id: 'organization_10076',
            label: {
              en: 'School Services, BIZ',
              fi: 'School Services, BIZ',
              und: 'School Services, BIZ',
            },
            same_as: [],
            scheme: 'http://uri.suomi.fi/codelist/fairdata/organization',
          },
        },
      ],
    },
  },
}

export const AaltoIdentifier = 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076'
export const AaltoDepartmentOfMediaIdentifier =
  'http://uri.suomi.fi/codelist/fairdata/organization/code/10076-A802'
export const NotReallyReferenceIdentifier =
  'http://uri.suomi.fi/codelist/fairdata/organization/code/NOT-REALLY-REFERENCE-ORG'

const notFound = {
  took: 1,
  timed_out: false,
  hits: {
    total: 0,
    max_score: null,
    hits: [],
  },
}

const reParentId = RegExp('^parent_id:"(.*)"')

// https://metax.csc.local/es/organization_data/organization/_search?size=3000&q=parent_id:%22%22
// mock response data
// example usage:
//   mockAdapter.onGet().reply(({ url }) => [200, get(url)])
export const get = path => {
  const url = new URL(path)
  if (url.pathname === '/es/organization_data/organization/_search') {
    const q = url.searchParams.get('q')
    if (!q) {
      throw new Error(`Missing q parameter, ${path}`)
    }
    const matchParentId = reParentId.exec(q)
    if (!matchParentId) {
      throw new Error(`Invalid q, missing parent_id:"...", ${path}`)
    }
    const parentId = matchParentId[1]
    if (!orgsResponsesByParentId[parentId]) {
      return notFound
    }
    return orgsResponsesByParentId[parentId]
  }
  throw new Error(`Invalid URL, ${path}`)
}

export default get
