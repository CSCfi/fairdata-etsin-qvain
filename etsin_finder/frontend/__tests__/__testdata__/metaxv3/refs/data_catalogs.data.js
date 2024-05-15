export const data_catalog_ida = {
  id: 'urn:nbn:fi:att:data-catalog-ida',
  description: {
    en: 'Datasets stored in the IDA service',
    fi: 'IDA-palvelussa säilytettävät aineistot',
  },
  publisher: {
    id: 'e4b07e01-2c81-4836-bde8-16f13e472046',
    name: {
      en: 'Testing',
      fi: 'Testi',
    },
    homepage: [
      {
        id: '6d0dcfb3-f0b3-418f-9a6d-7bd4816408ae',
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
  harvested: false,
  dataset_groups_create: ['ida', 'fairdata_users'],
  dataset_groups_admin: ['ida'],
  allow_remote_resources: false,
  storage_services: ['ida'],
}
