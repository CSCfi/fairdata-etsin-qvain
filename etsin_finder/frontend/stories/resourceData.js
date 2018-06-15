/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

// Dummy data for data tab

const idaDataTree = [
  {
    name: 'file_name_6',
    path: 'project_x_FROZEN/Experiment_X/Phase_1/file_name_6',
    type: 'Video',
    details: {
      id: 6,
      byte_size: 600,
      checksum: { algorithm: 'sha2', checked: '2017-06-23T17:41:59+03:00', value: 'habeebit' },
      parent_directory: { id: 4, identifier: 'pid:urn:dir:4' },
      file_frozen: '2017-05-21T17:41:59+03:00',
      file_format: 'html/text',
      file_modified: '2017-06-23T17:41:59+03:00',
      file_name: 'file_name_6',
      file_path: '/project_x_FROZEN/Experiment_X/Phase_1/file_name_6',
      file_storage: { id: 1, identifier: 'pid:urn:storageidentifier1' },
      file_uploaded: '2017-05-21T17:41:59+03:00',
      identifier: 'pid:urn:6',
      file_characteristics: {
        title: 'A title 120',
        encoding: 'utf-8',
        description: 'A nice description 120',
        file_created: '2014-01-17T08:19:31Z',
        application_name: 'Application Name',
        metadata_modified: '2014-01-17T08:19:31Z',
      },
      open_access: false,
      project_identifier: 'project_x',
      replication_path: '/path/to/copy/of/file',
      date_modified: '2017-06-27T13:07:22+03:00',
      date_created: '2017-05-23T13:07:22+03:00',
      service_created: 'metax',
    },
    description: 'file description 6',
    use_category: {
      identifier: 'http://purl.org/att/es/reference_data/use_category/use_category_configuration',
      pref_label: {
        en: 'Configuration files',
        fi: 'Konfiguraatiotiedosto',
        und: 'Konfiguraatiotiedosto',
      },
    },
    title: 'file title 6',
    identifier: 'pid:urn:6',
  },
  {
    name: 'file_name_10',
    path: 'project_x_FROZEN/Experiment_X/Phase_1/file_name_10',
    type: 'Software',
    details: {
      id: 10,
      byte_size: 1000,
      checksum: { algorithm: 'sha2', checked: '2017-06-23T17:41:59+03:00', value: 'habeebit' },
      parent_directory: { id: 4, identifier: 'pid:urn:dir:4' },
      file_frozen: '2017-05-21T17:41:59+03:00',
      file_format: 'html/text',
      file_modified: '2017-06-23T17:41:59+03:00',
      file_name: 'file_name_10',
      file_path: '/project_x_FROZEN/Experiment_X/Phase_1/file_name_10',
      file_storage: { id: 1, identifier: 'pid:urn:storageidentifier1' },
      file_uploaded: '2017-05-21T17:41:59+03:00',
      identifier: 'pid:urn:10',
      file_characteristics: {
        title: 'A title 120',
        encoding: 'utf-8',
        description: 'A nice description 120',
        file_created: '2014-01-17T08:19:31Z',
        application_name: 'Application Name',
        metadata_modified: '2014-01-17T08:19:31Z',
      },
      open_access: false,
      project_identifier: 'project_x',
      replication_path: '/path/to/copy/of/file',
      date_modified: '2017-06-27T13:07:22+03:00',
      date_created: '2017-05-23T13:07:22+03:00',
      service_created: 'metax',
    },
    description: 'file description 10',
    use_category: {
      identifier: 'http://purl.org/att/es/reference_data/use_category/use_category_publication',
      pref_label: { en: 'Publication', fi: 'Julkaisu', und: 'Julkaisu' },
    },
    title: 'file title 10',
    identifier: 'pid:urn:10',
  },
  {
    name: 'phase_1',
    path: 'prj_112_root/science_data_C/phase_1',
    type: 'dir',
    details: {
      id: 18,
      byte_size: 182000,
      directory_modified: '2018-05-02T12:25:44.679319+03:00',
      directory_name: 'phase_1',
      directory_path: '/prj_112_root/science_data_C/phase_1',
      file_count: 35,
      identifier: 'pid:urn:dir:18',
      parent_directory: { id: 17, identifier: 'pid:urn:dir:17' },
      project_identifier: 'research_project_112',
      date_modified: '2017-06-27T13:07:22+03:00',
      date_created: '2017-05-23T13:07:22+03:00',
      service_created: 'metax',
    },
    description: 'Description of the directory',
    use_category: {
      identifier: 'http://purl.org/att/es/reference_data/use_category/use_category_outcome',
      pref_label: { en: 'Outcome material', fi: 'Tulosaineisto', und: 'Tulosaineisto' },
    },
    title: 'Phase 1 of science data C',
    identifier: 'pid:urn:dir:18',
  },
  {
    name: 'phase_2',
    path: 'prj_112_root/science_data_C/phase_2',
    type: 'dir',
    details: {
      id: 22,
      byte_size: 425500,
      directory_modified: '2018-05-02T12:25:44.656979+03:00',
      directory_name: 'phase_2',
      directory_path: '/prj_112_root/science_data_C/phase_2',
      file_count: 46,
      identifier: 'pid:urn:dir:22',
      parent_directory: { id: 17, identifier: 'pid:urn:dir:17' },
      project_identifier: 'research_project_112',
      date_modified: '2017-06-27T13:07:22+03:00',
      date_created: '2017-05-23T13:07:22+03:00',
      service_created: 'metax',
    },
    description: 'Description of the directory',
    use_category: {
      identifier: 'http://purl.org/att/es/reference_data/use_category/use_category_outcome',
      pref_label: { en: 'Outcome material', fi: 'Tulosaineisto', und: 'Tulosaineisto' },
    },
    title: 'Phase 2 of science data C',
    identifier: 'pid:urn:dir:22',
  },
  {
    name: '01',
    path: 'prj_112_root/science_data_A/phase_1/2018/01',
    type: 'dir',
    details: {
      id: 12,
      byte_size: 6900,
      directory_modified: '2018-05-02T12:25:44.721137+03:00',
      directory_name: '01',
      directory_path: '/prj_112_root/science_data_A/phase_1/2018/01',
      file_count: 3,
      identifier: 'pid:urn:dir:12',
      parent_directory: { id: 11, identifier: 'pid:urn:dir:11' },
      project_identifier: 'research_project_112',
      date_modified: '2017-06-27T13:07:22+03:00',
      date_created: '2017-05-23T13:07:22+03:00',
      service_created: 'metax',
    },
    description: 'Description of the directory',
    use_category: {
      identifier: 'http://purl.org/att/es/reference_data/use_category/use_category_outcome',
      pref_label: { en: 'Outcome material', fi: 'Tulosaineisto', und: 'Tulosaineisto' },
    },
    title: 'Phase 1 01/2018 of Science data A',
    identifier: 'pid:urn:dir:12',
  },
  {
    name: 'science_data_B',
    path: 'prj_112_root/science_data_B',
    type: 'dir',
    details: {
      id: 13,
      byte_size: 2500,
      directory_modified: '2018-05-02T12:25:44.706152+03:00',
      directory_name: 'science_data_B',
      directory_path: '/prj_112_root/science_data_B',
      file_count: 1,
      identifier: 'pid:urn:dir:13',
      parent_directory: { id: 8, identifier: 'pid:urn:dir:8' },
      project_identifier: 'research_project_112',
      date_modified: '2017-06-27T13:07:22+03:00',
      date_created: '2017-05-23T13:07:22+03:00',
      service_created: 'metax',
    },
    description: 'Description of the directory',
    use_category: {
      identifier: 'http://purl.org/att/es/reference_data/use_category/use_category_source',
      pref_label: { en: 'Source material', fi: 'Lähdeaineisto', und: 'Lähdeaineisto' },
    },
    title: 'Science data B',
    identifier: 'pid:urn:dir:13',
  },
  {
    name: 'other',
    path: 'prj_112_root/other',
    type: 'dir',
    details: {
      id: 14,
      byte_size: 2600,
      directory_modified: '2018-05-02T12:25:44.700228+03:00',
      directory_name: 'other',
      directory_path: '/prj_112_root/other',
      file_count: 1,
      identifier: 'pid:urn:dir:14',
      parent_directory: { id: 8, identifier: 'pid:urn:dir:8' },
      project_identifier: 'research_project_112',
      date_modified: '2017-06-27T13:07:22+03:00',
      date_created: '2017-05-23T13:07:22+03:00',
      service_created: 'metax',
    },
    description: 'Description of the directory',
    use_category: {
      identifier: 'http://purl.org/att/es/reference_data/use_category/use_category_method',
      pref_label: { en: 'Method', fi: 'Metodi', und: 'Metodi' },
    },
    title: 'Other stuff',
    identifier: 'pid:urn:dir:14',
  },
]

export const remoteObj = {
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
}

export default idaDataTree
