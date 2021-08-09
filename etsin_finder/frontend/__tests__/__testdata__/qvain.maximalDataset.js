// Dataset that attempts to contain all fields supported by Metax, except for files/directories

const dataset = {
  data_catalog: null,
  state: 'published',
  metadata_owner_org: 'abc-org-123',
  metadata_provider_org: 'abc-org-123',
  metadata_provider_user: 'abc-user-123',
  research_dataset: {
    metadata_version_identifier: null,
    preferred_identifier: null,
    modified: '2014-01-17T08:19:58Z',
    version_info: '0.1.2',
    version_notes: ['This version contains changes to x and y.'],
    issued: '2014-01-17',
    title: {
      en: 'Wonderful Title',
      fi: 'Hieno kuvaus',
      sv: 'Titel på svenska',
      sw: 'Kichwa kwa kiswahili',
    },
    keyword: ['keyword', 'keyword2', 'keyword3'],
    description: {
      en: 'A descriptive description describing the contents of this dataset. Must be descriptive.',
      fi: 'Sama suomeksi',
      sv: 'Beskrivning på svenska.',
    },
    bibliographic_citation: 'this is how this dataset should be cited',
    value: 0.111,
    language: [
      {
        title: {
          en: "Abu' Arapesh",
          und: "Abu' Arapesh",
        },
        identifier: 'http://lexvo.org/id/iso639-3/aah',
      },
      {
        title: {
          en: 'Cusco Quechua',
          und: 'Cusco Quechua',
        },
        identifier: 'http://lexvo.org/id/iso639-3/quz',
      },
      {
        title: {
          en: 'Leeward Caribbean Creole English',
          und: 'Leeward Caribbean Creole English',
        },
        identifier: 'http://lexvo.org/id/iso639-3/aig',
      },
    ],
    temporal: [
      {
        start_date: '2014-01-01T08:19:58Z',
        end_date: '2014-12-31T08:19:58Z',
      },
      {
        temporal_coverage: '2011-2030',
      },
    ],
    total_files_byte_size: 1024,
    spatial: [
      {
        geographic_name: 'Geographic name',
        alt: '11.111',
        full_address: 'The complete address written as a string, with or without formatting',
        as_wkt: ['POLYGON((0 0, 0 20, 40 20, 40 0, 0 0))'],
        place_uri: {
          in_scheme: 'http://www.yso.fi/onto/yso/places',
          identifier: 'http://www.yso.fi/onto/yso/p94161',
          pref_label: {
            en: 'Eastern Finland',
            fi: 'Itä-Suomi',
            sv: 'Östra Finland',
            und: 'Itä-Suomi',
          },
        },
      },
      {
        geographic_name: 'Geographic name 2',
        alt: '60',
        full_address: 'The complete address written as a string, with or without formatting',
        place_uri: {
          identifier: 'http://www.yso.fi/onto/yso/p107966',
        },
      },
    ],
    infrastructure: [
      {
        identifier: 'http://urn.fi/urn:nbn:fi:research-infras-2016072515',
        pref_label: {
          fi: 'Biokeskus Suomi',
          en: 'Biocenter Finland',
          und: 'Biokeskus Suomi',
        },
        in_scheme:
          'https://avaa.tdata.fi/api/jsonws/tupa-portlet.Infrastructures/get-all-infrastructures',
      },
    ],
    access_rights: {
      description: {
        en: 'Free account of the rights',
      },
      available: '2014-01-15',
      access_type: {
        identifier: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
        pref_label: {
          en: 'pref label for this type',
          fi: 'tyypin kuvaus',
          sv: 'typ',
          und: 'pref label for this type',
        },
        definition: {
          en: 'A statement or formal explanation of the meaning of a concept.',
        },
        in_scheme: 'http://uri.of.filetype.concept/scheme',
      },
      restriction_grounds: [
        {
          identifier: 'http://uri.suomi.fi/codelist/fairdata/restriction_grounds/code/other',
        },
      ],
      license: [
        {
          identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/Apache-2.0',
          title: {
            en: 'A name given to the resource',
          },
          description: {
            en: 'Free account of the rights',
          },
          license: 'https://url.of.license.which.applies.here.org',
        },
        {
          identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-NC-2.0',
          title: {
            en: 'A name given to the resource',
          },
          description: {
            en: 'Free account of the rights',
          },
        },
        {
          identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/other',
          title: {
            en: 'A name given to the resource',
          },
        },
      ],
      access_url: {
        identifier: 'https://access.url.com/landing',
        title: {
          en: 'A name given to the document',
        },
        description: {
          en: 'Description of the link. For example to be used as hover text.',
        },
      },
    },
    other_identifier: [
      {
        notation: 'doi:10.12345',
        local_identifier_type:
          'Local identifier type defines use of the identifier in given context',
        provider: {
          '@type': 'Organization',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/01901',
          name: {
            en: 'Org in ref data',
            fi: 'Organisaatio',
          },
          email: 'info@csc.fi',
          telephone: ['+358501231235'],
          contributor_type: [
            {
              identifier:
                'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/ContactPerson',
            },
          ],
        },
        type: {
          identifier: 'doi',
          pref_label: {
            en: 'pref label',
          },
          definition: {
            en: 'A statement or formal explanation of the meaning of a concept.',
          },
          in_scheme: 'http://uri.of.filetype.concept/scheme',
        },
      },
      {
        notation: 'urn:nbn:fi-12345',
        local_identifier_type:
          'Local identifier type defines use of the identifier in given context',
        provider: {
          '@type': 'Organization',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/01901',
          name: {
            en: 'Mysterious Organization',
            fi: 'Organisaatio',
          },
          email: 'info@csc.fi',
          telephone: ['+358501231235'],
          contributor_type: [
            {
              identifier:
                'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/DataCollector',
            },
          ],
        },
        type: {
          identifier: 'http://uri.suomi.fi/codelist/fairdata/identifier_type/code/urn',
          pref_label: {
            en: 'pref label for y',
          },
          definition: {
            en: 'A statement or formal explanation of the meaning of a concept.',
          },
          in_scheme: 'http://uri.of.filetype.concept/scheme',
        },
      },
    ],
    field_of_science: [
      {
        identifier: 'http://www.yso.fi/onto/okm-tieteenala/ta414',
        pref_label: {
          en: 'pref label for this type',
        },
        definition: {
          en: 'A statement or formal explanation of the meaning of a concept.',
        },
        in_scheme: 'http://uri.of.filetype.concept/scheme',
      },
    ],
    theme: [
      {
        identifier: 'http://www.yso.fi/onto/koko/p32202',
        pref_label: {
          en: 'pref label for theme',
        },
        definition: {
          en: 'A statement or formal explanation of the meaning of a concept.',
        },
        in_scheme: 'http://uri.of.filetype.concept/scheme',
      },
      {
        identifier: 'http://www.yso.fi/onto/koko/p76312',
        pref_label: {
          en: 'pref label for theme',
        },
        definition: {
          en: 'A statement or formal explanation of the meaning of a concept.',
        },
        in_scheme: 'http://uri.of.filetype.concept/scheme',
      },
    ],
    provenance: [
      {
        title: {
          en: 'Some activity',
        },
        description: {
          en: 'Description of provenance activity',
        },
        temporal: {
          start_date: '2014-01-01T08:19:58Z',
          end_date: '2014-12-31T08:19:58Z',
        },
        spatial: {
          geographic_name: 'Geographic name',
          alt: '11.111',
          full_address: 'The complete address written as a string, with or without formatting',
          place_uri: {
            identifier: 'http://www.yso.fi/onto/yso/p107966',
          },
        },
        lifecycle_event: {
          identifier: 'http://uri.suomi.fi/codelist/fairdata/lifecycle_event/code/collected',
          definition: {
            en: 'A statement or formal explanation of the meaning of a concept.',
          },
          in_scheme: 'http://uri.of.filetype.concept/scheme',
        },
        used_entity: [
          {
            title: {
              en: 'Title',
              fi: 'Otsikko',
              sv: 'Titel',
              und: 'Title',
            },
            description: {
              en: 'Description',
              fi: 'Kuvaus',
              sv: 'Beskrivning',
              und: 'Description',
            },
            identifier: 'someidhereagain',
            type: {
              identifier: 'thisisnotenoughconcepts',
              pref_label: {
                en: 'pref label for this type',
              },
              definition: {
                en: 'A statement or formal explanation of the meaning of a concept.',
              },
              in_scheme: 'http://uri.of.filetype.concept/scheme',
            },
          },
        ],
        was_associated_with: [
          {
            '@type': 'Organization',
            identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/01901',
            name: {
              en: 'Mysterious Organization',
              fi: 'Organisaatio',
            },
            email: 'info@csc.fi',
            telephone: ['+358501231235'],
            contributor_type: [
              {
                identifier:
                  'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/DataCurator',
              },
            ],
          },
        ],
        variable: [
          {
            pref_label: {
              en: 'Preferred label',
            },
            description: {
              en: 'Description',
            },
            concept: {
              identifier: 'variableconceptidentifier',
              pref_label: {
                en: 'pref label',
              },
              definition: {
                en: 'A statement or formal explanation of the meaning of a concept.',
              },
              in_scheme: 'http://uri.of.filetype.concept/scheme',
            },
            universe: {
              identifier: 'universeconceptidentifier',
              pref_label: {
                en: 'pref label',
              },
              definition: {
                en: 'A statement or formal explanation of the meaning of a concept.',
              },
              in_scheme: 'http://uri.of.filetype.concept/scheme',
            },
            representation: 'http://uri.of.filetype.concept/scheme',
          },
        ],
        event_outcome: {
          identifier: 'http://uri.suomi.fi/codelist/fairdata/event_outcome/code/success',
          pref_label: {
            en: 'Success',
            fi: 'Onnistunut',
            sv: 'Framg\u00e5ngsrik',
            und: 'Onnistunut',
          },
          in_scheme: 'http://uri.suomi.fi/codelist/fairdata/event_outcome',
        },
        outcome_description: { fi: 'Onnistui hyvin', en: 'A grand success' },
      },
      {
        title: {
          en: 'Some other activity',
        },
        description: {
          en: 'Description of other provenance activity',
        },
        temporal: {
          start_date: '2014-01-01T08:19:58Z',
          end_date: '2014-12-31T08:19:58Z',
        },
        spatial: {
          geographic_name: 'Geographic name',
          alt: '11.111',
          full_address: 'The complete address written as a string, with or without formatting',
          place_uri: {
            identifier: 'http://www.yso.fi/onto/yso/p105917',
          },
        },
        preservation_event: {
          identifier: 'http://uri.suomi.fi/codelist/fairdata/preservation_event/code/upd',
        },
        event_outcome: {
          identifier: 'Failure',
        },
        outcome_description: { fi: 'Epäonnistui', en: 'A grand failure' },
      },
    ],
    rights_holder: [
      {
        '@type': 'Organization',
        identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/01901',
        name: {
          en: 'Mysterious Organization',
          fi: 'Organisaatio',
        },
        email: 'info@csc.fi',
        telephone: ['+358501231235'],
        is_part_of: {
          '@type': 'Organization',
          identifier: '10076',
          name: {
            en: 'Parent Mysterious Organization',
            fi: 'Organisaatio',
          },
        },
        contributor_type: [
          {
            identifier: 'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/DataManager',
          },
        ],
      },
    ],
    creator: [
      {
        '@type': 'Person',
        name: 'Teppo Testaaja',
        member_of: {
          '@type': 'Organization',
          identifier: '10076',
          name: {
            en: 'Mysterious Organization',
            fi: 'Organisaatio',
          },
        },
        contributor_role: [
          {
            identifier:
              'http://uri.suomi.fi/codelist/fairdata/contributor_role/code/conceptualization',
          },
        ],
      },
    ],
    curator: [
      {
        '@type': 'Organization',
        identifier: 'id:of:curator:default',
        name: {
          en: 'Mysterious Organization',
          fi: 'Organisaatio',
        },
        is_part_of: {
          '@type': 'Organization',
          identifier: '10076',
          name: {
            en: 'Parent Mysterious Organization',
            fi: 'Organisaatio',
          },
        },
        contributor_type: [
          {
            identifier: 'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/Distributor',
          },
          {
            identifier: 'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/Sponsor',
          },
        ],
      },
    ],
    publisher: {
      '@type': 'Organization',
      identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076-A800',
      name: {
        en: 'Mysterious Organization',
        fi: 'Organisaatio',
      },
      email: 'info@csc.fi',
      telephone: ['+358501231235'],
      homepage: {
        identifier: 'http://www.publisher.fi/',
        title: {
          en: 'Publisher website',
          fi: 'Julkaisijan kotisivu',
        },
      },
      is_part_of: {
        '@type': 'Organization',
        identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/10076',
        name: {
          en: 'Parent of Mysterious Organization',
          fi: 'Organisaatio',
        },
        email: 'info@csc.fi',
        telephone: ['+234234'],
        homepage: {
          identifier: 'http://www.publisher_parent.fi/',
          title: {
            en: 'Publisher parent website',
            fi: 'Julkaisijan yläorganisaation kotisivu',
          },
        },
      },
      contributor_type: [
        {
          identifier: 'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/Distributor',
        },
      ],
    },
    contributor: [
      {
        '@type': 'Person',
        identifier: 'contributorid',
        name: 'Kalle Kontribuuttaja',
        email: 'kalle.kontribuuttaaja@csc.fi',
        telephone: ['+358501231122'],
        member_of: {
          '@type': 'Organization',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/01901',
          name: {
            en: 'Mysterious Organization 1',
            fi: 'Organisaatio',
          },
          email: 'info@csc.fi',
          telephone: ['+358501231235'],
        },
        contributor_role: [
          {
            identifier:
              'http://uri.suomi.fi/codelist/fairdata/contributor_role/code/funding_acquisition',
          },
        ],
      },
      {
        '@type': 'Person',
        identifier: 'contributorid2',
        name: 'Franzibald Kontribuuttaja',
        email: 'franzibald.kontribuuttaaja@csc.fi',
        telephone: ['+358501231133'],
        member_of: {
          '@type': 'Organization',
          identifier: 'org_identifier',
          name: {
            en: 'Mysterious Organization 2',
            fi: 'Organisaatio',
          },
          email: 'joo@csc.fi',
          telephone: ['+23423423'],
        },
        contributor_type: [
          {
            identifier: 'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/ProjectLeader',
          },
        ],
      },
    ],
    is_output_of: [
      {
        name: {
          en: 'Name of project',
        },
        identifier: 'projectidentifier',
        has_funder_identifier: 'funderprojectidentifier',
        has_funding_agency: [
          {
            '@type': 'Organization',
            identifier: 'fundingagencyidentifier',
            name: {
              en: 'Funding Organization',
              fi: 'Organisaatio',
            },
            email: 'rahoitus@rahaorg.fi',
            telephone: ['+358501232233'],
            contributor_type: [
              {
                identifier: 'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/Editor',
              },
            ],
          },
        ],
        source_organization: [
          {
            '@type': 'Organization',
            identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/01901',
            name: {
              en: 'Mysterious Organization',
              fi: 'Organisaatio',
            },
            email: 'info@csc.fi',
            telephone: ['+358501231235'],
            contributor_type: [
              {
                identifier:
                  'http://uri.suomi.fi/codelist/fairdata/contributor_type/code/HostingInstitution',
              },
            ],
          },
        ],
        funder_type: {
          identifier: 'tekes',
        },
      },
    ],
    relation: [
      {
        entity: {
          title: {
            fi: 'Ulkopuolinen aineisto 1',
            en: 'External dataset 1',
          },
          description: {
            fi: 'Kuvailutiedot',
          },
          identifier: 'external:dataset:identifier',
          type: {
            identifier: 'http://uri.suomi.fi/codelist/fairdata/resource_type/code/physical_object',
          },
        },
        relation_type: {
          identifier: 'http://purl.org/dc/terms/hasPart',
          pref_label: {
            fi: 'Osa aineistoa',
            en: 'Has part',
            und: 'Osa aineistoa',
          },
        },
      },
      {
        entity: {
          title: {
            fi: 'Ulkopuolinen asia 2',
            en: 'External thing 2',
          },
          description: {
            fi: 'Kuvailutiedot',
          },
          identifier: 'external:thing:identifier',
          type: {
            identifier: 'http://uri.suomi.fi/codelist/fairdata/resource_type/code/collection',
          },
        },
        relation_type: {
          identifier: 'cites',
        },
      },
      {
        entity: {
          title: {
            fi: 'Ulkopuolinen aineisto 2',
            en: 'External dataset 2',
          },
          description: {
            fi: 'Kuvailutiedot',
          },
          identifier: 'external:dataset_2:identifier',
          type: {
            identifier: 'http://uri.suomi.fi/codelist/fairdata/resource_type/code/service',
          },
        },
        relation_type: {
          identifier: 'isPartOf',
        },
      },
      {
        entity: {
          title: {
            fi: 'Ulkopuolinen asia 2',
            en: 'External thing 2',
          },
          description: {
            fi: 'Kuvailutiedot',
          },
          identifier: 'external:thing_2:identifier',
          type: {
            identifier: 'http://uri.suomi.fi/codelist/fairdata/resource_type/code/ui',
          },
        },
        relation_type: {
          identifier: 'hasPreviousVersion',
        },
      },
    ],
  },
  service_created: 'metax',
  api_meta: {
    version: 1,
  },
}

export default dataset
