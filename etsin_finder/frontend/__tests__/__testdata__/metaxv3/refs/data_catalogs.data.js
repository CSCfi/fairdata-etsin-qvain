export const data_catalog_ida = {
  id: 'urn:nbn:fi:att:data-catalog-ida',
  description: {
    en: 'Datasets stored in the IDA service',
    fi: 'IDA-palvelussa säilytettävät aineistot',
  },
  publisher: {
    name: {
      en: 'Testing',
      fi: 'Testi',
    },
    homepage: [
      {
        url: 'http://www.testi.fi/',
        title: {
          en: 'Publisher organization website',
          fi: 'Julkaisijaorganisaation kotisivu',
        },
      },
    ],
  },
  language: [
    {
      id: 'c312dc62-6698-411b-a67d-7bc192228beb',
      url: 'http://lexvo.org/id/iso639-3/fin',
      in_scheme: 'http://lexvo.org/id/',
      pref_label: {
        en: 'Finnish',
        fi: 'suomi',
        sv: 'finska',
      },
    },
  ],
  title: {
    en: 'Datasets stored in the IDA service',
    fi: 'IDA-palvelussa säilytettävät aineistot',
  },
  dataset_versioning_enabled: true,
  is_external: false,
  dataset_groups_create: ['ida', 'fairdata_users'],
  dataset_groups_admin: ['ida'],
  allow_remote_resources: false,
  storage_services: ['ida'],
  rems_enabled: true,
}

export const data_catalog_att = {
  id: 'urn:nbn:fi:att:data-catalog-att',
  title: {
    en: 'Fairdata general register',
    fi: 'Fairdata yleiskatalogi',
    sv: 'Fairdata allmänt register',
  },
  language: [
    {
      url: 'http://lexvo.org/id/iso639-3/eng',
    },
    {
      url: 'http://lexvo.org/id/iso639-3/fin',
    },
  ],
  is_external: false,
  publisher: {
    name: {
      en: 'Testing',
      fi: 'Testi',
    },
    homepage: [
      {
        url: 'http://www.testi.fi/',
        title: {
          en: 'Publisher organization website',
          fi: 'Julkaisijaorganisaation kotisivu',
        },
      },
    ],
  },
  dataset_versioning_enabled: true,
  dataset_groups_admin: ['pas'],
  dataset_groups_create: ['fairdata_users'],
  allowed_pid_types: ['URN'],
  rems_enabled: false,
  storage_services: [],
  publishing_channels: ['etsin', 'ttv'],
}
