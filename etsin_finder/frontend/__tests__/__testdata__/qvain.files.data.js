// Mock responses for a dataset that contains files from the following directory structure.
//
// File/dir attribute:
//   * explicitly selected
//   + in dataset because a parent was selected
//   . in dataset because a child was selected
//   - not in dataset
//
// Project 'project':
// data .
//   set1 *
//     file1.csv +
//     file2.csv +
//     file4.csv -
//     subset +
//       file1.csv *
//       file10.csv +
//       file11.csv +
//       file12.csv +
//       file13.csv -
//     subset2 -
//       file1.csv -
//       file2.csv -
//   set2 .
//     file1.csv *
//     file2.csv -
//     file3.csv -
// moredata .
//   info.csv *
//   stuff.csv *
// tpasfile.csv - (file created by tpas, should not be shown in file picker)

import { getReferenceData } from './referenceData.data'

// /datasets/edit/[identifier]
export const dataset = {
  id: 496,
  identifier: '6d2cb5f5-4867-47f7-9874-09357f2901a3',
  data_catalog: {
    id: 9,
    identifier: 'urn:nbn:fi:att:data-catalog-ida',
  },
  dataset_version_set: [
    {
      identifier: '6d2cb5f5-4867-47f7-9874-09357f2901a3',
      preferred_identifier: 'urn:nbn:fi:att:01ea6b60-b3b9-4ad1-9660-f5fdd68e656d',
      removed: false,
      date_created: '2020-03-03T11:58:16+02:00',
    },
    {
      identifier: '387c0807-f181-4f0b-b4f1-59004bce7fd6',
      preferred_identifier: 'urn:nbn:fi:att:94837825-21a5-41d9-9e49-48fadc85743f',
      removed: false,
      date_created: '2020-03-03T11:53:22+02:00',
    },
    {
      identifier: 'c05a9c97-2b69-4d88-ab30-791c7b365162',
      preferred_identifier: 'urn:nbn:fi:att:f557c60d-9fad-4d38-8a50-86ec3b10d8ad',
      removed: false,
      date_created: '2020-03-03T10:52:00+02:00',
    },
  ],
  deprecated: false,
  metadata_owner_org: 'ylipoisto.fi',
  metadata_provider_org: 'ylipoisto.fi',
  metadata_provider_user: 'TESTUSER',
  research_dataset: {
    files: [
      {
        title: 'info.csv',
        identifier: '8d66b5bc-5d32-11ea-b9f7-94e6f76907f8',
        description: 'File',
        use_category: {
          in_scheme: 'http://uri.suomi.fi/codelist/fairdata/use_category',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/outcome',
          pref_label: {
            en: 'Outcome material',
            fi: 'Tulosaineisto',
            und: 'Tulosaineisto',
          },
        },
        details: {
          parent_directory: {
            identifier: '7ceb3498251f3dfdbe1bde7aa964142b',
            id: 34,
          },
          file_modified: '2017-09-27T15:38:18.700000+03:00',
          service_created: 'ida',
          user_created: 'string',
          file_name: 'info.csv',
          date_created: '2020-03-03T11:37:09+02:00',
          checksum: {
            value: 'string',
            algorithm: 'md5',
            checked: '2017-09-27T12:38:18.701000Z',
          },
          byte_size: 1024,
          open_access: true,
          file_uploaded: '2017-09-27T15:38:18.700000+03:00',
          file_path: '/moredata/info.csv',
          identifier: '8d66b5bc-5d32-11ea-b9f7-94e6f76907f8',
          project_identifier: 'project',
          file_frozen: '2017-09-27T15:38:18.700000+03:00',
          file_storage: {
            identifier: 'pid:urn:storageidentifier1',
            id: 1,
          },
          file_format: 'string',
          id: 151,
          removed: false,
        },
      },
      {
        title: 'stuff.csv',
        identifier: '8b8ae8bc-5d32-11ea-b9f7-94e6f76907f8',
        description: 'File',
        use_category: {
          in_scheme: 'http://uri.suomi.fi/codelist/fairdata/use_category',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/outcome',
          pref_label: {
            en: 'Outcome material',
            fi: 'Tulosaineisto',
            und: 'Tulosaineisto',
          },
        },
        details: {
          parent_directory: {
            identifier: '7ceb3498251f3dfdbe1bde7aa964142b',
            id: 34,
          },
          file_modified: '2017-09-27T15:38:18.700000+03:00',
          service_created: 'ida',
          user_created: 'string',
          file_name: 'stuff.csv',
          date_created: '2020-03-03T11:37:05+02:00',
          checksum: {
            value: 'string',
            algorithm: 'md5',
            checked: '2017-09-27T12:38:18.701000Z',
          },
          byte_size: 1024,
          open_access: true,
          file_uploaded: '2017-09-27T15:38:18.700000+03:00',
          file_path: '/moredata/stuff.csv',
          identifier: '8b8ae8bc-5d32-11ea-b9f7-94e6f76907f8',
          project_identifier: 'project',
          file_frozen: '2017-09-27T15:38:18.700000+03:00',
          file_storage: {
            identifier: 'pid:urn:storageidentifier1',
            id: 1,
          },
          file_format: 'string',
          id: 150,
          removed: false,
        },
      },
      {
        title: 'file1.csv',
        identifier: '94044e70-5d32-11ea-b9f7-94e6f76907f8',
        description: 'File',
        use_category: {
          in_scheme: 'http://uri.suomi.fi/codelist/fairdata/use_category',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/outcome',
          pref_label: {
            en: 'Outcome material',
            fi: 'Tulosaineisto',
            und: 'Tulosaineisto',
          },
        },
        details: {
          parent_directory: {
            identifier: '84189dbab05c39d09e01fb4aff0aee73',
            id: 35,
          },
          file_modified: '2017-09-27T15:38:18.700000+03:00',
          service_created: 'ida',
          user_created: 'string',
          file_name: 'file1.csv',
          date_created: '2020-03-03T11:37:20+02:00',
          checksum: {
            value: 'string',
            algorithm: 'md5',
            checked: '2017-09-27T12:38:18.701000Z',
          },
          byte_size: 1024,
          open_access: true,
          file_uploaded: '2017-09-27T15:38:18.700000+03:00',
          file_path: '/data/set2/file1.csv',
          identifier: '94044e70-5d32-11ea-b9f7-94e6f76907f8',
          project_identifier: 'project',
          file_frozen: '2017-09-27T15:38:18.700000+03:00',
          file_storage: {
            identifier: 'pid:urn:storageidentifier1',
            id: 1,
          },
          file_format: 'string',
          id: 153,
          removed: false,
        },
      },
      {
        title: 'changed_title',
        file_type: {
          in_scheme: 'http://uri.suomi.fi/codelist/fairdata/file_type',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/file_type/code/text',
          pref_label: {
            en: 'Text',
            fi: 'Teksti',
            und: 'Teksti',
          },
        },
        identifier: 'c8535f22-5d32-11ea-b9f7-94e6f76907f8',
        description: 'Explicitly added file',
        use_category: {
          in_scheme: 'http://uri.suomi.fi/codelist/fairdata/use_category',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
          pref_label: {
            en: 'Documentation',
            fi: 'Dokumentaatio',
            und: 'Dokumentaatio',
          },
        },
        details: {
          parent_directory: {
            identifier: '70fcb44802113cdcbca69d01966ce9b9',
            id: 36,
          },
          file_modified: '2017-09-27T15:38:18.700000+03:00',
          service_created: 'ida',
          user_created: 'string',
          file_name: 'file1.csv',
          date_created: '2020-03-03T11:38:47+02:00',
          checksum: {
            value: 'string',
            algorithm: 'md5',
            checked: '2017-09-27T12:38:18.701000Z',
          },
          byte_size: 1024,
          open_access: true,
          file_uploaded: '2017-09-27T15:38:18.700000+03:00',
          file_path: '/data/set1/subset/file1.csv',
          identifier: 'c8535f22-5d32-11ea-b9f7-94e6f76907f8',
          project_identifier: 'project',
          file_frozen: '2017-09-27T15:38:18.700000+03:00',
          file_storage: {
            identifier: 'pid:urn:storageidentifier1',
            id: 1,
          },
          file_format: 'string',
          id: 159,
          removed: false,
        },
      },
    ],
    title: {
      fi: 'Title',
    },
    creator: [
      {
        name: {
          en: 'Org',
          fi: 'Org',
          und: 'Org',
        },
        '@type': 'Organization',
        identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/123456789',
      },
    ],
    keyword: ['keyword'],
    description: {
      fi: 'Description',
    },
    directories: [
      {
        title: 'set1',
        identifier: '11f69846228a375baf7ef919c04629c6',
        description: 'Folder',
        use_category: {
          in_scheme: 'http://uri.suomi.fi/codelist/fairdata/use_category',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/outcome',
          pref_label: {
            en: 'Outcome material',
            fi: 'Tulosaineisto',
            und: 'Tulosaineisto',
          },
        },
        details: {
          byte_size: 6144,
          project_identifier: 'project',
          id: 33,
          directory_name: 'set1',
          parent_directory: {
            identifier: 'e55c0a9e5e0436b58179782725832719',
            id: 32,
          },
          service_created: 'ida',
          date_created: '2020-03-03T11:36:40+02:00',
          removed: false,
          directory_path: '/data/set1',
          file_count: 6,
          directory_modified: '2020-03-03T11:36:40.315713+02:00',
          identifier: '11f69846228a375baf7ef919c04629c6',
        },
      },
    ],
    access_rights: {
      license: [
        {
          title: {
            en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
          },
          license: 'https://creativecommons.org/licenses/by/4.0/',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
        },
      ],
      access_type: {
        in_scheme: 'http://uri.suomi.fi/codelist/fairdata/access_type',
        identifier: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
        pref_label: {
          en: 'Open',
          fi: 'Avoin',
          und: 'Avoin',
        },
      },
    },
    preferred_identifier: 'urn:nbn:fi:att:01ea6b60-b3b9-4ad1-9660-f5fdd68e656d',
    total_files_byte_size: 9216,
    metadata_version_identifier: '615de971-99b1-4801-a45d-d7f03ec06f18',
  },
  preservation_state: 0,
  previous_dataset_version: {
    id: 495,
    identifier: '387c0807-f181-4f0b-b4f1-59004bce7fd6',
    preferred_identifier: 'urn:nbn:fi:att:94837825-21a5-41d9-9e49-48fadc85743f',
  },
  cumulative_state: 0,
  date_modified: '2020-03-03T12:47:06+02:00',
  date_created: '2020-03-03T11:58:16+02:00',
  service_modified: 'qvain',
  service_created: 'qvain',
  removed: false,
}

// dataset with no added files or directories
export const emptyDataset = {
  id: 496,
  identifier: '6d2cb5f5-4867-47f7-9874-123456789',
  data_catalog: {
    id: 9,
    identifier: 'urn:nbn:fi:att:data-catalog-ida',
  },
  dataset_version_set: [
    {
      identifier: '6d2cb5f5-4867-47f7-9874-09357f2901a3',
      preferred_identifier: 'urn:nbn:fi:att:01ea6b60-b3b9-4ad1-9660-f5fdd68e656d',
      removed: false,
      date_created: '2020-03-03T11:58:16+02:00',
    },
    {
      identifier: '387c0807-f181-4f0b-b4f1-59004bce7fd6',
      preferred_identifier: 'urn:nbn:fi:att:94837825-21a5-41d9-9e49-48fadc85743f',
      removed: false,
      date_created: '2020-03-03T11:53:22+02:00',
    },
    {
      identifier: 'c05a9c97-2b69-4d88-ab30-791c7b365162',
      preferred_identifier: 'urn:nbn:fi:att:f557c60d-9fad-4d38-8a50-86ec3b10d8ad',
      removed: false,
      date_created: '2020-03-03T10:52:00+02:00',
    },
  ],
  deprecated: false,
  metadata_owner_org: 'ylipoisto.fi',
  metadata_provider_org: 'ylipoisto.fi',
  metadata_provider_user: 'TESTUSER',
  research_dataset: {
    title: {
      fi: 'Title',
    },
    creator: [
      {
        name: {
          en: 'Org',
          fi: 'Org',
          und: 'Org',
        },
        '@type': 'Organization',
        identifier: 'http://uri.suomi.fi/codelist/fairdata/organization/code/123456789',
      },
    ],
    keyword: ['keyword'],
    description: {
      fi: 'Description',
    },
    access_rights: {
      license: [
        {
          title: {
            en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
          },
          license: 'https://creativecommons.org/licenses/by/4.0/',
          identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
        },
      ],
      access_type: {
        in_scheme: 'http://uri.suomi.fi/codelist/fairdata/access_type',
        identifier: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
        pref_label: {
          en: 'Open',
          fi: 'Avoin',
          und: 'Avoin',
        },
      },
    },
    preferred_identifier: 'urn:nbn:fi:att:01ea6b60-b3b9-4ad1-9660-f5fdd68e656d',
    total_files_byte_size: 9216,
    metadata_version_identifier: '615de971-99b1-4801-a45d-d7f03ec06f18',
  },
  preservation_state: 0,
  previous_dataset_version: {
    id: 495,
    identifier: '387c0807-f181-4f0b-b4f1-59004bce7fd6',
    preferred_identifier: 'urn:nbn:fi:att:94837825-21a5-41d9-9e49-48fadc85743f',
  },
  cumulative_state: 0,
  date_modified: '2020-03-03T12:47:06+02:00',
  date_created: '2020-03-03T11:58:16+02:00',
  service_modified: 'qvain',
  service_created: 'qvain',
  removed: false,
}

// /api/files/project/[project_id]
export const project = {
  directories: [
    {
      byte_size: 13312,
      project_identifier: 'project',
      id: 32,
      directory_name: 'data',
      parent_directory: {
        identifier: 'cb74b1b06e79339e93b391ecf71b18ac',
        id: 31,
      },
      service_created: 'ida',
      date_created: '2020-03-03T11:36:40+02:00',
      removed: false,
      directory_path: '/data',
      file_count: 13,
      directory_modified: '2020-03-03T11:36:40.307796+02:00',
      identifier: 'e55c0a9e5e0436b58179782725832719',
    },
    {
      byte_size: 2048,
      project_identifier: 'project',
      id: 34,
      directory_name: 'moredata',
      parent_directory: {
        identifier: 'cb74b1b06e79339e93b391ecf71b18ac',
        id: 31,
      },
      service_created: 'ida',
      date_created: '2020-03-03T11:37:05+02:00',
      removed: false,
      directory_path: '/moredata',
      file_count: 2,
      directory_modified: '2020-03-03T11:37:05.974225+02:00',
      identifier: '7ceb3498251f3dfdbe1bde7aa964142b',
    },
  ],
  files: [
    {
      parent_directory: {
        identifier: 'cb74b1b06e79339e93b391ecf71b18ac',
        id: 31,
      },
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      service_created: 'tpas',
      file_name: 'tpasfile.csv',
      date_created: '2020-03-03T11:37:09+02:00',
      checksum: {
        value: 'string',
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
      },
      byte_size: 1024,
      open_access: true,
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      file_path: '/tpasfile.csv',
      identifier: '1a33a2ab-5d32-11ea-b9f7-94e6f76907f1',
      project_identifier: 'project',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_storage: {
        identifier: 'pid:urn:storageidentifier1',
        id: 1,
      },
      file_format: 'string',
      id: 1151,
      removed: false,
    },
  ],
  identifier: 'cb74b1b06e79339e93b391ecf71b18ac', // contained in the Metax response when include_parent is enabled
  id: 31,
  file_count: 15,
  byte_size: 15360,
}

// /api/datasets/files/directory/[directory_id]
const directories = {}
directories['/'] = {
  directories: [
    {
      byte_size: 13312,
      date_created: '2020-03-03T11:36:40+02:00',
      directory_modified: '2020-03-03T11:36:40.307796+02:00',
      directory_name: 'data',
      directory_path: '/data',
      file_count: 13,
      id: 32,
      identifier: 'e55c0a9e5e0436b58179782725832719',
      parent_directory: {
        id: 31,
        identifier: 'cb74b1b06e79339e93b391ecf71b18ac',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
    },
    {
      byte_size: 2048,
      date_created: '2020-03-03T11:37:05+02:00',
      directory_modified: '2020-03-03T11:37:05.974225+02:00',
      directory_name: 'moredata',
      directory_path: '/moredata',
      file_count: 2,
      id: 34,
      identifier: '7ceb3498251f3dfdbe1bde7aa964142b',
      parent_directory: {
        id: 31,
        identifier: 'cb74b1b06e79339e93b391ecf71b18ac',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
    },
  ],
  files: [
    {
      parent_directory: {
        identifier: 'cb74b1b06e79339e93b391ecf71b18ac',
        id: 31,
      },
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      service_created: 'tpas',
      file_name: 'tpasfile.csv',
      date_created: '2020-03-03T11:37:09+02:00',
      checksum: {
        value: 'string',
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
      },
      byte_size: 1024,
      open_access: true,
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      file_path: '/tpasfile.csv',
      identifier: '1a33a2ab-5d32-11ea-b9f7-94e6f76907f1',
      project_identifier: 'project',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_storage: {
        identifier: 'pid:urn:storageidentifier1',
        id: 1,
      },
      file_format: 'string',
      id: 1151,
      removed: false,
    },
  ],
  id: 31,
  file_count: 15,
  byte_size: 15360,
}

directories['/moredata'] = {
  directories: [],
  files: [
    {
      parent_directory: {
        identifier: '7ceb3498251f3dfdbe1bde7aa964142b',
        id: 34,
      },
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      service_created: 'ida',
      user_created: 'string',
      file_name: 'info.csv',
      date_created: '2020-03-03T11:37:09+02:00',
      checksum: {
        value: 'string',
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
      },
      byte_size: 1024,
      open_access: true,
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      file_path: '/moredata/info.csv',
      identifier: '8d66b5bc-5d32-11ea-b9f7-94e6f76907f8',
      project_identifier: 'project',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_storage: {
        identifier: 'pid:urn:storageidentifier1',
        id: 1,
      },
      file_format: 'string',
      id: 151,
      removed: false,
    },
    {
      parent_directory: {
        identifier: '7ceb3498251f3dfdbe1bde7aa964142b',
        id: 34,
      },
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      service_created: 'ida',
      user_created: 'string',
      file_name: 'stuff.csv',
      date_created: '2020-03-03T11:37:05+02:00',
      checksum: {
        value: 'string',
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
      },
      byte_size: 1024,
      open_access: true,
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      file_path: '/moredata/stuff.csv',
      identifier: '8b8ae8bc-5d32-11ea-b9f7-94e6f76907f8',
      project_identifier: 'project',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_storage: {
        identifier: 'pid:urn:storageidentifier1',
        id: 1,
      },
      file_format: 'string',
      id: 150,
      removed: false,
    },
  ],
}

directories['/data'] = {
  directories: [
    {
      byte_size: 10240,
      date_created: '2020-03-03T11:36:40+02:00',
      directory_modified: '2020-03-03T11:36:40.315713+02:00',
      directory_name: 'set1',
      directory_path: '/data/set1',
      file_count: 10,
      id: 33,
      identifier: '11f69846228a375baf7ef919c04629c6',
      parent_directory: {
        id: 32,
        identifier: 'e55c0a9e5e0436b58179782725832719',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
    },
    {
      byte_size: 3072,
      date_created: '2020-03-03T11:37:20+02:00',
      directory_modified: '2020-03-03T11:37:20.149650+02:00',
      directory_name: 'set2',
      directory_path: '/data/set2',
      file_count: 3,
      id: 35,
      identifier: '84189dbab05c39d09e01fb4aff0aee73',
      parent_directory: {
        id: 32,
        identifier: 'e55c0a9e5e0436b58179782725832719',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
    },
  ],
  files: [],
}

directories['/data/set1'] = {
  directories: [
    {
      byte_size: 5120,
      date_created: '2020-03-03T11:38:40+02:00',
      directory_modified: '2020-03-03T11:38:40.325398+02:00',
      directory_name: 'subset',
      directory_path: '/data/set1/subset',
      file_count: 5,
      id: 36,
      identifier: '70fcb44802113cdcbca69d01966ce9b9',
      parent_directory: {
        id: 33,
        identifier: '11f69846228a375baf7ef919c04629c6',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
    },
    {
      byte_size: 2048,
      date_created: '2020-03-03T11:39:40+02:00',
      directory_modified: '2020-03-03T11:39:40.045727+02:00',
      directory_name: 'subset2',
      directory_path: '/data/set1/subset2',
      file_count: 2,
      id: 37,
      identifier: '1e64e3f6b0023900b748dc65120619d2',
      parent_directory: {
        id: 33,
        identifier: '11f69846228a375baf7ef919c04629c6',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
    },
  ],
  files: [
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:36:40+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file1.csv',
      file_path: '/data/set1/file1.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 149,
      identifier: '7c43cc20-5d32-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 33,
        identifier: '11f69846228a375baf7ef919c04629c6',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:37:17+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file2.csv',
      file_path: '/data/set1/file2.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 152,
      identifier: '9265cba2-5d32-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 33,
        identifier: '11f69846228a375baf7ef919c04629c6',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:39:47+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file4.csv',
      file_path: '/data/set1/file4.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 162,
      identifier: 'ec19bb5e-5d32-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 33,
        identifier: '11f69846228a375baf7ef919c04629c6',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
  ],
}

directories['/data/set2/'] = {
  directories: [],
  files: [
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:37:20+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file1.csv',
      file_path: '/data/set2/file1.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 153,
      identifier: '94044e70-5d32-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 35,
        identifier: '84189dbab05c39d09e01fb4aff0aee73',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:37:21+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file2.csv',
      file_path: '/data/set2/file2.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 154,
      identifier: '94d0ca7c-5d32-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 35,
        identifier: '84189dbab05c39d09e01fb4aff0aee73',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:37:22+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file3.csv',
      file_path: '/data/set2/file3.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 155,
      identifier: '958b2066-5d32-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 35,
        identifier: '84189dbab05c39d09e01fb4aff0aee73',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
  ],
}

directories['/data/set1/subset'] = {
  directories: [],
  files: [
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:38:47+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file1.csv',
      file_path: '/data/set1/subset/file1.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 159,
      identifier: 'c8535f22-5d32-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 36,
        identifier: '70fcb44802113cdcbca69d01966ce9b9',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:38:40+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file10.csv',
      file_path: '/data/set1/subset/file10.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 156,
      identifier: 'c3cdcb5e-5d32-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 36,
        identifier: '70fcb44802113cdcbca69d01966ce9b9',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:38:41+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file11.csv',
      file_path: '/data/set1/subset/file11.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 157,
      identifier: 'c4c332ba-5d32-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 36,
        identifier: '70fcb44802113cdcbca69d01966ce9b9',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:38:43+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file12.csv',
      file_path: '/data/set1/subset/file12.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 158,
      identifier: 'c590c004-5d32-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 36,
        identifier: '70fcb44802113cdcbca69d01966ce9b9',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:53:19+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file13.csv',
      file_path: '/data/set1/subset/file13.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 163,
      identifier: 'cfba1222-5d34-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 36,
        identifier: '70fcb44802113cdcbca69d01966ce9b9',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
  ],
}

directories['/data/set1/subset2'] = {
  directories: [],
  files: [
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:39:40+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file1.csv',
      file_path: '/data/set1/subset2/file1.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 160,
      identifier: 'e7668966-5d32-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 37,
        identifier: '1e64e3f6b0023900b748dc65120619d2',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:39:41+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file2.csv',
      file_path: '/data/set1/subset2/file2.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 161,
      identifier: 'e846a104-5d32-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 37,
        identifier: '1e64e3f6b0023900b748dc65120619d2',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
  ],
}

// /api/files

export const existing = {}
existing['/'] = {
  directories: [
    {
      byte_size: 0,
      project_identifier: 'project',
      id: 32,
      directory_name: 'data',
      parent_directory: {
        identifier: 'cb74b1b06e79339e93b391ecf71b18ac',
        id: 31,
      },
      service_created: 'ida',
      date_created: '2020-03-03T11:36:40+02:00',
      removed: false,
      directory_path: '/data',
      file_count: 7,
      directory_modified: '2020-03-03T11:36:40.307796+02:00',
      identifier: 'e55c0a9e5e0436b58179782725832719',
    },
    {
      byte_size: 0,
      project_identifier: 'project',
      id: 34,
      directory_name: 'moredata',
      parent_directory: {
        identifier: 'cb74b1b06e79339e93b391ecf71b18ac',
        id: 31,
      },
      service_created: 'ida',
      date_created: '2020-03-03T11:37:05+02:00',
      removed: false,
      directory_path: '/moredata',
      file_count: 2,
      directory_modified: '2020-03-03T11:37:05.974225+02:00',
      identifier: '7ceb3498251f3dfdbe1bde7aa964142b',
    },
  ],
  files: [],
  file_count: 9,
  byte_size: 9216,
}

existing['/moredata'] = {
  directories: [],
  files: [
    {
      parent_directory: {
        identifier: '7ceb3498251f3dfdbe1bde7aa964142b',
        id: 34,
      },
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      service_created: 'ida',
      user_created: 'string',
      file_name: 'info.csv',
      date_created: '2020-03-03T11:37:09+02:00',
      checksum: {
        value: 'string',
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
      },
      byte_size: 1024,
      open_access: true,
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      file_path: '/moredata/info.csv',
      identifier: '8d66b5bc-5d32-11ea-b9f7-94e6f76907f8',
      project_identifier: 'project',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_storage: {
        identifier: 'pid:urn:storageidentifier1',
        id: 1,
      },
      file_format: 'string',
      id: 151,
      removed: false,
    },
    {
      parent_directory: {
        identifier: '7ceb3498251f3dfdbe1bde7aa964142b',
        id: 34,
      },
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      service_created: 'ida',
      user_created: 'string',
      file_name: 'stuff.csv',
      date_created: '2020-03-03T11:37:05+02:00',
      checksum: {
        value: 'string',
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
      },
      byte_size: 1024,
      open_access: true,
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      file_path: '/moredata/stuff.csv',
      identifier: '8b8ae8bc-5d32-11ea-b9f7-94e6f76907f8',
      project_identifier: 'project',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_storage: {
        identifier: 'pid:urn:storageidentifier1',
        id: 1,
      },
      file_format: 'string',
      id: 150,
      removed: false,
    },
  ],
}

existing['/data'] = {
  directories: [
    {
      byte_size: 6144,
      project_identifier: 'project',
      id: 33,
      directory_name: 'set1',
      parent_directory: {
        identifier: 'e55c0a9e5e0436b58179782725832719',
        id: 32,
      },
      service_created: 'ida',
      date_created: '2020-03-03T11:36:40+02:00',
      removed: false,
      directory_path: '/data/set1',
      file_count: 6,
      directory_modified: '2020-03-03T11:36:40.315713+02:00',
      identifier: '11f69846228a375baf7ef919c04629c6',
    },
    {
      byte_size: 1024,
      project_identifier: 'project',
      id: 35,
      directory_name: 'set2',
      parent_directory: {
        identifier: 'e55c0a9e5e0436b58179782725832719',
        id: 32,
      },
      service_created: 'ida',
      date_created: '2020-03-03T11:37:20+02:00',
      removed: false,
      directory_path: '/data/set2',
      file_count: 1,
      directory_modified: '2020-03-03T11:37:20.149650+02:00',
      identifier: '84189dbab05c39d09e01fb4aff0aee73',
    },
  ],
  files: [],
}

existing['/data/set1'] = {
  directories: [
    {
      byte_size: 4096,
      project_identifier: 'project',
      id: 36,
      directory_name: 'subset',
      parent_directory: {
        identifier: '11f69846228a375baf7ef919c04629c6',
        id: 33,
      },
      service_created: 'ida',
      date_created: '2020-03-03T11:38:40+02:00',
      removed: false,
      directory_path: '/data/set1/subset',
      file_count: 4,
      directory_modified: '2020-03-03T11:38:40.325398+02:00',
      identifier: '70fcb44802113cdcbca69d01966ce9b9',
    },
  ],
  files: [
    {
      parent_directory: {
        identifier: '11f69846228a375baf7ef919c04629c6',
        id: 33,
      },
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      service_created: 'ida',
      user_created: 'string',
      file_name: 'file1.csv',
      date_created: '2020-03-03T11:36:40+02:00',
      checksum: {
        value: 'string',
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
      },
      byte_size: 1024,
      open_access: true,
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      file_path: '/data/set1/file1.csv',
      identifier: '7c43cc20-5d32-11ea-b9f7-94e6f76907f8',
      project_identifier: 'project',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_storage: {
        identifier: 'pid:urn:storageidentifier1',
        id: 1,
      },
      file_format: 'string',
      id: 149,
      removed: false,
    },
    {
      parent_directory: {
        identifier: '11f69846228a375baf7ef919c04629c6',
        id: 33,
      },
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      service_created: 'ida',
      user_created: 'string',
      file_name: 'file2.csv',
      date_created: '2020-03-03T11:37:17+02:00',
      checksum: {
        value: 'string',
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
      },
      byte_size: 1024,
      open_access: true,
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      file_path: '/data/set1/file2.csv',
      identifier: '9265cba2-5d32-11ea-b9f7-94e6f76907f8',
      project_identifier: 'project',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_storage: {
        identifier: 'pid:urn:storageidentifier1',
        id: 1,
      },
      file_format: 'string',
      id: 152,
      removed: false,
    },
  ],
}

existing['/data/set2/'] = {
  directories: [],
  files: [
    {
      parent_directory: {
        identifier: '84189dbab05c39d09e01fb4aff0aee73',
        id: 35,
      },
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      service_created: 'ida',
      user_created: 'string',
      file_name: 'file1.csv',
      date_created: '2020-03-03T11:37:20+02:00',
      checksum: {
        value: 'string',
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
      },
      byte_size: 1024,
      open_access: true,
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      file_path: '/data/set2/file1.csv',
      identifier: '94044e70-5d32-11ea-b9f7-94e6f76907f8',
      project_identifier: 'project',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_storage: {
        identifier: 'pid:urn:storageidentifier1',
        id: 1,
      },
      file_format: 'string',
      id: 153,
      removed: false,
    },
  ],
}

existing['/data/set1/subset'] = {
  directories: [],
  files: [
    {
      parent_directory: {
        identifier: '70fcb44802113cdcbca69d01966ce9b9',
        id: 36,
      },
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      service_created: 'ida',
      user_created: 'string',
      file_name: 'file1.csv',
      date_created: '2020-03-03T11:38:47+02:00',
      checksum: {
        value: 'string',
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
      },
      byte_size: 1024,
      open_access: true,
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      file_path: '/data/set1/subset/file1.csv',
      identifier: 'c8535f22-5d32-11ea-b9f7-94e6f76907f8',
      project_identifier: 'project',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_storage: {
        identifier: 'pid:urn:storageidentifier1',
        id: 1,
      },
      file_format: 'string',
      id: 159,
      removed: false,
    },
    {
      parent_directory: {
        identifier: '70fcb44802113cdcbca69d01966ce9b9',
        id: 36,
      },
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      service_created: 'ida',
      user_created: 'string',
      file_name: 'file10.csv',
      date_created: '2020-03-03T11:38:40+02:00',
      checksum: {
        value: 'string',
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
      },
      byte_size: 1024,
      open_access: true,
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      file_path: '/data/set1/subset/file10.csv',
      identifier: 'c3cdcb5e-5d32-11ea-b9f7-94e6f76907f8',
      project_identifier: 'project',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_storage: {
        identifier: 'pid:urn:storageidentifier1',
        id: 1,
      },
      file_format: 'string',
      id: 156,
      removed: false,
    },
    {
      parent_directory: {
        identifier: '70fcb44802113cdcbca69d01966ce9b9',
        id: 36,
      },
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      service_created: 'ida',
      user_created: 'string',
      file_name: 'file11.csv',
      date_created: '2020-03-03T11:38:41+02:00',
      checksum: {
        value: 'string',
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
      },
      byte_size: 1024,
      open_access: true,
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      file_path: '/data/set1/subset/file11.csv',
      identifier: 'c4c332ba-5d32-11ea-b9f7-94e6f76907f8',
      project_identifier: 'project',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_storage: {
        identifier: 'pid:urn:storageidentifier1',
        id: 1,
      },
      file_format: 'string',
      id: 157,
      removed: false,
    },
    {
      parent_directory: {
        identifier: '70fcb44802113cdcbca69d01966ce9b9',
        id: 36,
      },
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      service_created: 'ida',
      user_created: 'string',
      file_name: 'file12.csv',
      date_created: '2020-03-03T11:38:43+02:00',
      checksum: {
        value: 'string',
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
      },
      byte_size: 1024,
      open_access: true,
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      file_path: '/data/set1/subset/file12.csv',
      identifier: 'c590c004-5d32-11ea-b9f7-94e6f76907f8',
      project_identifier: 'project',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_storage: {
        identifier: 'pid:urn:storageidentifier1',
        id: 1,
      },
      file_format: 'string',
      id: 158,
      removed: false,
    },
  ],
}

existing['/data/set1/subset2'] = {
  directories: [],
  files: [
    {
      parent_directory: {
        identifier: '84189dbab05c39d09e01fb4aff0aee73',
        id: 35,
      },
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      service_created: 'ida',
      user_created: 'string',
      file_name: 'file1.csv',
      date_created: '2020-03-03T11:37:20+02:00',
      checksum: {
        value: 'string',
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
      },
      byte_size: 1024,
      open_access: true,
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      file_path: '/data/set2/file1.csv',
      identifier: '94044e70-5d32-11ea-b9f7-94e6f76907f8',
      project_identifier: 'project',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_storage: {
        identifier: 'pid:urn:storageidentifier1',
        id: 1,
      },
      file_format: 'string',
      id: 153,
      removed: false,
    },
  ],
}

// /api/datasets/files/directory/[directory_id]
const notExisting = {}
notExisting['/'] = {
  directories: [
    {
      byte_size: 13312,
      date_created: '2020-03-03T11:36:40+02:00',
      directory_modified: '2020-03-03T11:36:40.307796+02:00',
      directory_name: 'data',
      directory_path: '/data',
      file_count: 6,
      id: 32,
      identifier: 'e55c0a9e5e0436b58179782725832719',
      parent_directory: {
        id: 31,
        identifier: 'cb74b1b06e79339e93b391ecf71b18ac',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
    },
  ],
  files: [],
  file_count: 6,
  byte_size: 13312,
}

notExisting['/data'] = {
  directories: [
    {
      byte_size: 3072,
      date_created: '2020-03-03T11:37:20+02:00',
      directory_modified: '2020-03-03T11:37:20.149650+02:00',
      directory_name: 'set2',
      directory_path: '/data/set2',
      file_count: 2,
      id: 35,
      identifier: '84189dbab05c39d09e01fb4aff0aee73',
      parent_directory: {
        id: 32,
        identifier: 'e55c0a9e5e0436b58179782725832719',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
    },
    {
      byte_size: 10240,
      date_created: '2020-03-03T11:36:40+02:00',
      directory_modified: '2020-03-03T11:36:40.315713+02:00',
      directory_name: 'set1',
      directory_path: '/data/set1',
      file_count: 4,
      id: 33,
      identifier: '11f69846228a375baf7ef919c04629c6',
      parent_directory: {
        id: 32,
        identifier: 'e55c0a9e5e0436b58179782725832719',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
    },
  ],
  files: [],
}

notExisting['/data/set1'] = {
  directories: [
    {
      byte_size: 5120,
      date_created: '2020-03-03T11:38:40+02:00',
      directory_modified: '2020-03-03T11:38:40.325398+02:00',
      directory_name: 'subset',
      directory_path: '/data/set1/subset',
      file_count: 1,
      id: 36,
      identifier: '70fcb44802113cdcbca69d01966ce9b9',
      parent_directory: {
        id: 33,
        identifier: '11f69846228a375baf7ef919c04629c6',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
    },
    {
      byte_size: 2048,
      date_created: '2020-03-03T11:39:40+02:00',
      directory_modified: '2020-03-03T11:39:40.045727+02:00',
      directory_name: 'subset2',
      directory_path: '/data/set1/subset2',
      file_count: 2,
      id: 37,
      identifier: '1e64e3f6b0023900b748dc65120619d2',
      parent_directory: {
        id: 33,
        identifier: '11f69846228a375baf7ef919c04629c6',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
    },
  ],
  files: [
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:39:47+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file4.csv',
      file_path: '/data/set1/file4.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 162,
      identifier: 'ec19bb5e-5d32-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 33,
        identifier: '11f69846228a375baf7ef919c04629c6',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
  ],
}

notExisting['/data/set2/'] = {
  directories: [],
  files: [
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:37:21+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file2.csv',
      file_path: '/data/set2/file2.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 154,
      identifier: '94d0ca7c-5d32-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 35,
        identifier: '84189dbab05c39d09e01fb4aff0aee73',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:37:22+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file3.csv',
      file_path: '/data/set2/file3.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 155,
      identifier: '958b2066-5d32-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 35,
        identifier: '84189dbab05c39d09e01fb4aff0aee73',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
  ],
}

notExisting['/data/set1/subset'] = {
  directories: [],
  files: [
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:53:19+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file13.csv',
      file_path: '/data/set1/subset/file13.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 163,
      identifier: 'cfba1222-5d34-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 36,
        identifier: '70fcb44802113cdcbca69d01966ce9b9',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
  ],
}

notExisting['/data/set1/subset2'] = {
  directories: [],
  files: [
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:39:41+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file2.csv',
      file_path: '/data/set1/subset2/file2.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 161,
      identifier: 'e846a104-5d32-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 37,
        identifier: '1e64e3f6b0023900b748dc65120619d2',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
    {
      byte_size: 1024,
      checksum: {
        algorithm: 'md5',
        checked: '2017-09-27T12:38:18.701000Z',
        value: 'string',
      },
      date_created: '2020-03-03T11:39:40+02:00',
      file_format: 'string',
      file_frozen: '2017-09-27T15:38:18.700000+03:00',
      file_modified: '2017-09-27T15:38:18.700000+03:00',
      file_name: 'file1.csv',
      file_path: '/data/set1/subset2/file1.csv',
      file_storage: {
        id: 1,
        identifier: 'pid:urn:storageidentifier1',
      },
      file_uploaded: '2017-09-27T15:38:18.700000+03:00',
      id: 160,
      identifier: 'e7668966-5d32-11ea-b9f7-94e6f76907f8',
      open_access: true,
      parent_directory: {
        id: 37,
        identifier: '1e64e3f6b0023900b748dc65120619d2',
      },
      project_identifier: 'project',
      removed: false,
      service_created: 'ida',
      user_created: 'string',
    },
  ],
}

const byId = dirs =>
  Object.values(dirs).reduce((obj, dir) => {
    let identifier
    if (dir.files.length > 0) {
      identifier = dir.files[0].parent_directory.id
    } else {
      identifier = dir.directories[0].parent_directory.id
    }
    obj[identifier] = dir
    return obj
  }, {})

const byIdentifier = dirs =>
  Object.values(dirs).reduce((obj, dir) => {
    let identifier
    if (dir.files.length > 0) {
      identifier = dir.files[0].parent_directory.identifier
    } else {
      identifier = dir.directories[0].parent_directory.identifier
    }
    obj[identifier] = dir
    return obj
  }, {})

const directoriesById = byId(directories)
const existingById = byId(existing)
const notExistingById = byId(notExisting)
const directoriesByIdentifier = byIdentifier(directories)
const existingByIdentifier = byIdentifier(existing)
const notExistingByIdentifier = byIdentifier(notExisting)

const reEdit = RegExp('^/api/qvain/datasets/(.*)')
const reDatasetProjects = RegExp('^/api/common/datasets/(.*)/projects')
const reUserMetadata = RegExp('^/api/common/datasets/(.*)/user_metadata')
const reProject = RegExp('^/api/common/projects/(.*)/files')
const reDirectories = RegExp('^/api/common/directories/(.*)/files')

const paginate = (data, offset, limit) => {
  let remaining = limit
  let offs = offset
  let directories = []
  let files = []
  while (remaining > 0 && offs < data.directories.length) {
    directories.push(data.directories[offs])
    offs += 1
    remaining -= 1
  }
  offs -= data.directories.length
  while (remaining > 0 && offs < data.files.length) {
    files.push(data.files[offs])
    offs += 1
    remaining -= 1
  }
  return {
    count: data.directories.length + data.files.length,
    results: {
      ...data,
      directories,
      files,
    },
  }
}

const parseIntParam = param => {
  const val = parseInt(param)
  if (isNaN(val)) {
    return undefined
  }
  return val
}

const filter = (data, name) => {
  if (!name) {
    return data
  }

  const newData = {
    ...data,
    directories: data.directories.filter(d => d.directory_name.includes(name)),
    files: data.files.filter(f => f.file_name.includes(name)),
  }
  return newData
}

// mock getter to replace axios.get
export const get = rawURL => {
  const url = new URL(rawURL, 'https://localhost')
  const path = url.pathname
  const searchParams = url.searchParams
  const pagination = searchParams.get('pagination') && searchParams.get('pagination') !== 'false'
  const offset = parseIntParam(searchParams.get('offset'))
  const limit = parseIntParam(searchParams.get('limit'))
  const name = searchParams.get('name') || ''
  const crIdentifier = searchParams.get('cr_identifier')
  const notCRIdentifier = searchParams.get('not_cr_identifier')

  if (path.startsWith('/es/')) {
    return Promise.resolve({ data: getReferenceData(path) })
  }

  const matchDatasetProjects = reDatasetProjects.exec(path)
  if (matchDatasetProjects) {
    const datasetIdentifier = matchDatasetProjects[1]
    if (datasetIdentifier === dataset.identifier) {
      return Promise.resolve({ data: ['project'] })
    }
    if (datasetIdentifier === emptyDataset.identifier) {
      return Promise.resolve({ data: [] })
    }
    throw new Error(`Invalid dataset ${path}`)
  }

  const matchUserMetadata = reUserMetadata.exec(path)
  if (matchUserMetadata) {
    const datasetIdentifier = matchUserMetadata[1]
    const process = v => ({
      directories: v.research_dataset.directories,
      files: v.research_dataset.files,
    })
    if (datasetIdentifier === dataset.identifier) {
      return Promise.resolve({ data: process(dataset) })
    }
    if (datasetIdentifier === emptyDataset.identifier) {
      return Promise.resolve({ data: process(emptyDataset) })
    }
    throw new Error(`Invalid dataset ${path}`)
  }

  const matchEdit = reEdit.exec(path)
  if (matchEdit) {
    const process = v => {
      const ret = { ...v }
      ret.research_dataset = { ...ret.research_dataset }
      delete ret.research_dataset.directories
      delete ret.research_dataset.files
      return ret
    }

    const datasetIdentifier = matchEdit[1]
    if (datasetIdentifier === dataset.identifier) {
      return Promise.resolve({ data: process(dataset) })
    }
    if (datasetIdentifier === emptyDataset.identifier) {
      return Promise.resolve({ data: process(emptyDataset) })
    }
    throw new Error(`Invalid dataset ${path}`)
  }

  const matchProject = reProject.exec(path)
  if (matchProject) {
    const projectIdentifier = matchProject[1]
    if (projectIdentifier !== project.directories[0].project_identifier) {
      throw new Error(`Invalid project ${path}`)
    }
    return Promise.resolve({ data: project })
  }

  const matchDirectories = reDirectories.exec(path)
  if (matchDirectories) {
    const directoryIdentifier = matchDirectories[1]

    const datasetIdentifier = crIdentifier || notCRIdentifier
    if (datasetIdentifier) {
      if (crIdentifier && notCRIdentifier) {
        throw new Error(`Both cr_identifier and not_cr_identifier params supplied`)
      }
      if (
        datasetIdentifier !== dataset.identifier &&
        datasetIdentifier !== emptyDataset.identifier
      ) {
        throw new Error(`Invalid dataset identifier`)
      }
      if (!directoriesById[directoryIdentifier] && !directoriesByIdentifier[directoryIdentifier]) {
        throw new Error(`Invalid directory ${path}`)
      }
      let dir
      if (datasetIdentifier === dataset.identifier) {
        if (crIdentifier) {
          dir = existingById[directoryIdentifier] || existingByIdentifier[directoryIdentifier]
        } else {
          dir = notExistingById[directoryIdentifier] || notExistingByIdentifier[directoryIdentifier]
        }
      } else {
        if (notCRIdentifier) {
          dir = directoriesById[directoryIdentifier] || directoriesByIdentifier[directoryIdentifier]
        }
      }
      dir = dir || { directories: [], files: [] }
      if (pagination) {
        return Promise.resolve({ data: filter(paginate(dir, offset, limit)) })
      }
      return Promise.resolve({ data: filter(dir) })
    } else {
      const dir =
        directoriesById[directoryIdentifier] || directoriesByIdentifier[directoryIdentifier]
      if (!dir) {
        throw new Error(`Invalid directory ${path}`)
      }
      if (pagination) {
        return Promise.resolve({ data: filter(paginate(dir, offset, limit), name) })
      }
      return Promise.resolve({ data: filter(dir, name) })
    }
  }

  throw new Error(`Invalid path ${path}`)
}
