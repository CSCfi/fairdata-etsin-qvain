import { access_rights_open_a } from '../refs/access_rights.data'
import {
  organization_kone,
  custom_organization_a,
  custom_suborganization_a,
} from '../refs/organizations.data'
import { field_of_science_cis } from '../refs/fields_of_science.data'
import { language_fi, language_en } from '../refs/languages.data'
import { theme_a, theme_b } from '../refs/themes.data'
import { provenance_a } from '../refs/provenances.data'
import { spatial_b, spatial_c } from '../refs/spatials.data'
import { other_identifier_a, relation_a } from '../refs/relations.data'
import { remote_resource_a } from '../refs/remote_resources.data'
import { data_catalog_ida } from '../refs/data_catalogs.data'

const dataset_open_a = {
  access_rights: access_rights_open_a,
  actors: [
    {
      id: '2356c755-c2cb-4cdc-9db1-380b7d025fd8',
      roles: ['creator', 'curator'],
      organization: organization_kone,
      person: null,
    },
    {
      id: 'd08d3810-34e0-4c91-a901-7751758d7c5b',
      roles: ['creator'],
      person: {
        name: 'Kuvitteellinen Henkilö',
        email: 'kuvi@example.com',
        external_identifier: 'http://example.com/kuvi',
      },
      organization: custom_organization_a,
    },
    {
      id: '30dc590c-21ca-4e06-bf88-ecccf20082cc',
      roles: ['publisher'],
      organization: custom_suborganization_a,
      person: null,
    },
  ],
  data_catalog: data_catalog_ida.id,
  description: {
    en: 'This dataset is used for testing all fields in the Etsin dataset page. Description, Data, Identifiers and Events, and Maps -tabs are included in this test as well. Another version was made to test the version picker as well.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    fi: 'Tällä aineistolla testataan kaikkia Etsimen aineistosivulta löytyviä kenttiä. Aineisto, Data, Tunnisteet ja Tapahtumat, sekä Kartat -välilehdet kuuluvat myös tähän testiin. Uusi versio tehtiin, jotta version valinta -painiketta voidaan testata.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  field_of_science: [field_of_science_cis],
  first: null,
  id: '4eb1c1ac-b2a7-4e45-8c63-099b0e7ab4b0',
  is_deprecated: false,
  is_removed: false,
  issued: '2023-06-28',
  keyword: [
    'test',
    'software development',
    'web-development',
    'testi',
    'ohjelmistokehitys',
    'web-kehitys',
  ],
  language: [language_fi, language_en],
  last: null,
  metadata_owner: { id: 3, user: { username: 'fd_user5' }, organization: 'csc.fi' },
  modified: '2023-08-11T14:46:00.140339+03:00',
  other_identifiers: [other_identifier_a],
  persistent_identifier: 'doi:10.23729/ee43f42b-e455-4849-9d70-7e3a52b307f5',
  previous: null,
  projects: [
    {
      title: {
        fi: 'Projekti',
        en: 'Project',
      },
      project_identifier: 'abcd_1234',
      participating_organizations: [organization_kone],
      funding: [
        {
          funding_identifier: 'https://abcd-1234',
          funder: {
            organization: organization_kone,
            funder_type: {
              url: 'http://uri.suomi.fi/codelist/fairdata/funder_type/code/tekes-shok',
            },
          },
        },
      ],
    },
  ],
  provenance: [provenance_a],
  relation: [relation_a],
  remote_resources: [remote_resource_a],
  removal_date: null,
  replaces: null,
  spatial: [spatial_b, spatial_c],
  state: 'draft',
  temporal: [
    {
      start_date: '2023-09-20',
      end_date: '2023-11-25',
    },
  ],
  theme: [theme_a, theme_b],
  title: { en: 'All Fields Test Dataset', fi: 'Kaikkien kenttien testiaineisto testi' },
  remote_resources: [remote_resource_a],
  created: '2023-06-28T10:16:22+03:00',
  cumulative_state: 1,
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

export const dataset_open_a_catalog_expanded = {
  ...dataset_open_a,
  data_catalog: data_catalog_ida,
}

export default dataset_open_a
