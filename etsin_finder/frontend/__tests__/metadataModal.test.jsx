import React from 'react'
import { mount } from 'enzyme'
import ReactModal from 'react-modal'
import { ThemeProvider } from 'styled-components'
import { Provider } from 'mobx-react'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import { when } from 'mobx'
import translate from 'counterpart'

import '../locale/translations.js'
import etsinTheme from '../js/styles/theme'
import MetadataModal from '../js/components/qvain/files/metadataModal'
import Env from '../js/stores/domain/env'
import QvainStoreClass from '../js/stores/view/qvain'
import { Project, File, Directory } from '../js/stores/view/common.files.items'
import LocaleStore from '../js/stores/view/language'

jest.mock('axios')

const QvainStore = new QvainStoreClass(Env)
const getStores = () => {
  Env.setMetaxApiV2(true)
  QvainStore.resetQvainStore()
  return {
    Env,
    Qvain: QvainStore,
    Locale: LocaleStore
  }
}
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
  }
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
          _source: {
            input_file_format: 'text/csv',
            output_format_version: '',
            label: {
              und: 'file_format_version_text_csv'
            },
          }
        },
        {
          _source: {
            input_file_format: 'application/pdf',
            output_format_version: '1.6',
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
      <Provider Stores={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <MetadataModal />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>,
      { attachTo: helper }
    )

    // Set directory hierarchy
    stores.Qvain.Files.selectedProject = 'project_y'
    stores.Qvain.Files.root = Project('project_y', 'project_root')
    const dir = Directory({
      id: 'test1',
      identifier: 'test-ident-1',
      project_identifier: 'project_y',
      directory_name: 'test',
      directory_path: '/test',
    }, {
      loaded: true, // don't try to fetch from Metax
      files: [
        testFile, testFile2, testFile3, testFile4
      ].map(File)
    })
    stores.Qvain.Files.root.directories.push(dir)
    wrapper.update()
  })

  afterEach(() => {
    wrapper.unmount()
    wrapper.detach()
  })

  it('opens file on click and validates the metadata', async () => {
    const { Files } = stores.Qvain

    // Open modal, wait until versions have been fetched
    stores.Qvain.setMetadataModalFile(await Files.getItemByPath('/test/test.csv'))
    const instance = wrapper.find(MetadataModal).instance().wrappedInstance
    await when(() => instance.formatFetchStatus !== 'loading')

    // Expect no version for text/csv
    expect(instance.state.fileIdentifier).toBe('test_file')
    expect(instance.state.csvHasHeader).toBe(true)
    expect(instance.validateMetadata).not.toThrow()

    // Versions forbidden for text/csv
    stores.Qvain.setMetadataModalFile(await Files.getItemByPath('/test/test2.csv'))
    expect(instance.state.fileIdentifier).toBe('test_file2')
    expect(instance.validateMetadata).toThrow(translate('qvain.files.metadataModal.errors.formatVersionNotAllowed'))

    // Accepted version for application/pdf
    stores.Qvain.setMetadataModalFile(await Files.getItemByPath('/test/test3.pdf'))
    expect(instance.state.fileIdentifier).toBe('test_file3')
    expect(instance.state.csvHasHeader).toBe(false)
    expect(instance.validateMetadata).not.toThrow()

    // Invalid version for application/pdf
    stores.Qvain.setMetadataModalFile(await Files.getItemByPath('/test/test4.pdf'))
    expect(instance.state.fileIdentifier).toBe('test_file4')
    expect(instance.validateMetadata).toThrow()
  })

  it('updates existing files on metadata save', async () => {
    const { Files } = stores.Qvain
    const file = await Files.getItemByPath('/test/test.csv')

    // Open modal, wait until versions have been fetched
    stores.Qvain.setMetadataModalFile(file)
    const instance = wrapper.find(MetadataModal).instance().wrappedInstance
    await when(() => instance.formatFetchStatus !== 'loading')

    expect(file.pasMeta.csvHasHeader).toBe(true)
    expect(instance.state.csvHasHeader).toBe(true)
    instance.setCsvHasHeader({ value: false })
    expect(instance.state.csvHasHeader).toBe(false)

    // Mock the patch RPC used by save
    axios.patch.mockImplementationOnce((url, data) => ({
      data: {
        ...testFile,
        file_characteristics: {
          ...testFile.file_characteristics,
          ...data
        }
      }
    }))
    await instance.saveChanges()
    expect(file.pasMeta.csvHasHeader).toBe(false)
  })

  it('allows modifying the pas metadata of files in hierarchy', async () => {
    const { Files } = stores.Qvain

    // Open modal, wait until versions have been fetched
    const file = await Files.getItemByPath('/test/test4.pdf')
    stores.Qvain.setMetadataModalFile(file)
    wrapper.update()
    const instance = wrapper.find(MetadataModal).instance().wrappedInstance
    await when(() => instance.formatFetchStatus !== 'loading')
    expect(instance.state.fileIdentifier).toBe('test_file4')
    expect(instance.state.formatVersion).not.toBe('1.6')

    // Change to accepted version
    instance.setFormatVersion({ value: '1.6' })
    expect(instance.state.formatVersion).toBe('1.6')

    // Mock the patch RPC used by save
    axios.patch.mockImplementationOnce((url, data) => ({
      data: {
        ...testFile4,
        file_characteristics: {
          ...testFile4.file_characteristics,
          ...data
        }
      }
    }))
    await instance.saveChanges()

    // Clear modal file
    stores.Qvain.setMetadataModalFile(null)
    expect(instance.state.fileIdentifier).not.toBe('test_file4')
    expect(instance.state.formatVersion).not.toBe('1.6')

    // Reopen file from hierarchy, should now validate correctly
    stores.Qvain.setMetadataModalFile(file)
    expect(instance.state.fileIdentifier).toBe('test_file4')
    expect(instance.state.formatVersion).toBe('1.6')
    expect(instance.validateMetadata).not.toThrow()
  })

  it('disables metadata editing in readonly state', async () => {
    const { Files } = stores.Qvain

    // Open modal, wait until versions have been fetched
    stores.Qvain.setMetadataModalFile(await Files.getItemByPath('/test/test2.csv'))
    wrapper.update()
    const instance = wrapper.find(MetadataModal).instance().wrappedInstance
    await when(() => instance.formatFetchStatus !== 'loading')

    // All inputs and buttons should be enabled
    const enabled = wrapper.find(MetadataModal).find('input').not('[type="hidden"]').not('[disabled=true]')
    expect(enabled.length).toBe(7)
    expect(wrapper.find(MetadataModal).find('button').not('[disabled=true]').length).toBe(3)
    expect(wrapper.find(MetadataModal).find('button').find('[disabled=true]').length).toBe(0)

    // Switch to readonly state
    stores.Qvain.setPreservationState(80)
    wrapper.update()

    // Save button and all inputs should be disabled, close buttons should be enabled
    const disabled = wrapper.find(MetadataModal).find('input').not('[type="hidden"]').find('[disabled=true]')
    expect(disabled.length).toBe(7)
    expect(wrapper.find(MetadataModal).find('button').not('[disabled=true]').length).toBe(2)
    expect(wrapper.find(MetadataModal).find('button').find('[disabled=true]').length).toBe(1)
  })

  it('hides csv options for non-csv files', async () => {
    const { Files } = stores.Qvain

    // Open modal, wait until versions have been fetched
    stores.Qvain.setMetadataModalFile(await Files.getItemByPath('/test/test2.csv'))
    wrapper.update()
    const instance = wrapper.find(MetadataModal).instance().wrappedInstance
    await when(() => instance.formatFetchStatus !== 'loading')

    // All inputs and buttons should be enabled
    let enabled = wrapper.find(MetadataModal).find('input').not('[type="hidden"]').not('[disabled=true]')
    expect(enabled.length).toBe(7)

    stores.Qvain.setMetadataModalFile(await Files.getItemByPath('/test/test4.pdf'))
    wrapper.update()

    // All inputs and buttons should be enabled
    enabled = wrapper.find(MetadataModal).find('input').not('[type="hidden"]').not('[disabled=true]')
    expect(enabled.length).toBe(3)
  })
})
