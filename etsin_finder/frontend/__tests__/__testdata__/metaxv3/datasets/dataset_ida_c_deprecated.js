export default {
  id: '1234-1234-1234',
  metadata_owner: {
    user: 'teppo',
    organization: 'test.csc.fi',
  },
  cumulative_state: 0,
  created: '2021-01-28T10:06:32+02:00',
  modified: '2021-01-28T10:26:12+02:00',
  deprecated: '2021-12-22T14:29:15+02:00',
  state: 'published',
  persistent_identifier: '162e04c5-857b-477c-a452-cd063ee3c44d',
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
  preservation: {
    state: 0,
    dataset_origin_version: {
      persistent_identifier: 'urn:nbn:fi:origin-of-preserved-dataset',
    },
  },
  provenance: [
    {
      id: '1',
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
      spatial: {
        reference: {
          pref_label: {
            en: 'Bytom',
            fi: 'Bytom',
            sv: 'Bytom',
          },
          url: 'http://www.yso.fi/onto/yso/p112355',
        },
        geographic_name: 'Provenanssipaikka',
      },
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
    {
      id: '2',
      title: {
        en: 'Provenance name2',
        fi: 'Provenanssin nimi2',
        und: 'Provenanssin nimi2',
      },
      description: {
        en: 'Provenance description2',
        fi: 'Provenanssin kuvaus2',
        und: 'Provenanssin kuvaus2',
      },
      spatial: {
        geographic_name: 'Provenanssipaikka2',
      },
      temporal: {
        end_date: '2021-02-23',
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
      pref_label: {
        en: 'Bioeconomy Infrastructure',
        fi: 'Huippuallianssi kestävään biomassan jalostukseen',
        und: 'Huippuallianssi kestävään biomassan jalostukseen',
      },
      url: 'http://urn.fi/urn:nbn:fi:research-infras-2016072527',
    },
    {
      pref_label: {
        en: 'Cherenkov Telescope Array',
        fi: 'Cherenkov teleskooppijärjestelmä',
        und: 'Cherenkov teleskooppijärjestelmä',
      },
      url: 'http://urn.fi/urn:nbn:fi:research-infras-2016072528',
    },
  ],
  spatial: [
    {
      reference: {
        pref_label: {
          en: 'Äkäslompolo',
          fi: 'Äkäslompolo (Kolari : kylä)',
          sv: 'Äkäslompolo (Kolari : by)',
        },
        url: 'http://www.yso.fi/onto/yso/p109778',
      },
      geographic_name: 'Äkäslompolo',
    },
    {
      reference: {
        pref_label: {
          en: 'Hattuvaara',
          fi: 'Hattuvaara (Lieksa)',
          sv: 'Hattuvaara (Lieksa)',
        },
        url: 'http://www.yso.fi/onto/yso/p136721',
      },
      geographic_name: 'Hat danger',
    },
  ],
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
  dataset_versions: [
    {
      id: '12345688-4867-47f7-9874-112233445566',
      title: {
        en: 'English Title 4',
        fi: 'Finnish Title 4',
      },
      persistent_identifier: 'urn:nbn:fi:att:12345688-4867-47f7-9874-112233445566',
      removed: null,
      state: 'published',
      created: '2022-02-02T14:29:15+02:00',
      version: 5,
    },
    {
      id: '12345677-4867-47f7-9874-112233445566',
      title: {
        en: 'English Title 3',
        fi: 'Finnish Title 3',
      },
      persistent_identifier: 'urn:nbn:fi:att:12345677-4867-47f7-9874-112233445566',
      removed: null,
      state: 'published',
      created: '2022-01-01T14:29:15+02:00',
      version: 4,
    },
    {
      id: '12345678-4867-47f7-9874-112233445566',
      title: {
        en: 'English Title 2',
        fi: 'Finnish Title 2',
      },
      persistent_identifier: 'urn:nbn:fi:att:12345678-4867-47f7-9874-112233445566',
      removed: null,
      state: 'published',
      created: '2021-12-11T14:29:15+02:00',
      version: 3,
    },
    {
      id: '6d2cb5f5-4867-47f7-9874-09357f2901a3',
      title: {
        en: 'English Title',
        fi: 'Finnish Title',
      },
      persistent_identifier: 'urn:nbn:fi:att:162e04c5-857b-477c-a452-cd063ee3c44d',
      removed: null,
      state: 'published',
      created: '2021-12-20T14:29:15+02:00',
      version: 2,
    },
    {
      id: '1af9f528-e7a7-43e4-9051-b5d07e889cde',
      title: {
        en: 'English Title',
        fi: 'Finnish Title',
      },
      persistent_identifier: 'urn:nbn:fi:att:1af9f528-e7a7-43e4-9051-b5d07e889cde',
      state: 'published',
      created: '2021-12-10T10:47:42+02:00',
      removed: '2021-12-20T14:28:54+02:00',
      version: 1,
    },
  ],
}
