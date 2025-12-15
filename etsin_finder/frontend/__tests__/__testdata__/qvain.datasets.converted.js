const datasets = [
  {
    id: '96f408d2-eb81-40a6-8791-f56ed76934cf',
    metadata_owner: {
      user: 'teppo',
      organization: 'test.csc.fi',
      admin_organization: 'test.csc.fi',
    },
    data_catalog: 'urn:nbn:fi:att:data-catalog-dft',
    cumulative_state: 0,
    created: '2021-05-05T10:01:56+02:00',
    modified: '2021-05-05T10:01:56+02:00',
    state: 'draft',
    persistent_identifier: 'draft:7f1dcb80-bc20-43d6-b279-9455dabde6fc',
    title: {
      en: 'Changes here',
    },
    issued: '2021-05-05',
    access_rights: {
      license: [
        {
          url: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
          custom_url: 'https://creativecommons.org/licenses/by/4.0/',
          title: {
            en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
            fi: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
            und: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
          },
        },
      ],
      access_type: {
        pref_label: {
          en: 'Open',
          fi: 'Avoin',
        },
        url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
      },
    },
    dataset_versions: [
      {
        id: '96f408d2-eb81-40a6-8791-f56ed76934cf',
        title: {
          en: 'Changes here',
        },
        draft_of: '1234',
        created: '2021-05-05T10:01:56+02:00',
        modified: '2021-05-05T10:01:56+02:00',
      },
      {
        id: '1234',
        title: {
          en: 'Published but changed',
        },
        state: 'published',
        next_draft: '96f408d2-eb81-40a6-8791-f56ed76934cf',
        created: '2021-05-01T10:01:56+02:00',
        modified: '2021-05-01T10:01:56+02:00',
      },
    ],
    draft_of: {
      id: '7f1dcb80-bc20-43d6-b279-9455dabde6fc',
      persistent_identifier: 'urn:nbn:7f1dcb80-bc20-43d6-b279-9455dabde6fc',
      created: '2021-05-01T10:01:56+02:00',
      modified: '2021-05-01T10:01:56+02:00',
      cumulative_state: 0,
      title: {
        en: 'Published but changed',
      },
      state: 'published',
    },
  },
  {
    id: 'aad48718-5c69-48d7-a4e0-0c06fb06cccd',
    metadata_owner: {
      user: 'teppo',
      organization: 'test.csc.fi',
      admin_organization: 'test.csc.fi',
    },
    data_catalog: 'urn:nbn:fi:att:data-catalog-dft',
    cumulative_state: 0,
    created: '2021-02-05T11:06:16+02:00',
    modified: '2021-02-05T11:06:25+02:00',
    state: 'draft',
    persistent_identifier: 'draft:aad48718-5c69-48d7-a4e0-0c06fb06cccd',
    title: {
      en: 'Draft 5 by me',
    },
    issued: '2021-02-05',
    access_rights: {
      license: [
        {
          url: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
          custom_url: 'https://creativecommons.org/licenses/by/4.0/',
          title: {
            en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
            fi: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
            und: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
          },
        },
      ],
      access_type: {
        pref_label: {
          en: 'Open',
          fi: 'Avoin',
        },
        url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
      },
    },
    dataset_versions: [
      {
        id: 'aad48718-5c69-48d7-a4e0-0c06fb06cccd',
        title: {
          en: 'Draft 5 by me',
        },
        created: '2021-02-05T11:06:16+02:00',
        modified: '2021-02-05T11:06:25+02:00',
      },
    ],
  },
  {
    id: '1f1dcb80-bc20-43d6-b279-9455dabde6fc',
    metadata_owner: {
      user: 'tkoppa',
      organization: 'test.csc.fi',
      admin_organization: 'test.csc.fi',
    },
    data_catalog: 'urn:nbn:fi:att:data-catalog-dft',
    cumulative_state: 0,
    created: '2021-02-05T11:06:08+02:00',
    modified: '2021-02-05T11:06:22+02:00',
    state: 'draft',
    persistent_identifier: 'draft:1f1dcb80-bc20-43d6-b279-9455dabde6fc',
    title: {
      en: 'Draft 4 by project',
    },
    issued: '2021-02-05',
    access_rights: {
      license: [
        {
          url: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
          custom_url: 'https://creativecommons.org/licenses/by/4.0/',
          title: {
            en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
            fi: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
            und: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
          },
        },
      ],
      access_type: {
        pref_label: {
          en: 'Open',
          fi: 'Avoin',
        },
        url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
      },
    },
    dataset_versions: [
      {
        id: '1f1dcb80-bc20-43d6-b279-9455dabde6fc',
        title: {
          en: 'Draft 4 by project',
        },
        created: '2021-02-05T11:06:08+02:00',
        modified: '2021-02-05T11:06:22+02:00',
      },
    ],
  },
  {
    id: 'b5479d7a-b0f0-421c-9e6f-b5c5ddc08bc1',
    metadata_owner: {
      user: 'teppo',
      organization: 'test.csc.fi',
      admin_organization: 'test.csc.fi',
    },
    data_catalog: 'urn:nbn:fi:att:data-catalog-dft',
    cumulative_state: 0,
    created: '2021-05-02T11:06:03+02:00',
    modified: '2021-05-02T11:06:03+02:00',
    state: 'draft',
    persistent_identifier: 'draft:b5479d7a-b0f0-421c-9e6f-b5c5ddc08bc1',
    title: {
      en: 'Draft 3 by me and project',
    },
    issued: '2021-02-05',
    access_rights: {
      license: [
        {
          url: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
          custom_url: 'https://creativecommons.org/licenses/by/4.0/',
          title: {
            en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
            fi: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
            und: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
          },
        },
      ],
      access_type: {
        pref_label: {
          en: 'Open',
          fi: 'Avoin',
        },
        url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
      },
    },
    dataset_versions: [
      {
        id: 'b5479d7a-b0f0-421c-9e6f-b5c5ddc08bc1',
        title: {
          en: 'Draft 3 by me and project',
        },
        created: '2021-05-02T11:06:03+02:00',
        modified: '2021-05-02T11:06:03+02:00',
      },
    ],
  },
  {
    id: '763423c6-a1cf-41e4-aa24-3246a9db2c83',
    metadata_owner: {
      user: 'tkoppa',
      organization: 'test.csc.fi',
      admin_organization: 'test.csc.fi',
    },
    data_catalog: 'urn:nbn:fi:att:data-catalog-dft',
    cumulative_state: 0,
    created: '2021-04-07T11:05:59+02:00',
    modified: '2021-04-07T11:05:59+02:00',
    state: 'draft',
    persistent_identifier: 'draft:763423c6-a1cf-41e4-aa24-3246a9db2c83',
    title: {
      en: 'Draft 2',
      fi: 'Draft 2 suomeksi',
    },
    issued: '2021-02-05',
    access_rights: {
      license: [
        {
          url: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
          custom_url: 'https://creativecommons.org/licenses/by/4.0/',
          title: {
            en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
            fi: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
            und: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
          },
        },
      ],
      access_type: {
        pref_label: {
          en: 'Open',
          fi: 'Avoin',
        },
        url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
      },
    },
    dataset_versions: [
      {
        id: '763423c6-a1cf-41e4-aa24-3246a9db2c83',
        title: {
          en: 'Draft 2',
          fi: 'Draft 2 suomeksi',
        },
        created: '2021-04-07T11:05:59+02:00',
        modified: '2021-04-07T11:05:59+02:00',
      },
    ],
  },
  {
    id: '037e97ff-ff4a-477d-a16d-d0696e3a8b58',
    metadata_owner: {
      user: 'teppo',
      organization: 'test.csc.fi',
      admin_organization: 'test.csc.fi',
    },
    data_catalog: 'urn:nbn:fi:att:data-catalog-ida',
    cumulative_state: 0,
    created: '2021-04-05T10:02:42+02:00',
    modified: '2021-05-06T10:02:48+02:00',
    state: 'published',
    persistent_identifier: 'urn:nbn:fi:att:2f80c500-8501-43e4-b65b-1ebdd7895920',
    title: {
      en: 'IDA dataset version 2',
      fi: 'Tämä on suomenkielinen nimi',
    },
    description: {
      en: 'Dataset',
    },
    issued: '2021-02-05',
    keyword: ['keyword'],
    access_rights: {
      license: [
        {
          url: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
          custom_url: 'https://creativecommons.org/licenses/by/4.0/',
          title: {
            en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
            fi: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
            und: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
          },
        },
      ],
      access_type: {
        pref_label: {
          en: 'Open',
          fi: 'Avoin',
        },
        url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
      },
    },
    actors: [
      {
        organization: {
          pref_label: {
            en: 'Aalto University',
            fi: 'Aalto yliopisto',
            sv: 'Aalto universitetet',
            und: 'Aalto yliopisto',
          },
          url: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076',
        },
        roles: ['creator', 'publisher'],
      },
    ],
    dataset_versions: [
      {
        id: '037e97ff-ff4a-477d-a16d-d0696e3a8b58',
        title: {
          en: 'IDA dataset version 2',
          fi: 'Tämä on suomenkielinen nimi',
        },
        persistent_identifier: 'urn:nbn:fi:att:2f80c500-8501-43e4-b65b-1ebdd7895920',
        state: 'published',
        created: '2021-04-05T10:02:42+02:00',
        version: 2,
      },
      {
        id: '137e97ff-ff4a-477d-a16d-d0696e3a8b58',
        title: {
          en: 'IDA dataset',
        },
        persistent_identifier: 'urn:nbn:fi:att:738777ca-e72d-4422-a227-81cdacf7ddc2',
        state: 'published',
        created: '2021-02-05T10:02:27+02:00',
        version: 1,
      },
    ],
  },
  {
    metadata_owner: {
      user: 'teppo',
      organization: 'test.csc.fi',
      admin_organization: 'test.csc.fi',
    },
    data_catalog: 'urn:nbn:fi:att:data-catalog-dft',
    cumulative_state: 0,
    created: '2021-01-01T10:01:56+02:00',
    modified: '2021-01-01T10:01:56+02:00',
    state: 'draft',
    persistent_identifier: 'draft:7f1dcb80-bc20-43d6-b279-9455dabde6fc',
    title: {
      en: 'Draft dataset',
    },
    issued: '2021-02-05',
    access_rights: {
      license: [
        {
          url: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
          custom_url: 'https://creativecommons.org/licenses/by/4.0/',
          title: {
            en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
            fi: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
            und: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
          },
        },
      ],
      access_type: {
        pref_label: {
          en: 'Open',
          fi: 'Avoin',
        },
        url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
      },
    },
  },
]

export default datasets
