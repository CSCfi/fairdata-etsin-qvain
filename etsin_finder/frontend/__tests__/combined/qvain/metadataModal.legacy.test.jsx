import React from 'react'
import { mount } from 'enzyme'
import ReactModal from 'react-modal'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import { runInAction, when } from 'mobx'

import '../../../locale/translations.js'
import etsinTheme from '../../../js/styles/theme'
import FileSelector from '../../../js/components/qvain/fields/files/legacy/fileSelector'
import MetadataModal from '../../../js/components/qvain/fields/files/metadataModal'
import Env from '../../../js/stores/domain/env'
import QvainStoreClass from '../../../js/stores/view/qvain'
import { DatasetFile, Directory } from '../../../js/stores/view/qvain/qvain.filesv1.js'
import LocaleStore from '../../../js/stores/view/locale'
import { StoresProvider } from '../../../js/stores/stores.jsx'

jest.mock('axios')

const QvainStore = new QvainStoreClass(Env)
const getStores = () => {
  Env.Flags.setFlag('METAX_API_V2', false)
  return {
    Env,
    Qvain: QvainStore,
    Locale: LocaleStore,
  }
}

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
  },
}

const testDatasetFile = {
  ...testFile,
  details: {
    parent_directory: 'test1',
    file_characteristics: {
      file_format: 'text/csv',
      format_version: '',
      encoding: 'UTF-8',
      csv_has_header: true,
      csv_record_separator: 'LF',
      csv_quoting_char: '"',
    },
  },
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

describe('Qvain.MetadataModal', () => {
  let helper, wrapper, stores, instance

  beforeEach(() => {
    // Mock file format list request
    axios.get.mockReturnValue(fileFormats)

    helper = document.createElement('div')
    ReactModal.setAppElement(helper)
    stores = getStores()
    const ref = React.createRef()
    wrapper = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <>
              <FileSelector />
              <MetadataModal ref={ref} />
            </>
          </ThemeProvider>
        </BrowserRouter>
      </StoresProvider>,
      { attachTo: helper }
    )
    instance = ref.current
    // Set directory hierarchy
    runInAction(() => {
      stores.Qvain.selectedDirectories = []
      stores.Qvain.existingFiles = [DatasetFile(testDatasetFile)]
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
              files: [],
            },
          ],
          files: [testFile, testFile2, testFile3, testFile4],
        },
        undefined,
        false,
        true
      )
    })
    wrapper.update()
  })

  afterEach(() => {
    wrapper.unmount()
    wrapper.detach()
  })

  it('opens file on click and validates the metadata', async () => {
    // Open modal, wait until versions have been fetched
    wrapper.find('button#test_file-open-metadata-modal').simulate('click')
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

  it('updates existing files on metadata save', async () => {
    // Open modal, wait until versions have been fetched
    wrapper.find('button#test_file-open-metadata-modal').simulate('click')
    await when(() => instance.formatFetchStatus !== 'loading')

    expect(stores.Qvain.existingFiles[0].csvHasHeader).toBe(true)
    expect(instance.state.csvHasHeader).toBe(true)
    instance.setCsvHasHeader({ value: false })
    expect(instance.state.csvHasHeader).toBe(false)

    // Mock the put request used by save
    axios.put.mockImplementationOnce((url, data) => ({
      data: {
        ...testFile,
        file_characteristics: {
          ...testFile.file_characteristics,
          ...data,
        },
      },
    }))
    await instance.saveChanges()
    expect(stores.Qvain.existingFiles[0].csvHasHeader).toBe(false)
  })

  it('allows modifying the pas metadata of files in hierarchy', async () => {
    // Open modal, wait until versions have been fetched
    wrapper.find('button#test_file4-open-metadata-modal').simulate('click')
    await when(() => instance.formatFetchStatus !== 'loading')
    expect(instance.state.fileIdentifier).toBe('test_file4')
    expect(instance.state.formatVersion).not.toBe('1.6')

    // Change to accepted version
    instance.setFormatVersion({ value: '1.6' })
    expect(instance.state.formatVersion).toBe('1.6')

    // Mock the put request used by save
    axios.put.mockImplementationOnce((url, data) => ({
      data: {
        ...testFile4,
        file_characteristics: {
          ...testFile4.file_characteristics,
          ...data,
        },
      },
    }))
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

  it('disables metadata editing in readonly state', async () => {
    // Open modal, wait until versions have been fetched
    wrapper.find('button#test_file2-open-metadata-modal').simulate('click')
    await when(() => instance.formatFetchStatus !== 'loading')

    // All inputs and buttons should be enabled
    const enabled = wrapper
      .find(MetadataModal)
      .find('input')
      .not('[type="hidden"]')
      .not('[disabled=true]')
    expect(enabled.length).toBe(7)
    expect(wrapper.find(MetadataModal).find('button').not('[disabled=true]').length).toBe(3)
    expect(wrapper.find(MetadataModal).find('button').find('[disabled=true]').length).toBe(0)

    // Switch to readonly state
    stores.Qvain.setPreservationState(80)
    wrapper.update()

    // Save button and all inputs should be disabled, close buttons should be enabled
    const disabled = wrapper
      .find(MetadataModal)
      .find('input')
      .not('[type="hidden"]')
      .find('[disabled=true]')
    expect(disabled.length).toBe(7)
    expect(wrapper.find(MetadataModal).find('button').not('[disabled=true]').length).toBe(2)
    expect(wrapper.find(MetadataModal).find('button').find('[disabled=true]').length).toBe(1)
  })
})
