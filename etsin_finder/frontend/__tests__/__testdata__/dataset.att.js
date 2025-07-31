const dataCatalog = {
  id: 10,
  catalog_json: {
    logo: 'fairdata_tree_logo.svg',
    title: {
      en: 'Fairdata general register',
      fi: 'Fairdata yleiskatalogi',
      sv: 'Fairdata allmänt register',
    },
    language: [
      {
        title: {
          en: 'Finnish',
          fi: 'suomi',
          sv: 'finska',
          und: 'suomi',
        },
        identifier: 'http://lexvo.org/id/iso639-3/fin',
      },
      {
        title: {
          en: 'English',
          fi: 'englanti',
          sv: 'engelska',
          und: 'englanti',
        },
        identifier: 'http://lexvo.org/id/iso639-3/eng',
      },
    ],
    harvested: false,
    publisher: {
      name: {
        en: 'Ministry of Education and Culture, Finland',
        fi: 'Opetus- ja kulttuuriministeriö',
      },
      homepage: [
        {
          title: {
            en: 'Fairdata.fi',
            fi: 'Fairdata.fi',
          },
          identifier: 'https://www.fairdata.fi',
        },
      ],
    },
    identifier: 'urn:nbn:fi:att:data-catalog-att',
    access_rights: {
      license: [
        {
          title: {
            en: 'Creative Commons CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
            fi: 'Creative Commons Yleismaailmallinen (CC0 1.0) Public Domain -lausuma',
            und: 'Creative Commons Yleismaailmallinen (CC0 1.0) Public Domain -lausuma',
          },
          license: 'https://creativecommons.org/publicdomain/zero/1.0/',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC0-1.0',
        },
      ],
      access_type: [
        {
          identifier: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
          pref_label: {
            en: 'Open',
            fi: 'Avoin',
            und: 'Avoin',
          },
        },
      ],
      description: {
        en: 'Contains datasets that are not stored in the Finnish Fairdata services.',
        fi: 'Sisältää esimerkiksi verkkoaineistot, rajapinnat ja muut muualla kuin fairdata-palveluissa säilytettävät aineistot.',
      },
      show_file_metadata: true,
    },
    dataset_versioning: false,
    research_dataset_schema: 'att',
  },
  catalog_record_services_edit: 'ida,metax,qvain,qvain-light,tpas',
  catalog_record_services_create: 'ida,metax,qvain,qvain-light,tpas',
  catalog_record_services_read: 'ida,metax,qvain,qvain-light,etsin,tpas,download',
  date_modified: '2020-12-16T12:23:48+02:00',
  date_created: '2019-09-25T16:38:35+03:00',
  service_modified: 'metax',
  service_created: 'metax',
  removed: false,
}

const dataset = {
  id: 1929,
  identifier: '162e04c5-857b-477c-a452-cd063ee3c44d',
  data_catalog: dataCatalog,
  deprecated: false,
  metadata_owner_org: 'test.csc.fi',
  metadata_provider_org: 'test.csc.fi',
  metadata_provider_user: 'teppo',
  research_dataset: {
    theme: [
      {
        in_scheme: 'http://www.yso.fi/onto/koko/',
        identifier: 'http://www.yso.fi/onto/koko/p40393',
        pref_label: {
          fi: 'makkaranvalmistus',
          und: 'makkaranvalmistus',
        },
      },
      {
        in_scheme: 'http://www.yso.fi/onto/koko/',
        identifier: 'http://www.yso.fi/onto/koko/p55252',
        pref_label: {
          en: 'concrete steel',
          fi: 'betoniter\u00e4s',
          sv: 'armeringsj\u00e4rn',
          und: 'betoniter\u00e4s',
        },
      },
    ],
    title: {
      en: 'English Title',
      fi: 'Finnish Title',
    },
    issued: '2021-01-28',
    creator: [
      {
        name: 'Human Person',
        '@type': 'Person',
        email: 'email@example.com',
        member_of: {
          name: {
            en: 'Unseen University',
          },
          '@type': 'Organization',
        },
        identifier: 'https://orcid.org/person',
      },
    ],
    curator: [
      {
        name: 'Human Person',
        '@type': 'Person',
        email: 'email@example.com',
        member_of: {
          name: {
            en: 'Unseen University',
          },
          '@type': 'Organization',
        },
        identifier: 'https://orcid.org/person',
      },
    ],
    keyword: ['first keyword', 'second', 'third'],
    spatial: [
      {
        as_wkt: ['POINT(24.14585 67.60502)'],
        place_uri: {
          in_scheme: 'http://www.yso.fi/onto/yso/places',
          identifier: 'http://www.yso.fi/onto/yso/p109778',
          pref_label: {
            en: '\u00c4k\u00e4slompolo',
            fi: '\u00c4k\u00e4slompolo (Kolari)',
            sv: '\u00c4k\u00e4slompolo (Kolari)',
            und: '\u00c4k\u00e4slompolo (Kolari)',
          },
        },
        geographic_name: '\u00c4k\u00e4slompolo',
      },
      {
        as_wkt: ['POINT(30.53247 63.30216)'],
        place_uri: {
          in_scheme: 'http://www.yso.fi/onto/yso/places',
          identifier: 'http://www.yso.fi/onto/yso/p136721',
          pref_label: {
            en: 'Hattuvaara',
            fi: 'Hattuvaara (Lieksa)',
            sv: 'Hattuvaara (Lieksa)',
            und: 'Hattuvaara (Lieksa)',
          },
        },
        geographic_name: 'Hat danger',
      },
    ],
    language: [
      {
        title: {
          en: 'Inuktitut',
          fi: 'inuktitut',
          sv: 'inuktitut',
          und: 'inuktitut',
        },
        identifier: 'http://lexvo.org/id/iso639-3/iku',
      },
      {
        title: {
          en: 'Finno-Ugric language',
          fi: 'suomalais-ugrilainen kieli',
          sv: 'finskugriskt spr\u00e5k',
          und: 'suomalais-ugrilainen kieli',
        },
        identifier: 'http://lexvo.org/id/iso639-5/fiu',
      },
    ],
    relation: [
      {
        entity: {
          type: {
            in_scheme: 'http://uri.suomi.fi/codelist/fairdata/resource_type',
            identifier: 'http://uri.suomi.fi/codelist/fairdata/resource_type/code/collection',
            pref_label: {
              en: 'Collection',
              fi: 'Kokoelma',
              und: 'Kokoelma',
            },
          },
          title: {
            en: 'Resource in English',
            fi: 'Resurssi',
            und: 'Resurssi',
          },
          identifier: '1234-aaaaa-tunniste',
          description: {
            en: 'Resource Description',
            fi: 'Resurssin kuvaus',
            und: 'Resurssin kuvaus',
          },
        },
        relation_type: {
          identifier: 'http://purl.org/spar/cito/cites',
          pref_label: {
            en: 'Cites',
            fi: 'Viittaa',
            und: 'Viittaa',
          },
        },
      },
    ],
    temporal: [
      {
        end_date: '2021-01-13T00:00:00.000Z',
        start_date: '2020-12-29T00:00:00.000Z',
      },
      {
        end_date: '2021-02-01T00:00:00.000Z',
        start_date: '2019-05-26T00:00:00.000Z',
      },
      {
        end_date: '2050-03-02T00:00:00.000Z',
        start_date: '2030-01-01T00:00:00.000Z',
      },
    ],
    publisher: {
      name: 'Human Person',
      '@type': 'Person',
      email: 'email@example.com',
      member_of: {
        name: {
          en: 'Unseen University',
        },
        '@type': 'Organization',
      },
      identifier: 'https://orcid.org/person',
    },
    provenance: [
      {
        title: {
          en: 'Provenance name',
          fi: 'Provenanssin nimi',
          und: 'Provenanssin nimi',
        },
        spatial: {
          as_wkt: ['POINT(18.923 50.347)'],
          place_uri: {
            in_scheme: 'http://www.yso.fi/onto/yso/places',
            identifier: 'http://www.yso.fi/onto/yso/p112355',
            pref_label: {
              en: 'Bytom',
              fi: 'Bytom',
              sv: 'Bytom',
              und: 'Bytom',
            },
          },
          geographic_name: 'Provenanssipaikka',
        },
        temporal: {
          end_date: '2021-02-23T00:00:00.000Z',
          start_date: '2021-02-03T00:00:00.000Z',
        },
        description: {
          en: 'Provenance description',
          fi: 'Provenanssin kuvaus',
          und: 'Provenanssin kuvaus',
        },
        used_entity: [
          {
            type: {
              identifier: 'http://uri.suomi.fi/codelist/fairdata/resource_type/code/instrument',
            },
            title: {
              en: 'Title of entity used by provenance',
              und: 'Title of entity used by provenance',
            },
            identifier: 'https://example.com/provenance/entity',
            description: {
              en: 'Description of entity used by provenance',
              und: 'Description of entity used by provenance',
            },
          },
        ],
        event_outcome: {
          in_scheme: 'http://uri.suomi.fi/codelist/fairdata/event_outcome',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/event_outcome/code/unknown',
          pref_label: {
            en: 'Unknown',
            fi: 'Tuntematon',
            sv: 'Okänt',
            und: 'Tuntematon',
          },
        },
        lifecycle_event: {
          in_scheme: 'http://uri.suomi.fi/codelist/fairdata/lifecycle_event',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/lifecycle_event/code/checked',
          pref_label: {
            en: 'Checked',
            fi: 'Tarkistettu',
            und: 'Tarkistettu',
          },
        },
        outcome_description: {
          en: 'Outcome description',
          fi: 'Tuloksen kuvaus',
          und: 'Tuloksen kuvaus',
        },
        was_associated_with: [
          {
            name: {
              en: 'Aalto University',
              fi: 'Aalto yliopisto',
              sv: 'Aalto universitetet',
              und: 'Aalto yliopisto',
            },
            '@type': 'Organization',
            identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076',
          },
        ],
      },
    ],
    contributor: [
      {
        name: 'Human Person',
        '@type': 'Person',
        email: 'email@example.com',
        member_of: {
          name: {
            en: 'Unseen University',
          },
          '@type': 'Organization',
        },
        identifier: 'https://orcid.org/person',
      },
      {
        name: {
          en: 'Aalto University',
          fi: 'Aalto yliopisto',
          sv: 'Aalto universitetet',
          und: 'Aalto yliopisto',
        },
        '@type': 'Organization',
        identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076',
      },
    ],
    description: {
      en: 'English Description',
      fi: 'Finnish Description',
    },
    is_output_of: [
      {
        name: {
          en: 'Project',
          fi: 'Projekti',
        },
        identifier: 'project-identifier',
        funder_type: {
          in_scheme: 'http://uri.suomi.fi/codelist/fairdata/funder_type',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/funder_type/code/eu-esr',
          pref_label: {
            en: 'EU European Social Fund ESR',
            fi: 'EU Euroopan sosiaalirahasto ESR',
            und: 'EU Euroopan sosiaalirahasto ESR',
          },
        },
        has_funding_agency: [
          {
            name: {
              en: 'Aalto University',
              fi: 'Aalto yliopisto',
              sv: 'Aalto universitetet',
              und: 'Aalto yliopisto',
            },
            '@type': 'Organization',
            identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076',
            contributor_type: [
              {
                in_scheme: 'http://uri.suomi.fi/codelist/fairdata/contributor_type',
                definition: {
                  en: 'Definition of a concept',
                  fi: 'Konseptin m\u00e4\u00e4ritelm\u00e4',
                },
                identifier:
                  'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/Researcher',
                pref_label: {
                  en: 'Researcher',
                  fi: 'Tutkija',
                  sv: 'Forskare',
                  und: 'Tutkija',
                },
              },
            ],
          },
        ],
        source_organization: [
          {
            name: {
              en: 'Aalto University',
              fi: 'Aalto yliopisto',
              sv: 'Aalto universitetet',
              und: 'Aalto yliopisto',
            },
            '@type': 'Organization',
            identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076',
          },
        ],
        has_funder_identifier: 'project-funding-identifier',
      },
    ],
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
        {
          title: {
            en: 'Creative Commons Attribution 1.0 Generic (CC BY 1.0)',
            fi: 'Creative Commons Nime\u00e4 1.0 Yleinen (CC BY 1.0)',
            und: 'Creative Commons Nime\u00e4 1.0 Yleinen (CC BY 1.0)',
          },
          license: 'https://creativecommons.org/licenses/by/1.0/',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-1.0',
        },
      ],
      access_type: {
        in_scheme: 'http://uri.suomi.fi/codelist/fairdata/access_type',
        identifier: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/login',
        pref_label: {
          en: 'Requires login in Fairdata service',
          fi: 'Vaatii kirjautumisen Fairdata-palvelussa',
          und: 'Vaatii kirjautumisen Fairdata-palvelussa',
        },
      },
      restriction_grounds: [
        {
          in_scheme: 'http://uri.suomi.fi/codelist/fairdata/restriction_grounds',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/restriction_grounds/code/copyright',
          pref_label: {
            en: 'Restricted access due to copyright',
            fi: 'Saatavuutta rajoitettu tekij\u00e4oikeuden perusteella',
            sv: 'Begr\u00e4nsad \u00e5tkomst p\u00e5 grund av upphovsr\u00e4tt',
            und: 'Saatavuutta rajoitettu tekij\u00e4oikeuden perusteella',
          },
        },
      ],
      show_file_metadata: true, // for testing
    },
    rights_holder: [
      {
        name: 'Human Person',
        '@type': 'Person',
        email: 'email@example.com',
        member_of: {
          name: {
            en: 'Unseen University',
          },
          '@type': 'Organization',
        },
        identifier: 'https://orcid.org/person',
      },
    ],
    infrastructure: [
      {
        in_scheme:
          'https://avaa.tdata.fi/api/jsonws/tupa-portlet.Infrastructures/get-all-infrastructures',
        identifier: 'http://urn.fi/urn:nbn:fi:research-infras-2016072527',
        pref_label: {
          en: 'Bioeconomy Infrastructure',
          fi: 'Huippuallianssi kest\u00e4v\u00e4\u00e4n biomassan jalostukseen',
          und: 'Huippuallianssi kest\u00e4v\u00e4\u00e4n biomassan jalostukseen',
        },
      },
      {
        in_scheme:
          'https://avaa.tdata.fi/api/jsonws/tupa-portlet.Infrastructures/get-all-infrastructures',
        identifier: 'http://urn.fi/urn:nbn:fi:research-infras-2016072528',
        pref_label: {
          en: 'Cherenkov Telescope Array',
          fi: 'Cherenkov teleskooppij\u00e4rjestelm\u00e4',
          und: 'Cherenkov teleskooppij\u00e4rjestelm\u00e4',
        },
      },
    ],
    field_of_science: [
      {
        in_scheme: 'http://www.yso.fi/onto/okm-tieteenala/conceptscheme',
        identifier: 'http://www.yso.fi/onto/okm-tieteenala/ta111',
        pref_label: {
          en: 'Mathematics',
          fi: 'Matematiikka',
          sv: 'Matematik',
          und: 'Matematiikka',
        },
      },
      {
        in_scheme: 'http://www.yso.fi/onto/okm-tieteenala/conceptscheme',
        identifier: 'http://www.yso.fi/onto/okm-tieteenala/ta114',
        pref_label: {
          en: 'Physical sciences',
          fi: 'Fysiikka',
          sv: 'Fysik',
          und: 'Fysiikka',
        },
      },
      {
        in_scheme: 'http://www.yso.fi/onto/okm-tieteenala/conceptscheme',
        identifier: 'http://www.yso.fi/onto/okm-tieteenala/ta113',
        pref_label: {
          en: 'Computer and information sciences',
          fi: 'Tietojenk\u00e4sittely ja informaatiotieteet',
          sv: 'Data- och informationsvetenskap',
          und: 'Tietojenk\u00e4sittely ja informaatiotieteet',
        },
      },
    ],
    other_identifier: [
      {
        notation: 'https://doi.org/identifier',
      },
      {
        notation: 'https://doi.org/another_identifier',
      },
    ],
    remote_resources: [
      {
        title: 'A Resource',
        access_url: {
          identifier: 'https://access.url',
        },
        download_url: {
          identifier: 'https://download.url',
        },
        use_category: {
          in_scheme: 'http://uri.suomi.fi/codelist/fairdata/use_category',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
          pref_label: {
            en: 'Documentation',
            fi: 'Dokumentaatio',
            und: 'Dokumentaatio',
          },
        },
      },
    ],
    preferred_identifier: 'urn:nbn:fi:att:be05442c-1cb6-4fb3-999b-d076d12c7842',
    metadata_version_identifier: '746e5452-f281-4b51-be23-23709985c4b1',
    total_remote_resources_byte_size: 0,
  },
  preservation_state: 0,
  state: 'published',
  cumulative_state: 0,
  access_granter: {
    name: 'tepp\u00e5 testaaja',
    email: 'teponemail@example.com',
    userid: 'teppo',
  },
  api_meta: {
    version: 2,
  },
  date_modified: '2021-02-10T12:03:42+02:00',
  date_created: '2021-02-10T11:44:51+02:00',
  service_modified: 'qvain',
  service_created: 'qvain',
  removed: false,
}

export default dataset
