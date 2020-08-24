// dataset as returned by metax
export const metaxDataset = {
  id: 1,
  identifier: '100',
  data_catalog: {
    id: 9,
    identifier: 'urn:nbn:fi:att:data-catalog-ida',
  },
  deprecated: false,
  metadata_owner_org: 'ylipoisto.fi',
  metadata_provider_org: 'ylipoisto.fi',
  metadata_provider_user: 'user',
  research_dataset: {
    title: {
      fi: 'Will be cumu',
    },
    issued: '2020-08-12',
    creator: [
      {
        '@type': 'organization',
        name: {
          en: 'Some Organization',
        },
        identifier: 'http://example.com/some',
      },
    ],
    keyword: ['cumulation'],
    publisher: {
      '@type': 'organization',
      name: {
        en: 'Some Organization',
      },
      identifier: 'http://example.com/some',
    },
    description: {
      fi: 'Cumulative dataset',
    },
    access_rights: {
      license: {
        name: { en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)' },
        identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
      },
      accessType: {
        url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
      },
    },
    preferred_identifier: 'draft:100',
  },
  preservation_state: 0,
  state: 'draft',
  use_doi_for_published: false,
  cumulative_state: 1,
  api_meta: {
    version: 2,
  },
  draft_of: {
    id: 0,
    identifier: '99',
    preferred_identifier: 'urn:nbn:fi:att:99',
  },
}

// dataset in the format needed by the backend
export const dataset = {
  title: {
    fi: 'Cumulative',
  },
  description: {
    fi: 'Cumulative dataset',
  },
  issuedDate: '2020-08-12',
  keywords: ['cumulation'],
  actors: [
    {
      type: 'organization',
      roles: ['publisher', 'creator'],
      organizations: [
        {
          name: {
            en: 'Some Organization',
          },
          identifier: 'http://example.com/some',
        },
      ],
    },
  ],
  accessType: {
    name: {
      en: 'Open',
      fi: 'Avoin',
      und: 'Avoin',
    },
    url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
  },
  license: {
    name: {
      en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
      fi: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
    },
    identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
  },
  dataCatalog: 'urn:nbn:fi:att:data-catalog-ida',
  cumulativeState: 1,
  original: {
    id: 1948,
    identifier: '12345',
    data_catalog: {
      id: 9,
      identifier: 'urn:nbn:fi:att:data-catalog-ida',
    },
    preservation_state: 0,
    state: 'draft',
    use_doi_for_published: false,
    cumulative_state: 1,
    date_cumulation_started: '2020-08-12T13:07:33+03:00',
    date_last_cumulative_addition: '2020-08-12T13:08:03+03:00',
    api_meta: {
      version: 2,
    },
  },
}

export const fileActions = {
  directories: [],
  files: [
    {
      identifier: 'pr123',
    },
  ],
}

export const metadataActions = {
  files: [
    {
      identifier: 'pr123',
      title: 'pr123.pdf',
      description: 'It is a file',
      file_type: {
        identifier: 'http://uri.suomi.fi/codelist/fairdata/file_type/code/text',
      },
      use_category: {
        identifier: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/outcome',
      },
    },
  ],
  directories: [
    {
      identifier: 'pid:urn:dir:10',
      title: 'directory',
      description: 'It is a directory',
      use_category: {
        identifier: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
      },
    },
  ],
}
