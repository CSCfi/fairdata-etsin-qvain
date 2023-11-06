const dataset = {
  access_rights: {
    id: '55f2ff9b-68f2-4895-88b9-ca7f9ff750fc',
    description: null,
    license: [
      {
        custom_url: null,
        description: null,
        id: '20fe1678-9e2f-4be1-a2fb-13e5f2940de0',
        url: 'http://uri.suomi.fi/codelist/fairdata/license/code/other-open',
        in_scheme: 'http://uri.suomi.fi/codelist/fairdata/license',
        pref_label: { en: 'Other (Open)', fi: 'Muu (Avoin)' },
      },
      {
        custom_url: 'https://creativecommons.org/licenses/by/4.0/',
        description: null,
        id: '5d1a9124-2a69-47f6-b2ee-7b6df54fed1a',
        url: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
        in_scheme: 'http://uri.suomi.fi/codelist/fairdata/license',
        pref_label: {
          en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
          fi: 'Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)',
        },
      },
    ],
    access_type: {
      id: '6b475ced-86e6-44e3-985d-ab2c040638af',
      url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
      in_scheme: 'http://uri.suomi.fi/codelist/fairdata/access_type',
      pref_label: { en: 'Open', fi: 'Avoin' },
    },
  },
  actors: [
    {
      id: '2356c755-c2cb-4cdc-9db1-380b7d025fd8',
      role: 'curator',
      actor: {
        organization: {
          id: 'c3ae0bec-444f-4ef3-adc9-c4d814ff9d7c',
          pref_label: {
            en: 'Kone Foundation',
            fi: 'Koneen Säätiö',
            sv: 'Koneen säätiö',
            und: 'Koneen Säätiö',
          },
          url: 'http://uri.suomi.fi/codelist/fairdata/organization/code/02135371',
          code: null,
          in_scheme: 'http://uri.suomi.fi/codelist/fairdata/organization',
          homepage: null,
        },
        person: { name: 'Unexisting Entity', email: null, external_id: null },
        id: 22,
      },
    },
    {
      id: 'd08d3810-34e0-4c91-a901-7751758d7c5b',
      role: 'creator',
      actor: {
        organization: {
          id: 'aedcdcdb-68a9-4400-8b4e-60ca908f24ea',
          pref_label: { en: 'test dept.' },
          url: null,
          code: null,
          in_scheme: 'http://uri.suomi.fi/codelist/fairdata/organization',
          homepage: null,
        },
        person: { name: 'Kuvitteellinen Henkilö', email: null, external_id: null },
        id: 23,
      },
    },
    {
      id: '30dc590c-21ca-4e06-bf88-ecccf20082cc',
      role: 'creator',
      actor: {
        organization: {
          id: 'bf5ad8e7-04d7-40ca-94dd-5a05d4748c57',
          pref_label: { en: 'teste' },
          url: null,
          code: null,
          in_scheme: 'http://uri.suomi.fi/codelist/fairdata/organization',
          homepage: null,
        },
        person: null,
        id: 24,
      },
    },
    {
      id: '93cac2d6-5457-4981-b733-98d60f2f520e',
      role: 'creator',
      actor: {
        organization: {
          id: '02cd12da-cbb3-4265-9536-9f79ae3c1b60',
          pref_label: {
            en: 'Kone Foundation',
            fi: 'Koneen Säätiö',
            sv: 'Koneen säätiö',
            und: 'Koneen Säätiö',
          },
          url: 'http://uri.suomi.fi/codelist/fairdata/organization/code/02135371',
          code: null,
          in_scheme: 'http://uri.suomi.fi/codelist/fairdata/organization',
          homepage: null,
        },
        person: { name: 'Unexisting Entity', email: null, external_id: null },
        id: 25,
      },
    },
  ],
  data_catalog: 'urn:nbn:fi:att:data-catalog-ida',
  description: {
    en: 'This dataset is used for testing all fields in the Etsin dataset page. Description, Data, Identifiers and Events, and Maps -tabs are included in this test as well. Another version was made to test the version picker as well.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    fi: 'Tällä aineistolla testataan kaikkia Etsimen aineistosivulta löytyviä kenttiä. Aineisto, Data, Tunnisteet ja Tapahtumat, sekä Kartat -välilehdet kuuluvat myös tähän testiin. Uusi versio tehtiin, jotta version valinta -painiketta voidaan testata.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  field_of_science: [
    {
      id: '50d925ef-1ac6-42a9-8e8f-c70c06698231',
      url: 'http://www.yso.fi/onto/okm-tieteenala/ta113',
      in_scheme: 'http://www.yso.fi/onto/okm-tieteenala/conceptscheme',
      pref_label: {
        en: 'Computer and information sciences',
        fi: 'Tietojenkäsittely ja informaatiotieteet',
        sv: 'Data- och informationsvetenskap',
      },
    },
  ],
  issued: '2023-06-28',
  keyword: [
    'test',
    'software development',
    'web-development',
    'testi',
    'ohjelmistokehitys',
    'web-kehitys',
  ],
  language: [
    {
      id: '14af5a93-d8be-472b-a40c-77fe41159d06',
      url: 'http://lexvo.org/id/iso639-3/fin',
      in_scheme: 'http://lexvo.org/id/',
      pref_label: { fi: 'suomi', en: 'Finnish', sv: 'finska' },
    },
    {
      id: '6e5789d3-6e33-459c-8b1d-3041eaf7c29d',
      url: 'http://lexvo.org/id/iso639-3/eng',
      in_scheme: 'http://lexvo.org/id/',
      pref_label: { fi: 'englanti', en: 'English', sv: 'engelska' },
    },
  ],
  metadata_owner: { id: 3, user: { username: 'fd_user5' }, organization: 'csc.fi' },
  persistent_identifier: 'doi:10.23729/ee43f42b-e455-4849-9d70-7e3a52b307f5',
  theme: [
    {
      id: '573dd2e3-97be-45fb-ab84-6a1f085d90b4',
      url: 'http://www.yso.fi/onto/koko/p53359',
      in_scheme: 'http://www.yso.fi/onto/koko/',
      pref_label: {
        en: 'software development',
        fi: 'ohjelmistokehitys',
        sv: 'programutveckling',
      },
    },
    {
      id: '45f4ef1e-53ea-4b0b-9453-de9e297e12e3',
      url: 'http://www.yso.fi/onto/koko/p35020',
      in_scheme: 'http://www.yso.fi/onto/koko/',
      pref_label: { en: 'web pages', fi: 'WWW-sivut', se: 'WWW-siiddut', sv: 'webbsidor' },
    },
  ],
  title: { en: 'All Fields Test Dataset', fi: 'Kaikkien kenttien testiaineisto testi' },
  provenance: [
    {
      id: 2,
      title: { en: 'This thing happened' },
      description: { en: 'And it was great' },
      spatial: {
        reference: {
          url: 'http://www.yso.fi/onto/yso/p189359',
          pref_label: {
            en: 'Unioninkatu',
            fi: 'Unioninkatu (Helsinki)',
            sv: 'Unionsgatan (Helsingfors)',
          },
          in_scheme: 'http://www.yso.fi/onto/yso/places',
          as_wkt: '',
        },
        full_address: 'Annankatu 5',
        geographic_name: 'Random Test Location',
        altitude_in_meters: null,
        dataset: null,
        id: 'c3d7beac-6724-412b-8365-9efa39d9b21b',
        as_wkt: '',
      },
      lifecycle_event: {
        id: '51779aac-ea09-436b-a8e7-0419066c1cd1',
        url: 'http://uri.suomi.fi/codelist/fairdata/lifecycle_event/code/destroyed',
        in_scheme: 'http://uri.suomi.fi/codelist/fairdata/lifecycle_event',
        pref_label: { en: 'Destroyed', fi: 'Tuhottu' },
      },
      event_outcome: {
        id: '509ee605-7a85-4d09-98e9-f4c96efae4e8',
        url: 'http://uri.suomi.fi/codelist/fairdata/event_outcome/code/success',
        in_scheme: 'http://uri.suomi.fi/codelist/fairdata/event_outcome',
        pref_label: { en: 'Success', fi: 'Onnistunut', sv: 'Framgångsrik' },
      },
      outcome_description: { en: 'Destruction complete' },
      is_associated_with: [],
    },
  ],
  relation: [
    {
      entity: {
        title: {
          en: 'Related dataset',
          fi: 'Toinen aineisto',
        },
        description: {
          en: 'This is the description of a dataset.',
          fi: 'Suomenkielinen aineiston kuvaus.',
        },
        entity_identifier: 'doi:some_dataset',
        type: {
          id: 'b7f4d810-cc97-4da5-bf81-84c475a060eb',
          url: 'http://uri.suomi.fi/codelist/fairdata/resource_type/code/dataset',
          in_scheme: 'http://uri.suomi.fi/codelist/fairdata/resource_type',
          pref_label: {
            en: 'Dataset',
            fi: 'Tutkimusaineisto',
          },
        },
      },
      relation_type: {
        id: '9efe61b9-635c-4cbe-abfe-09697eb220cd',
        url: 'http://purl.org/spar/cito/cites',
        in_scheme: 'http://uri.suomi.fi/codelist/fairdata/relation_type',
        pref_label: {
          en: 'Cites',
          fi: 'Viittaa',
        },
      },
    },
  ],
  spatial: [
    {
      reference: {
        url: 'http://www.yso.fi/onto/yso/p189359',
        pref_label: {
          en: 'Unioninkatu',
          fi: 'Unioninkatu (Helsinki)',
          sv: 'Unionsgatan (Helsingfors)',
        },
        in_scheme: 'http://www.yso.fi/onto/yso/places',
        as_wkt: '',
      },
      altitude_in_meters: null,
      full_address: 'Unioninkatu 6, Helsinki',
      geographic_name: 'Random Address in Helsinki',
      id: 'c3d7beac-6724-412b-8365-9efa39d9b21b',
    },
    {
      reference: {
        url: 'http://www.yso.fi/onto/yso/p105747',
        pref_label: { en: 'Tapiola', fi: 'Tapiola (Espoo)', sv: 'Hagalund (Esbo)' },
        in_scheme: 'http://www.yso.fi/onto/yso/places',
        as_wkt: 'POINT(24.80634 60.17653)',
      },
      full_address: 'Itätuulenkuja 3, Espoo',
      geographic_name: 'Another Random Address in Espoo',
      altitude_in_meters: 1337,
      id: 'c04c4768-515e-463d-a3d8-f75b2f532acc',
      custom_wkt: ['POINT(22 61)'],
    },
  ],
  other_identifiers: [
    {
      notation: 'https://www.example.com',
    },
  ],
  temporal: [
    {
      start_date: '2023-09-20',
      end_date: '2023-11-25',
    },
  ],
  remote_resources: [
    {
      title: {
        en: 'Dataset Remote Resource',
      },
      description: {
        en: 'Description of resource',
      },
      access_url: 'https://access.url',
      download_url: 'https://download.url',
      use_category: {
        id: '2e64a205-f20b-4157-ad2a-e4f899b71681',
        url: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/source',
        in_scheme: 'http://uri.suomi.fi/codelist/fairdata/use_category',
        pref_label: {
          en: 'Source material',
          fi: 'Lähdeaineisto',
        },
      },
      file_type: {
        id: '0487cd2a-b54e-4117-a20c-940587e90b6c',
        url: 'http://uri.suomi.fi/codelist/fairdata/file_type/code/audiovisual',
        in_scheme: 'http://uri.suomi.fi/codelist/fairdata/file_type',
        pref_label: {
          en: 'Audiovisual',
          fi: 'Audiovisuaalinen',
        },
      },
      checksum: 'md5:f00f',
      mediatype: 'text/csv',
    },
  ],
  created: '2023-06-28T10:16:22+03:00',
  cumulation_started: '2023-06-28T10:16:22+03:00',
  first: null,
  id: '4eb1c1ac-b2a7-4e45-8c63-099b0e7ab4b0',
  is_deprecated: false,
  is_removed: false,
  last: null,
  modified: '2023-08-11T14:46:00.140339+03:00',
  previous: null,
  removal_date: null,
  replaces: null,
}

export const accessRightsEmbargo = {
  ...dataset.access_rights,
  access_type: {
    url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo',
    in_scheme: 'http://uri.suomi.fi/codelist/fairdata/access_type',
    pref_label: { en: 'Embargo', fi: 'Embargo' },
  },
  restriction_grounds: [
    {
      "id": "6cedbc74-0b3a-41f1-91ae-fd1f4cbcbe1c",
      "url": "http://uri.suomi.fi/codelist/fairdata/restriction_grounds/code/research",
      "in_scheme": "http://uri.suomi.fi/codelist/fairdata/restriction_grounds",
      "pref_label": {
        "en": "Restriced access for research based on contract",
        "fi": "Saatavuutta rajoitettu sopimuksen perusteella vain tutkimuskäyttöön",
        "sv": "Begränsad åtkomst på bas av kontrakt ändast för forskningsändamål"
      }
    }
  ],
  available: '2023-12-24',
}

export default dataset
