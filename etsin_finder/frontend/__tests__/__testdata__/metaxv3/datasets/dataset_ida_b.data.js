import { access_rights_open_a } from '../refs/access_rights.data'
import { organization_kone } from '../refs/organizations.data'
import { language_fi } from '../refs/languages.data'
import { data_catalog_ida } from '../refs/data_catalogs.data'

const dataset_open_b = {
  access_rights: access_rights_open_a,
  actors: [
    {
      id: '2356c755-c2cb-4cdc-9db1-380b7d025fd8',
      roles: ['creator', 'curator'],
      organization: organization_kone,
      person: null,
    },
  ],
  data_catalog: data_catalog_ida.id,
  description: {
    fi: 'Tämä aineisto on vajaa. Osa aineiston käännöksistä puuttuu',
  },
  field_of_science: [],
  issued: '2023-06-28',
  keyword: ['test'],
  language: [language_fi],
  metadata_owner: { id: 3, user: { username: 'fd_user5' }, organization: 'csc.fi' },
  persistent_identifier: 'doi:10.23729/ee123456-e455-4849-9d70-7e3a52b307f5',
  theme: [],
  title: { en: 'Some Fields Test Dataset' },
  provenance: [],
  relation: [],
  spatial: [],
  other_identifiers: [],
  temporal: [],
  remote_resources: [],
  created: '2023-06-28T10:16:22+03:00',
  cumulation_started: '2023-06-28T10:16:22+03:00',
  first: null,
  id: '4eb12345-b2a7-4e45-8c63-099b0e7ab4b0',
  is_deprecated: false,
  is_removed: false,
  last: null,
  modified: '2023-08-11T15:46:00.140339+03:00',
  previous: null,
  removal_date: null,
  replaces: null,
}

export const dataset_open_b_catalog_expanded = {
  ...dataset_open_b,
  data_catalog: data_catalog_ida,
}

export default dataset_open_b
