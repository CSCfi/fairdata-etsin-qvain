import { spatial_a } from '../refs/spatials.data'

export default {
  id: '2356c755-c2cb-4cdc-9db1-380b7d025fd8',
  metadata_owner: {
    user: 'teppo',
    organization: 'test.csc.fi',
  },
  cumulative_state: 0,
  created: '2021-02-10T11:44:51+02:00',
  modified: '2021-02-10T12:03:42+02:00',
  state: 'published',
  persistent_identifier: 'urn:nbn:fi:att:be05442c-1cb6-4fb3-999b-d076d12c7842',
  title: {
    en: 'English Title',
    fi: 'Finnish Title',
  },
  description: {
    en: 'English Description',
    fi: 'Finnish Description',
  },
  issued: '2021-01-28',
  keyword: ['first keyword', 'second', 'third'],
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
      {
        url: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-1.0',
        custom_url: 'https://creativecommons.org/licenses/by/1.0/',
        title: {
          en: 'Creative Commons Attribution 1.0 Generic (CC BY 1.0)',
          fi: 'Creative Commons Nimeä 1.0 Yleinen (CC BY 1.0)',
          und: 'Creative Commons Nimeä 1.0 Yleinen (CC BY 1.0)',
        },
      },
    ],
    access_type: {
      pref_label: {
        en: 'Requires login in Fairdata service',
        fi: 'Vaatii kirjautumisen Fairdata-palvelussa',
      },
      url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/login',
    },
    restriction_grounds: [
      {
        pref_label: {
          en: 'Restricted access due to copyright',
          fi: 'Saatavuutta rajoitettu tekijäoikeuden perusteella',
          sv: 'Begränsad åtkomst på grund av upphovsrätt',
        },
        url: 'http://uri.suomi.fi/codelist/fairdata/restriction_grounds/code/copyright',
      },
    ],
    show_file_metadata: true,
  },
  actors: [
    {
      person: {
        name: 'Human Person',
        external_identifier: 'https://orcid.org/person',
        email: 'email@example.com',
      },
      organization: {
        pref_label: {
          en: 'Unseen University',
        },
      },
      roles: ['creator', 'publisher', 'curator', 'contributor', 'rights_holder'],
    },
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
      roles: ['contributor'],
    },
  ],
  provenance: [
    {
      title: {
        en: 'Provenance name',
        fi: 'Provenanssin nimi',
        und: 'Provenanssin nimi',
      },
      description: {
        en: 'Provenance description',
        fi: 'Provenanssin kuvaus',
        und: 'Provenanssin kuvaus',
      },
      outcome_description: {
        en: 'Outcome description',
        fi: 'Tuloksen kuvaus',
        und: 'Tuloksen kuvaus',
      },
      spatial: spatial_a,
      temporal: {
        start_date: '2021-02-03',
        end_date: '2021-02-23',
      },
      event_outcome: {
        pref_label: {
          en: 'Unknown',
          fi: 'Tuntematon',
          sv: 'Okänt',
        },
        url: 'http://uri.suomi.fi/codelist/fairdata/event_outcome/code/unknown',
      },
      lifecycle_event: {
        pref_label: {
          en: 'Checked',
          fi: 'Tarkistettu',
        },
        url: 'http://uri.suomi.fi/codelist/fairdata/lifecycle_event/code/checked',
      },
      is_associated_with: [
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
        },
      ],
      used_entity: [
        {
          title: {
            en: 'Title of entity used by provenance',
            und: 'Title of entity used by provenance',
          },
          description: {
            en: 'Description of entity used by provenance',
            und: 'Description of entity used by provenance',
          },
          entity_identifier: 'https://example.com/provenance/entity',
          type: {
            pref_label: {
              en: 'Instrument',
              fi: 'Mittalaite',
            },
            url: 'http://uri.suomi.fi/codelist/fairdata/resource_type/code/instrument',
          },
        },
      ],
    },
  ],
  projects: [
    {
      title: {
        en: 'Project',
        fi: 'Projekti',
      },
      project_identifier: 'project-identifier',
      participating_organizations: [
        {
          pref_label: {
            en: 'Aalto University',
            fi: 'Aalto yliopisto',
            sv: 'Aalto universitetet',
            und: 'Aalto yliopisto',
          },
          url: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076',
        },
      ],
      funding: [
        {
          funder: {
            organization: {
              pref_label: {
                en: 'Aalto University',
                fi: 'Aalto yliopisto',
                sv: 'Aalto universitetet',
                und: 'Aalto yliopisto',
              },
              url: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076',
            },
            funder_type: {
              pref_label: {
                en: 'EU European Social Fund ESR',
                fi: 'EU Euroopan sosiaalirahasto ESR',
              },
              url: 'http://uri.suomi.fi/codelist/fairdata/funder_type/code/eu-esr',
            },
          },
          funding_identifier: 'project-funding-identifier',
        },
      ],
    },
  ],
  field_of_science: [
    {
      pref_label: {
        en: 'Mathematics',
        fi: 'Matematiikka',
        sv: 'Matematik',
      },
      url: 'http://www.yso.fi/onto/okm-tieteenala/ta111',
    },
    {
      pref_label: {
        en: 'Physical sciences',
        fi: 'Fysiikka',
        sv: 'Fysik',
      },
      url: 'http://www.yso.fi/onto/okm-tieteenala/ta114',
    },
    {
      pref_label: {
        en: 'Computer and information sciences',
        fi: 'Tietojenkäsittely ja informaatiotieteet',
        sv: 'Data- och informationsvetenskap',
      },
      url: 'http://www.yso.fi/onto/okm-tieteenala/ta113',
    },
  ],
  theme: [
    {
      pref_label: {
        fi: 'makkaranvalmistus',
      },
      url: 'http://www.yso.fi/onto/koko/p40393',
    },
    {
      pref_label: {
        en: 'concrete steel',
        fi: 'betoniteräs',
        sv: 'armeringsjärn',
      },
      url: 'http://www.yso.fi/onto/koko/p55252',
    },
  ],
  language: [
    {
      pref_label: {
        en: 'Inuktitut',
        fi: 'inuktitut',
        sv: 'inuktitut',
      },
      url: 'http://lexvo.org/id/iso639-3/iku',
    },
    {
      pref_label: {
        en: 'Finno-Ugric language',
        fi: 'suomalais-ugrilainen kieli',
        sv: 'finskugriskt språk',
      },
      url: 'http://lexvo.org/id/iso639-5/fiu',
    },
  ],
  infrastructure: [
    {
      id: '1234-1234',
      pref_label: {
        en: 'Bioeconomy Infrastructure',
        fi: 'Huippuallianssi kestävään biomassan jalostukseen',
        und: 'Huippuallianssi kestävään biomassan jalostukseen',
      },
      url: 'http://urn.fi/urn:nbn:fi:research-infras-2016072527',
    },
    {
      id: '5678-5678',
      pref_label: {
        en: 'Cherenkov Telescope Array',
        fi: 'Cherenkov teleskooppijärjestelmä',
        und: 'Cherenkov teleskooppijärjestelmä',
      },
      url: 'http://urn.fi/urn:nbn:fi:research-infras-2016072528',
    },
  ],
  spatial: [spatial_a],
  temporal: [
    {
      start_date: '2020-12-29',
      end_date: '2021-01-13',
    },
    {
      start_date: '2019-05-26',
      end_date: '2021-02-01',
    },
    {
      start_date: '2030-01-01',
      end_date: '2050-03-02',
    },
  ],
  other_identifiers: [
    {
      notation: 'https://doi.org/identifier',
    },
    {
      notation: 'https://doi.org/another_identifier',
    },
  ],
  relation: [
    {
      entity: {
        title: {
          en: 'Resource in English',
          fi: 'Resurssi',
          und: 'Resurssi',
        },
        description: {
          en: 'Resource Description',
          fi: 'Resurssin kuvaus',
          und: 'Resurssin kuvaus',
        },
        entity_identifier: '1234-aaaaa-tunniste',
        type: {
          pref_label: {
            en: 'Collection',
            fi: 'Kokoelma',
          },
          url: 'http://uri.suomi.fi/codelist/fairdata/resource_type/code/collection',
        },
      },
      relation_type: {
        pref_label: {
          en: 'Cites',
          fi: 'Viittaa',
        },
        url: 'http://purl.org/spar/cito/cites',
      },
    },
  ],
  remote_resources: [
    {
      title: {
        en: 'A Resource',
      },
      use_category: {
        pref_label: {
          en: 'Documentation',
          fi: 'Dokumentaatio',
        },
        url: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
      },
      access_url: 'https://access.url',
      download_url: 'https://download.url',
    },
  ],
}

export const contact = {
  creator: false,
  contributor: false,
  publisher: false,
  curator: false,
  rights_holder: false,
}
