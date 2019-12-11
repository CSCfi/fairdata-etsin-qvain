import React from 'react'
import { mount } from 'enzyme'
import ReactModal from 'react-modal'
import { ThemeProvider } from 'styled-components'
import { Provider } from 'mobx-react'
import axios from 'axios'
import '../locale/translations.js'
import { when } from 'mobx'

import etsinTheme from '../js/styles/theme'
import FileSelector from '../js/components/qvain/files/fileSelector'
import MetadataModal from '../js/components/qvain/files/metadataModal'
import QvainStore, {
  Directory
} from '../js/stores/view/qvain'
import LocaleStore from '../js/stores/view/language'

jest.mock('axios')

const getStores = () => ({
  Qvain: QvainStore,
  Locale: LocaleStore
})

const testFile = {
  description: 'File',
  title: 'testfile',
  existing: false,
  file_name: 'test.pdf',
  file_path: '/test/test.pdf',
  identifier: 'test_file',
  project_identifier: 'project_y',
  file_characteristics: {
    file_format: 'text/csv',
    format_version: '',
    encoding: 'UTF-8',
    csv_has_header: true,
    csv_record_separator: 'LF',
    csv_quoting_char: '"',
  }
}

const testFile2 = {
  description: 'File2',
  title: 'testfile2',
  existing: false,
  file_name: 'test2.pdf',
  file_path: '/test/test2.pdf',
  identifier: 'test_file2',
  project_identifier: 'project_y',
  file_characteristics: {
    file_format: 'text/csv',
    format_version: 'format_not_allowed_here',
    encoding: 'UTF-8',
    csv_has_header: true,
    csv_record_separator: 'LF',
    csv_quoting_char: '"',
  }
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
  }
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
  }
}

const fileFormats = {
  data: {
    hits: {
      hits: [
        {
          "_source": {
            "input_file_format" : "text/csv",
            "output_format_version" : "",
            "label" : {
              "und" : "file_format_version_text_csv"
            },
          }
        },
        {
          "_source" : {
            "input_file_format" : "application/pdf",
            "output_format_version" : "1.6",
          }
        },
      ],
    }
  }
}

describe('Qvain.MetadataModal', () => {

  let helper, wrapper, stores

  beforeEach(() => {
    // Mock file format list request
    axios.get.mockReturnValue(fileFormats)

    helper = document.createElement('div')
    ReactModal.setAppElement(helper)
    stores = getStores()
    wrapper = mount(
      (
        <Provider Stores={stores}>
          <ThemeProvider theme={etsinTheme}>
            <>
              <FileSelector />
              <MetadataModal />
            </>
          </ThemeProvider>
        </Provider>
      ), { attachTo: helper }
    )

    // Set directory hierarchy
    stores.Qvain.selectedDirectories = []
    stores.Qvain.selectedProject = 'project_y'
    stores.Qvain.hierarchy = Directory(
      {
        id: 'test1',
        identifier: 'test-ident-1',
        project_identifier: 'project_y',
        directory_name: 'root',
        directories: [
          {
            id: 'test2',
            identifier: 'test-ident-2',
            project_identifier: 'project_y',
            directory_name: 'directory2',
            directories: [],
            files: []
          }
        ],
        files: [
          testFile, testFile2, testFile3, testFile4
        ]
      },
      undefined,
      false,
      true
    )
    wrapper.update()
  })

  afterEach(() => {
    wrapper.detach()
  })

  it('opens file on click and validates the metadata', async () => {
    // Open modal, wait until versions have been fetched
    wrapper.find('button#test_file-open-metadata-modal').simulate('click')
    const instance = wrapper.find(MetadataModal).instance().wrappedInstance
    await when(() => instance.formatFetchStatus !== 'loading')

    // Expect no version for text/csv
    expect(instance.state.fileIdentifier).toBe('test_file')
    expect(instance.state.csvHasHeader).toBe(true)
    expect(instance.validateMetadata).not.toThrow()

    // Versions forbidden for text/csv
    wrapper.find('button#test_file2-open-metadata-modal').simulate('click')
    expect(instance.state.fileIdentifier).toBe('test_file2')
    expect(instance.validateMetadata).toThrow()

    // Accepted version for application/pdf
    wrapper.find('button#test_file3-open-metadata-modal').simulate('click')
    expect(instance.state.fileIdentifier).toBe('test_file3')
    expect(instance.state.csvHasHeader).toBe(false)
    expect(instance.validateMetadata).not.toThrow()

    // Invalid version for application/pdf
    wrapper.find('button#test_file4-open-metadata-modal').simulate('click')
    expect(instance.state.fileIdentifier).toBe('test_file4')
    expect(instance.validateMetadata).toThrow()
  })

  it('allows modifying the pas metadata of files in hierarchy', async () => {
    // Open modal, wait until versions have been fetched
    wrapper.find('button#test_file4-open-metadata-modal').simulate('click')
    const instance = wrapper.find(MetadataModal).instance().wrappedInstance
    await when(() => instance.formatFetchStatus !== 'loading')
    expect(instance.state.fileIdentifier).toBe('test_file4')
    expect(instance.state.formatVersion).not.toBe('1.6')

    // Change to accepted version
    instance.setFormatVersion( { value: '1.6' } )
    expect(instance.state.formatVersion).toBe('1.6')

    // Mock the patch RPC used by save
    axios.patch.mockImplementationOnce((url, data) => {
      return {
        data: {
          ...testFile4,
          file_characteristics: {
            ...testFile4.file_characteristics,
            ...data
          }
        }
      }
    })
    await instance.saveChanges()

    // Clear modal file
    stores.Qvain.setMetadataModalFile(null)
    expect(instance.state.fileIdentifier).not.toBe('test_file4')
    expect(instance.state.formatVersion).not.toBe('1.6')

    // Reopen file from hierarchy, should now validate correctly
    wrapper.find('button#test_file4-open-metadata-modal').simulate('click')
    expect(instance.state.fileIdentifier).toBe('test_file4')
    expect(instance.state.formatVersion).toBe('1.6')
    expect(instance.validateMetadata).not.toThrow()
  })
})
