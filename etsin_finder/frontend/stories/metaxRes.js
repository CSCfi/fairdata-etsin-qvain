export default {
  id: 13,
  identifier: 'cr955e904-e3dd-4d7e-99f1-3fed446f9613',
  data_catalog: { id: 1, identifier: 'urn:nbn:fi:att:2955e904-e3dd-4d7e-99f1-3fed446f96d1' },
  dataset_version_set: [
    {
      identifier: 'cr955e904-e3dd-4d7e-99f1-3fed446f9613',
      preferred_identifier: 'urn:nbn:fi:att:1955e904-e3dd-4d7e-99f1-3fed446f9613',
      removed: false,
      date_created: '2017-05-23T13:07:22+03:00',
    },
  ],
  deprecated: false,
  research_dataset: {
    files: [
      {
        title: 'file title 6',
        file_type: {
          in_scheme: [
            {
              identifier: 'http://uri.of.filetype.concept/scheme',
              pref_label: { en: 'The preferred lexical label for a resource' },
            },
          ],
          definition: [{ en: 'A statement or formal explanation of the meaning of a concept.' }],
          identifier: 'http://purl.org/att/es/reference_data/file_type/file_type_video',
          pref_label: { en: 'Video', fi: 'Video', und: 'Video' },
        },
        identifier: 'pid:urn:6',
        description: 'file description 6',
        use_category: {
          identifier:
            'http://purl.org/att/es/reference_data/use_category/use_category_configuration',
          pref_label: {
            en: 'Configuration files',
            fi: 'Konfiguraatiotiedosto',
            und: 'Konfiguraatiotiedosto',
          },
        },
      },
      {
        title: 'file title 10',
        file_type: {
          in_scheme: [
            {
              identifier: 'http://uri.of.filetype.concept/scheme',
              pref_label: { en: 'The preferred lexical label for a resource' },
            },
          ],
          definition: [{ en: 'A statement or formal explanation of the meaning of a concept.' }],
          identifier: 'http://purl.org/att/es/reference_data/file_type/file_type_software',
          pref_label: { en: 'Software', fi: 'Sovellus', und: 'Sovellus' },
        },
        identifier: 'pid:urn:10',
        description: 'file description 10',
        use_category: {
          identifier: 'http://purl.org/att/es/reference_data/use_category/use_category_publication',
          pref_label: { en: 'Publication', fi: 'Julkaisu', und: 'Julkaisu' },
        },
      },
    ],
    theme: [
      {
        in_scheme: [
          {
            identifier: 'http://uri.of.concept/scheme',
            pref_label: { en: 'The preferred lexical label for a resource' },
          },
        ],
        definition: [{ en: 'A statement or formal explanation of the meaning of a concept.' }],
        identifier: 'http://www.yso.fi/onto/yso/p20518',
        pref_label: {
          en: 'Lapua movement',
          fi: 'lapuanliike',
          sv: 'Lapporörelsen',
          und: 'lapuanliike',
        },
      },
    ],
    title: { en: 'Wonderful Title' },
    value: [0.111],
    issued: '2014-01-17T08:19:58Z',
    creator: [
      {
        name: 'Teppo Testaaja',
        '@type': 'Person',
        identifier: 'orcid.org/0000-0003-4727-9435',
        member_of: {
          name: { und: 'Aalto yliopisto' },
          '@type': 'Organization',
          identifier: 'http://purl.org/att/es/organization_data/organization/organization_10076',
        },
        contributor_role: {
          identifier:
            'http://purl.org/att/es/reference_data/contributor_role/contributor_role_data_curation',
          pref_label: { en: 'Data curation', und: 'Data curation' },
        },
        homepage: {
          identifier: 'http://purl.org',
          title: 'purl.org',
          description: 'purl website',
        },
      },
    ],
    curator: [
      {
        name: { en: 'Mysterious Organization', fi: 'Organisaatio' },
        '@type': 'Organization',
        identifier: 'id:of:curator:default',
        is_part_of: {
          name: { und: 'Aalto yliopisto' },
          '@type': 'Organization',
          identifier: 'http://purl.org/att/es/organization_data/organization/organization_10076',
        },
      },
    ],
    keyword: ['keyword', 'keyword2', 'keyword3'],
    spatial: [
      {
        alt: '11.111',
        as_wkt: ['POLYGON((0 0, 0 20, 40 20, 40 0, 0 0))'],
        place_uri: {
          identifier: 'http://www.yso.fi/onto/yso/p107966',
          pref_label: {
            en: 'Olostunturi',
            fi: 'Olostunturi',
            sv: 'Olostunturi',
            und: 'Olostunturi',
          },
        },
        full_address: 'The complete address written as a string, with or without formatting',
        geographic_name: 'Geographic name',
      },
      {
        alt: '60',
        as_wkt: ['POINT(23.80834 67.92415)'],
        place_uri: {
          identifier: 'http://www.yso.fi/onto/yso/p107966',
          pref_label: {
            en: 'Olostunturi',
            fi: 'Olostunturi',
            sv: 'Olostunturi',
            und: 'Olostunturi',
          },
        },
        full_address: 'The complete address written as a string, with or without formatting',
        geographic_name: 'Geographic name 2',
      },
    ],
    language: [
      {
        title: {
          en: 'English language',
          fi: 'Englannin kieli',
          sv: 'engelska',
          und: 'Englannin kieli',
        },
        identifier: 'http://lexvo.org/id/iso639-3/eng',
      },
    ],
    modified: '2014-01-17T08:19:58Z',
    relation: [
      {
        entity: {
          title: { en: 'External dataset 1', fi: 'Ulkopuolinen aineisto 1' },
          identifier: 'external:dataset:identifier',
          description: { fi: 'Kuvailutiedot' },
        },
        relation_type: {
          identifier: 'http://www.w3.org/ns/prov#wasDerivedFrom',
          pref_label: {
            en: 'Was derived from',
            fi: 'Johdettu aineistosta',
            und: 'Johdettu aineistosta',
          },
        },
      },
      {
        entity: {
          title: { en: 'External thing 2', fi: 'Ulkopuolinen asia 2' },
          identifier: 'external:thing:identifier',
          description: { fi: 'Kuvailutiedot' },
        },
        relation_type: {
          identifier: 'http://purl.org/spar/cito/cites',
          pref_label: { en: 'Cites', fi: 'Viittaa', und: 'Viittaa' },
        },
      },
      {
        entity: {
          title: { en: 'External dataset 2', fi: 'Ulkopuolinen aineisto 2' },
          identifier: 'external:dataset_2:identifier',
          description: { fi: 'Kuvailutiedot' },
        },
        relation_type: {
          identifier: 'http://purl.org/dc/terms/isPartOf',
          pref_label: { en: 'Is part of', fi: 'Kuuluu aineistoon', und: 'Kuuluu aineistoon' },
        },
      },
      {
        entity: {
          title: { en: 'External thing 2', fi: 'Ulkopuolinen asia 2' },
          identifier: 'external:thing_2:identifier',
          description: { fi: 'Kuvailutiedot' },
        },
        relation_type: {
          identifier: 'http://www.w3.org/ns/adms#previous',
          pref_label: {
            en: 'Has previous version',
            fi: 'Edellinen versio',
            und: 'Edellinen versio',
          },
        },
      },
    ],
    temporal: [{ end_date: '2014-12-31T08:19:58Z', start_date: '2014-01-01T08:19:58Z' }],
    publisher: {
      name: { und: 'School services, ARTS' },
      '@type': 'Organization',
      email: 'info@csc.fi',
      homepage: {
        title: { en: 'Publisher website', fi: 'Julkaisijan kotisivu' },
        identifier: 'http://www.publisher.fi/',
      },
      telephone: ['+358501231235'],
      identifier: 'http://purl.org/att/es/organization_data/organization/organization_10076-A800',
      is_part_of: {
        name: { und: 'Aalto yliopisto' },
        '@type': 'Organization',
        email: 'info@csc.fi',
        homepage: {
          title: { en: 'Publisher parent website', fi: 'Julkaisijan yläorganisaation kotisivu' },
          identifier: 'http://www.publisher_parent.fi/',
        },
        telephone: ['+234234'],
        identifier: 'http://purl.org/att/es/organization_data/organization/organization_10076',
      },
    },
    provenance: [
      {
        title: { en: 'Some activity' },
        spatial: {
          alt: '11.111',
          as_wkt: ['POINT(23.80834 67.92415)'],
          place_uri: {
            identifier: 'http://www.yso.fi/onto/yso/p107966',
            pref_label: {
              en: 'Olostunturi',
              fi: 'Olostunturi',
              sv: 'Olostunturi',
              und: 'Olostunturi',
            },
          },
          fullAddress: 'The complete address written as a string, with or without formatting',
          geographic_name: 'Geographic name',
        },
        temporal: { end_date: '2014-12-31T08:19:58Z', start_date: '2014-01-01T08:19:58Z' },
        variable: [
          {
            concept: {
              in_scheme: [
                {
                  identifier: 'http://uri.of.variable.concept/scheme',
                  pref_label: { en: 'The preferred lexical label for a resource' },
                },
              ],
              definition: [
                { en: 'A statement or formal explanation of the meaning of a concept.' },
              ],
              identifier: 'variableconceptidentifier',
              pref_label: { en: 'pref label' },
            },
            universe: {
              in_scheme: [
                {
                  identifier: 'http://uri.of.universe.concept/scheme',
                  pref_label: { en: 'The preferred lexical label for a resource' },
                },
              ],
              definition: [
                { en: 'A statement or formal explanation of the meaning of a concept.' },
              ],
              identifier: 'universeconceptidentifier',
              pref_label: { en: 'pref label' },
            },
            pref_label: { en: 'Preferred label' },
            description: { en: 'Description' },
            representation: {
              identifier: 'identifierheretoo',
              pref_label: { en: 'Preferred label' },
            },
          },
        ],
        description: { en: 'Description of provenance activity' },
        used_entity: [
          {
            type: {
              in_scheme: [
                {
                  identifier: 'http://uri.of.used.concept/scheme',
                  pref_label: { en: 'The preferred lexical label for a resource' },
                },
              ],
              definition: [
                { en: 'A statement or formal explanation of the meaning of a concept.' },
              ],
              identifier: 'thisisnotenoughconcepts',
              pref_label: { en: 'pref label for this type' },
            },
            title: { en: 'Title' },
            identifier: 'someidhereagain',
            description: { en: 'Description' },
          },
        ],
        lifecycle_event: {
          in_scheme: [
            {
              identifier: 'http://uri.of.provenance.concept/scheme',
              pref_label: { en: 'The preferred lexical label for a resource' },
            },
          ],
          definition: [{ en: 'A statement or formal explanation of the meaning of a concept.' }],
          identifier:
            'http://purl.org/att/es/reference_data/lifecycle_event/lifecycle_event_collected',
          pref_label: { en: 'Collected', fi: 'Kerätty', und: 'Kerätty' },
        },
        was_associated_with: [
          {
            name: { und: 'Helsingin yliopisto' },
            '@type': 'Organization',
            email: 'info@csc.fi',
            telephone: ['+358501231235'],
            identifier: 'http://purl.org/att/es/organization_data/organization/organization_01901',
          },
        ],
      },
      {
        title: { en: 'Some other activity' },
        spatial: {
          alt: '11.111',
          as_wkt: ['POINT(26 60.5)'],
          place_uri: {
            identifier: 'http://www.yso.fi/onto/yso/p105917',
            pref_label: {
              en: 'Southern Finland Province',
              fi: 'Etelä-Suomi',
              sv: 'Södra Finland',
              und: 'Etelä-Suomi',
            },
          },
          fullAddress: 'The complete address written as a string, with or without formatting',
          geographic_name: 'Geographic name',
        },
        temporal: { end_date: '2014-12-31T08:19:58Z', start_date: '2014-01-01T08:19:58Z' },
        description: { en: 'Description of other provenance activity' },
        preservation_event: {
          identifier:
            'http://purl.org/att/reference_data/preservation_event/preservation_event_upd',
          pref_label: { en: 'Object update', fi: 'Objektin päivitys', und: 'Objektin päivitys' },
        },
      },
    ],
    contributor: [
      {
        name: 'Kalle Kontribuuttaja',
        '@type': 'Person',
        email: 'kalle.kontribuuttaaja@csc.fi',
        member_of: {
          name: { und: 'Helsingin yliopisto' },
          '@type': 'Organization',
          email: 'info@csc.fi',
          telephone: ['+358501231235'],
          identifier: 'http://purl.org/att/es/organization_data/organization/organization_01901',
        },
        telephone: ['+358501231122'],
        identifier: 'contributorid',
        contributor_role: {
          identifier:
            'http://purl.org/att/es/reference_data/contributor_role/contributor_role_funding_acquisition',
          pref_label: { en: 'Funding acquisition', und: 'Funding acquisition' },
        },
      },
      {
        name: 'Franzibald Kontribuuttaja',
        '@type': 'Person',
        email: 'franzibald.kontribuuttaaja@csc.fi',
        member_of: {
          name: { en: 'Mysterious Organization 2', fi: 'Organisaatio' },
          '@type': 'Organization',
          email: 'joo@csc.fi',
          telephone: ['+23423423'],
          identifier: 'org_identifier',
        },
        telephone: ['+358501231133'],
        identifier: 'contributorid2',
        contributor_role: {
          identifier:
            'http://purl.org/att/es/reference_data/contributor_role/contributor_role_project_administration',
          pref_label: { en: 'Project administration', und: 'Project administration' },
        },
      },
      {
        name: 'Franzibalds Cousin',
        '@type': 'Person',
        email: 'franzibald.cousin@csc.fi',
        member_of: {
          name: { en: 'Mysterious Organization 2', fi: 'Organisaatio' },
          '@type': 'Organization',
          email: 'joo@csc.fi',
          telephone: ['+23423423'],
          identifier: 'org_identifier',
        },
        telephone: ['+358501231133'],
        identifier: 'contributorid2',
        contributor_role: {
          identifier:
            'http://purl.org/att/es/reference_data/contributor_role/contributor_role_project_administration',
          pref_label: { en: 'Project administration', und: 'Project administration' },
        },
      },
      {
        name: 'Topi Toimittaja',
        '@type': 'Person',
        email: 'topi.toimittaja@csc.fi',
        member_of: {
          name: { en: 'Mysterious Organization 2', fi: 'Organisaatio' },
          '@type': 'Organization',
          email: 'joo@csc.fi',
          telephone: ['+23423423'],
          identifier: 'org_identifier',
        },
        telephone: ['+358501231133'],
        identifier: 'contributorid2',
        contributor_role: {
          identifier:
            'http://purl.org/att/es/reference_data/contributor_role/contributor_role_project_administration',
          pref_label: { en: 'Project administration', und: 'Project administration' },
        },
      },
      {
        name: 'Tosi-Pitkänimi Tommi Pitkäniemi Pisinnimi',
        '@type': 'Person',
        email: 'tepi.toimittaja@csc.fi',
        member_of: {
          name: { en: 'Mysterious Organization 2', fi: 'Organisaatio' },
          '@type': 'Organization',
          email: 'joo@csc.fi',
          telephone: ['+23423423'],
          identifier: 'org_identifier',
        },
        telephone: ['+358501231133'],
        identifier: 'contributorid2',
        contributor_role: {
          identifier:
            'http://purl.org/att/es/reference_data/contributor_role/contributor_role_project_administration',
          pref_label: { en: 'Project administration', und: 'Project administration' },
        },
      },
      {
        name: 'Tapi Toimittaja',
        '@type': 'Person',
        email: 'tapi.toimittaja@csc.fi',
        member_of: {
          name: { en: 'Mysterious Organization 2', fi: 'Organisaatio' },
          '@type': 'Organization',
          email: 'joo@csc.fi',
          telephone: ['+23423423'],
          identifier: 'org_identifier',
        },
        telephone: ['+358501231133'],
        identifier: 'contributorid2',
        contributor_role: {
          identifier:
            'http://purl.org/att/es/reference_data/contributor_role/contributor_role_project_administration',
          pref_label: { en: 'Project administration', und: 'Project administration' },
        },
      },
    ],
    description: [
      {
        en:
          'A descriptive description describing the contents of this dataset. Must be descriptive.',
      },
    ],
    directories: [
      {
        title: 'Phase 1 of science data C',
        identifier: 'pid:urn:dir:18',
        description: 'Description of the directory',
        use_category: {
          identifier: 'http://purl.org/att/es/reference_data/use_category/use_category_outcome',
          pref_label: { en: 'Outcome material', fi: 'Tulosaineisto', und: 'Tulosaineisto' },
        },
      },
      {
        title: 'Phase 2 of science data C',
        identifier: 'pid:urn:dir:22',
        description: 'Description of the directory',
        use_category: {
          identifier: 'http://purl.org/att/es/reference_data/use_category/use_category_outcome',
          pref_label: { en: 'Outcome material', fi: 'Tulosaineisto', und: 'Tulosaineisto' },
        },
      },
      {
        title: 'Phase 1 01/2018 of Science data A',
        identifier: 'pid:urn:dir:12',
        description: 'Description of the directory',
        use_category: {
          identifier: 'http://purl.org/att/es/reference_data/use_category/use_category_outcome',
          pref_label: { en: 'Outcome material', fi: 'Tulosaineisto', und: 'Tulosaineisto' },
        },
      },
      {
        title: 'Science data B',
        identifier: 'pid:urn:dir:13',
        description: 'Description of the directory',
        use_category: {
          identifier: 'http://purl.org/att/es/reference_data/use_category/use_category_source',
          pref_label: { en: 'Source material', fi: 'Lähdeaineisto', und: 'Lähdeaineisto' },
        },
      },
      {
        title: 'Other stuff',
        identifier: 'pid:urn:dir:14',
        description: 'Description of the directory',
        use_category: {
          identifier: 'http://purl.org/att/es/reference_data/use_category/use_category_method',
          pref_label: { en: 'Method', fi: 'Metodi', und: 'Metodi' },
        },
      },
    ],
    is_output_of: [
      {
        name: { en: 'Name of project' },
        identifier: 'projectidentifier',
        funder_type: {
          identifier: 'http://purl.org/att/es/reference_data/funder_type/funder_type_tekes',
          pref_label: { en: 'Tekes', fi: 'Tekes', und: 'Tekes' },
        },
        has_funding_agency: [
          {
            name: { en: 'Funding Organization', fi: 'Organisaatio' },
            '@type': 'Organization',
            email: 'rahoitus@rahaorg.fi',
            telephone: ['+358501232233'],
            identifier: 'fundingagencyidentifier',
          },
        ],
        source_organization: [
          {
            name: { und: 'Helsingin yliopisto' },
            '@type': 'Organization',
            email: 'info@csc.fi',
            telephone: ['+358501231235'],
            identifier: 'http://purl.org/att/es/organization_data/organization/organization_01901',
          },
        ],
        has_funder_identifier: 'funderprojectidentifier',
      },
    ],
    version_info: '0.1.2',
    access_rights: {
      license: [
        {
          title: { en: 'Apache Software License 2.0', und: 'Apache Software License 2.0' },
          license: 'https://url.of.license.which.applies.here.org',
          identifier: 'http://www.opensource.org/licenses/Apache-2.0',
          description: { en: 'Free account of the rights' },
        },
      ],
      available: '2014-01-15T08:19:58Z',
      access_type: {
        in_scheme: [
          {
            identifier: 'http://uri.of.accessrights.concept/scheme',
            pref_label: { en: 'The preferred lexical label for a resource' },
          },
        ],
        definition: [{ en: 'A statement or formal explanation of the meaning of a concept.' }],
        identifier: 'http://purl.org/att/es/reference_data/access_type/access_type_open_access',
        pref_label: { en: 'Open', fi: 'Avoin', und: 'Avoin' },
      },
      description: { en: 'Free account of the rights' },
      restriction_grounds: {
        identifier:
          'http://purl.org/att/es/reference_data/restriction_grounds/restriction_grounds_1',
        pref_label: {
          fi: 'Avoin, ei tiedossa olevia rajoituksia',
          und: 'Avoin, ei tiedossa olevia rajoituksia',
        },
      },
      has_rights_related_agent: [
        {
          name: { und: 'Helsingin yliopisto' },
          '@type': 'Organization',
          email: 'info@csc.fi',
          homepage: {
            title: { en: 'homepage title' },
            identifier: 'https://www.csc.fi',
            description: { en: 'homepage description' },
          },
          telephone: ['+358501231235'],
          identifier: 'http://purl.org/att/es/organization_data/organization/organization_01901',
        },
      ],
    },
    rights_holder: {
      name: { und: 'Helsingin yliopisto' },
      '@type': 'Organization',
      email: 'info@csc.fi',
      telephone: ['+358501231235'],
      identifier: 'http://purl.org/att/es/organization_data/organization/organization_01901',
      is_part_of: {
        name: { und: 'Aalto yliopisto' },
        '@type': 'Organization',
        identifier: 'http://purl.org/att/es/organization_data/organization/organization_10076',
      },
    },
    version_notes: ['This version contains changes to x and y.'],
    infrastructure: [
      {
        identifier: 'http://urn.fi/urn:nbn:fi:research-infras-2016072530',
        pref_label: {
          en: 'Accelerator laboratory of the university of Jyväskylä',
          fi: 'Jyväskylän yliopiston fysiikan laitoksen Kiihdytinlaboratorio',
          und: 'Jyväskylän yliopiston fysiikan laitoksen Kiihdytinlaboratorio',
        },
      },
    ],
    field_of_science: [
      {
        in_scheme: [
          {
            identifier: 'http://uri.of.that.concept/scheme',
            pref_label: { en: 'The preferred lexical label for a resource' },
          },
        ],
        definition: [{ en: 'A statement or formal explanation of the meaning of a concept.' }],
        identifier: 'http://www.yso.fi/onto/okm-tieteenala/ta414',
        pref_label: {
          en: 'Agricultural biotechnology',
          fi: 'Maatalouden bioteknologia',
          sv: 'Jordbruksbioteknologi',
          und: 'Maatalouden bioteknologia',
        },
      },
    ],
    other_identifier: [
      {
        type: {
          in_scheme: [
            {
              identifier: 'http://uri.of.some.concept/scheme',
              pref_label: { en: 'The preferred lexical label for a resource' },
            },
          ],
          definition: [{ en: 'A statement or formal explanation of the meaning of a concept.' }],
          identifier: 'http://purl.org/att/es/reference_data/identifier_type/identifier_type_doi',
          pref_label: {
            en: 'Digital Object Identifier (DOI)',
            und: 'Digital Object Identifier (DOI)',
          },
        },
        notation: 'doi:10.12345',
        provider: {
          name: { und: 'Helsingin yliopisto' },
          '@type': 'Organization',
          email: 'info@csc.fi',
          telephone: ['+358501231235'],
          identifier: 'http://purl.org/att/es/organization_data/organization/organization_01901',
        },
        local_identifier_type:
          'Local identifier type defines use of the identifier in given context',
      },
      {
        type: {
          in_scheme: [
            {
              identifier: 'http://uri.of.other.concept/scheme',
              pref_label: { en: 'The preferred lexical label for a resource' },
            },
          ],
          definition: [{ en: 'A statement or formal explanation of the meaning of a concept.' }],
          identifier: 'http://purl.org/att/es/reference_data/identifier_type/identifier_type_urn',
          pref_label: { en: 'Uniform Resource Name (URN)', und: 'Uniform Resource Name (URN)' },
        },
        notation: 'urn:nbn:fi-12345',
        provider: {
          name: { und: 'Helsingin yliopisto' },
          '@type': 'Organization',
          email: 'info@csc.fi',
          telephone: ['+358501231235'],
          identifier: 'http://purl.org/att/es/organization_data/organization/organization_01901',
        },
        local_identifier_type:
          'Local identifier type defines use of the identifier in given context',
      },
    ],
    total_ida_byte_size: 621100,
    preferred_identifier: 'urn:nbn:fi:att:1955e904-e3dd-4d7e-99f1-3fed446f9613',
    bibliographic_citation: 'whot',
    metadata_version_identifier: '1955e904-e3dd-4d7e-99f1-3fed446f9613',
  },
  preservation_state: 0,
  editor: {
    owner_id: '05593961536b76fa825281ccaedd4d4f',
    creator_id: '053bffbcc41edad4853bea91fc42ea18',
  },
  removed: false,
  date_modified: '2018-04-26T11:28:20+03:00',
  date_created: '2017-05-23T13:07:22+03:00',
  service_modified: 'metax',
  service_created: 'metax',
}

export const MetaxRemote = {
  id: 26,
  identifier: 'cr955e904-e3dd-4d7e-99f1-3fed446f9626',
  data_catalog: {
    id: 5,
    identifier: 'urn:nbn:fi:att:2955e904-e3dd-4d7e-99f1-3fed446f96d5',
  },
  deprecated: false,
  research_dataset: {
    theme: [],
    title: {},
    value: [],
    issued: '2014-01-17T08:19:58Z',
    creator: [],
    curator: [],
    keyword: [],
    spatial: [],
    language: [],
    modified: '2014-01-17T08:19:58Z',
    relation: [],
    temporal: [],
    publisher: {},
    provenance: [],
    contributor: [],
    description: [],
    is_output_of: [],
    version_info: '0.1.2',
    access_rights: {},
    rights_holder: {},
    version_notes: [],
    infrastructure: [],
    field_of_science: [],
    other_identifier: [],
    remote_resources: [
      {
        title: 'A name given to the distribution',
        license: [
          {
            title: {
              en: 'Apache Software License 2.0',
              und: 'Apache Software License 2.0',
            },
            license: 'https://url.of.license.which.applies.org',
            identifier: 'http://www.opensource.org/licenses/Apache-2.0',
            description: [
              {
                en: 'Free account of the rights',
              },
            ],
          },
        ],
        checksum: {
          algorithm:
            'http://purl.org/att/es/reference_data/checksum_algorithm/checksum_algorithm_SHA-512',
          checksum_value: 'u5y6f4y68765ngf6ry8n',
        },
        modified: '2013-01-17T08:19:58Z',
        byte_size: 2048,
        file_type: {
          in_scheme: [
            {
              identifier: 'http://uri.of.resource.concept/scheme',
              pref_label: {
                en: 'The preferred lexical label for a resource',
              },
            },
          ],
          definition: [
            {
              en: 'A statement or formal explanation of the meaning of a concept.',
            },
          ],
          identifier: 'http://purl.org/att/es/reference_data/file_type/file_type_image',
          pref_label: {
            en: 'Image',
            fi: 'Kuva',
            und: 'Kuva',
          },
        },
        mediatype: 'image/jpeg',
        identifier: 'identifierofresource',
        description: 'Free-text account of the distribution.',
        download_url: {
          title: {
            en: 'A name given to the document, which would be an actual downloadable file',
          },
          identifier: 'https://download.url.of.resource.com',
          description: {
            en: 'Description of the link. For example to be used as hover text.',
          },
        },
        use_category: {
          identifier: 'http://purl.org/att/es/reference_data/use_category/use_category_rights',
          pref_label: {
            en: 'Rights statement',
            fi: 'Oikeuksien kuvaus',
            und: 'Oikeuksien kuvaus',
          },
        },
        has_object_characteristics: {
          title: 'File type name',
          encoding: 'utf-8',
          description: 'Description of file type',
          has_creating_application_name: 'Creating application name',
        },
      },
      {
        title: 'A name given to the second distribution',
        license: [
          {
            title: {
              en: 'Apache Software License 2.0',
              und: 'Apache Software License 2.0',
            },
            license: 'https://url.of.license.which.applies.org',
            identifier: 'http://www.opensource.org/licenses/Apache-2.0',
            description: [
              {
                en: 'Free account of the rights',
              },
            ],
          },
        ],
        checksum: {
          algorithm:
            'http://purl.org/att/es/reference_data/checksum_algorithm/checksum_algorithm_SHA-512',
          checksum_value: 'u5y6f4y68765ngf6ry8n',
        },
        modified: '2013-01-17T08:19:58Z',
        byte_size: 4096,
        mediatype: 'image/gif',
        access_url: {
          title: {
            en: 'A name given to the document, which may be e.g. a landing page',
          },
          identifier: 'https://url.of.resource.com/landing',
          description: {
            en: 'Description of the link. For example to be used as hover text.',
          },
        },
        identifier: 'identifierofresource_2',
        description: 'Free-text account of the second distribution.',
        use_category: {
          identifier:
            'http://purl.org/att/es/reference_data/use_category/use_category_documentation',
          pref_label: {
            en: 'Documentation',
            fi: 'Dokumentaatio',
            und: 'Dokumentaatio',
          },
        },
        resource_type: {
          in_scheme: [
            {
              identifier: 'http://uri.of.resource.concept/scheme',
              pref_label: {
                en: 'The preferred lexical label for a resource',
              },
            },
          ],
          definition: [
            {
              en: 'A statement or formal explanation of the meaning of a concept.',
            },
          ],
          identifier: 'http://purl.org/att/es/reference_data/resource_type/resource_type_api',
          pref_label: {
            en: 'Application interface',
            fi: 'Rajapinta',
            und: 'Rajapinta',
          },
        },
      },
    ],
    preferred_identifier: 'urn:nbn:fi:att:1955e904-e3dd-4d7e-99f1-3fed446f9626',
    bibliographic_citation: 'whot',
    metadata_version_identifier: '1955e904-e3dd-4d7e-99f1-3fed446f9626',
    total_remote_resources_byte_size: 6144,
  },
  preservation_state: 0,
  editor: {
    owner_id: '05593961536b76fa825281ccaedd4d4f',
    creator_id: '053bffbcc41edad4853bea91fc42ea18',
  },
  removed: false,
  date_modified: '2018-05-07T11:50:10+03:00',
  date_created: '2017-05-23T13:07:22+03:00',
  service_modified: 'metax',
  service_created: 'metax',
}
