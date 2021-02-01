import axios from 'axios'
import Env from '../../../js/stores/domain/env'
import QvainStoreClass from '../../../js/stores/view/qvain'
import LocaleStore from '../../../js/stores/view/locale'
import { Directory } from '../../../js/stores/view/qvain/qvain.filesv1'

jest.mock('axios')

const testFile = {
  description: 'File',
  title: 'testfile',
  existing: false,
  file_name: 'test.csv',
  file_path: '/test/test.csv',
  identifier: 'test_file',
  project_identifier: 'project_y',
  file_characteristics: {
    file_format: 'text/csv',
    format_version: '',
    encoding: 'UTF-8',
    csv_has_header: true,
    csv_record_separator: 'LF',
    csv_quoting_char: '"',
  },
}

const modifiedTestFile = {
  description: 'File',
  title: 'testfile',
  existing: false,
  file_name: 'test.csv',
  file_path: '/test/test.csv',
  identifier: 'test_file',
  project_identifier: 'project_y',
  file_characteristics: {
    file_format: 'text/csv',
    format_version: 'mock version',
    encoding: 'UTF-8',
    csv_has_header: true,
    csv_record_separator: 'LF',
    csv_quoting_char: '"',
  },
}

const testFile2 = {
  description: 'File2',
  title: 'testfile2',
  existing: false,
  file_name: 'test2.csv',
  file_path: '/test/test2.csv',
  identifier: 'test_file2',
  project_identifier: 'project_y',
  file_characteristics: {
    file_format: 'text/csv',
    format_version: 'format_not_allowed_here',
    encoding: 'UTF-8',
    csv_has_header: true,
    csv_record_separator: 'LF',
    csv_quoting_char: '"',
  },
}

const testFile3 = {
  description: 'File3',
  title: 'testfile3',
  existing: false,
  file_name: 'test3.pdf',
  file_path: '/test/test3.pdf',
  identifier: 'test_file3',
  project_identifier: 'project_y',
  file_characteristics: {
    file_format: 'application/pdf',
    format_version: '1.6',
    encoding: 'UTF-8',
    csv_has_header: false,
    csv_record_separator: 'LF',
    csv_quoting_char: '"',
  },
}

const testFile4 = {
  description: 'File4',
  title: 'testfile4',
  existing: false,
  file_name: 'test4.pdf',
  file_path: '/test/test4.pdf',
  identifier: 'test_file4',
  project_identifier: 'project_y',
  file_characteristics: {
    file_format: 'application/pdf',
    format_version: 'invalid_format_version',
    encoding: 'UTF-8',
    csv_has_header: true,
    csv_record_separator: 'LF',
    csv_quoting_char: '"',
  },
}

const getStores = () => {
  const QvainStore = new QvainStoreClass(Env)
  Env.Flags.setFlag('METAX_API_V2', true)
  QvainStore.resetQvainStore()

  QvainStore.hierarchy = Directory(
    {
      id: 'test',
      identifier: 'test-ident-1',
      project_identifier: 'project_y',
      directory_name: 'root',
      directories: [
        Directory(
          {
            id: 'test2',
            identifier: 'test-ident-2',
            project_identifier: 'project_y',
            directory_name: 'directory2',
            directories: [],
            files: [],
          },
          undefined,
          false,
          false
        ),
      ],
      files: [testFile, testFile2, testFile3, testFile4],
    },
    undefined,
    false,
    true
  )

  return {
    Env,
    Qvain: QvainStore,
    Locale: LocaleStore,
  }
}

const fileFormats = {
  data: {
    hits: {
      hits: [
        {
          _source: {
            input_file_format: 'text/csv',
            output_format_version: '',
            label: {
              und: 'file_format_version_text_csv',
            },
          },
        },
        {
          _source: {
            input_file_format: 'application/pdf',
            output_format_version: '1.6',
          },
        },
      ],
    },
  },
}

describe('metadata Store', () => {
  let stores

  beforeEach(() => {
    stores = getStores()
  })

  test('setMetadataModalFile sets metadataModalFile', () => {
    stores.Qvain.setMetadataModalFile(testFile)
    expect(stores.Qvain.metadataModalFile).toEqual(testFile)
  })

  test('updateFileMetadata updates updateFileMetadata', () => {
    stores.Qvain.updateFileMetadata(modifiedTestFile)
    expect(stores.Qvain.hierarchy.files[0].formatVersion).toEqual('mock version')
  })

  test('setClearMetadataModalFile sets clearMetadataModalFile', () => {
    stores.Qvain.setClearMetadataModalFile(testFile4)
    expect(stores.Qvain.clearMetadataModalFile).toEqual(testFile4)
  })
})
