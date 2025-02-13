import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import axios from 'axios'
import { configure } from 'mobx'
import { setImmediate } from 'timers'

import { buildStores } from '@/stores'
import { getReferenceData } from '../../__testdata__/referenceData.data'
import { StoresProvider } from '@/stores/stores'
import etsinTheme from '@/styles/theme'
import FileForm from '@/components/qvain/sections/DataOrigin/general/FilePicker/forms/fileForm'
import DirectoryForm from '@/components/qvain/sections/DataOrigin/general/FilePicker/forms/directoryForm'
import { File, Directory, Project } from '@/stores/view/common.files.items'
import { SaveButton } from '@/components/qvain/general/buttons'
import { ValidationErrors } from '@/components/qvain/general/errors/validationError'

const getStores = () => {
  configure({ safeDescriptors: false })
  const stores = buildStores()
  configure({ safeDescriptors: true })
  return stores
}

jest.mock('axios')

axios.get.mockImplementation(url => {
  const { pathname } = new URL(url, 'https://localhost')
  if (pathname.startsWith('/es/reference_data/')) {
    return Promise.resolve({ data: getReferenceData(url) })
  }
  return Promise.resolve({ data: undefined })
})

const flushPromises = () => new Promise(setImmediate)

describe('Qvain.Files', () => {
  beforeEach(() => {
    stores = getStores()
    stores.Auth.user.idaProjects = []
  })

  let wrapper, stores
  afterEach(() => {
    if (wrapper && wrapper.unmount && wrapper.length === 1) {
      wrapper.unmount()
      wrapper = null
    }
  })

  const render = async editDirectory => {
    const testfile = File({
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
    })
    const testDirectory = Directory(
      {
        id: 'testdir-id',
        identifier: 'test-dir-ident',
        project_identifier: 'project_y',
        directory_name: 'testdir',
        directories: [],
        files: [],
      },
      undefined,
      false,
      false
    )
    stores.Qvain.Files.selectedProject = 'project_y'
    stores.Qvain.Files.root = Project(
      {
        id: 'test1',
        identifier: 'test-ident-1',
        project_identifier: 'project_y',
        directories: [testDirectory],
        files: [testfile],
      },
      undefined,
      false,
      true
    )
    let Form
    if (editDirectory) {
      stores.Qvain.Files.setInEdit(testDirectory)
      Form = DirectoryForm
    } else {
      stores.Qvain.Files.setInEdit(testfile)
      Form = FileForm
    }

    stores.Auth.user.idaProjects = ['project_y']

    jest.spyOn(stores.Qvain.Files, 'applyInEdit')

    wrapper = mount(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <Form requestClose={() => {}} setChanged={() => {}} />
        </ThemeProvider>
      </StoresProvider>
    )
    await flushPromises()
    return wrapper
  }

  const selectOption = async (inputId, optionLabel) => {
    wrapper
      .find(`[inputId="${inputId}"]`)
      .find('DropdownIndicator')
      .simulate('mouseDown', { button: 0 })
    wrapper
      .find('Option')
      .filterWhere(opt => opt.text() === optionLabel)
      .simulate('click')

    await flushPromises()
  }

  const expectSave = async result => {
    wrapper.find(SaveButton).simulate('click')
    await flushPromises()
    wrapper.update()
    const { calls } = stores.Qvain.Files.applyInEdit.mock
    if (result === undefined) {
      expect(calls).toEqual([])
    } else {
      expect(calls[0][0]).toEqual(result)
    }
  }

  const expectError = async errorKey => {
    await expectSave(undefined)
    const errorContent = wrapper.find(ValidationErrors).prop('errors')[0]
    expect(errorContent).toBe(errorKey)
  }

  describe('FileForm', () => {
    const selectUseCategory = label => {
      return selectOption('file-form-use-category', label)
    }

    const selectFileType = async label => {
      return selectOption('file-form-file-type', label)
    }

    it('should allow selecting use category', async () => {
      await render()
      await selectUseCategory('Documentation')
      await expectSave({
        title: 'testfile',
        description: 'File',
        useCategory: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
        fileType: undefined,
      })
    })

    it('should fail to save without use category', async () => {
      await render()
      await expectError('qvain.validationMessages.files.file.useCategory.required')
    })

    it('should allow selecting file type', async () => {
      await render()
      await selectUseCategory('Documentation')
      await selectFileType('Audiovisual')
      await expectSave({
        title: 'testfile',
        description: 'File',
        useCategory: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
        fileType: 'http://uri.suomi.fi/codelist/fairdata/file_type/code/audiovisual',
      })
    })

    it('should allow changing title', async () => {
      await render()
      await selectUseCategory('Documentation')
      wrapper.find('input#file-form-title').simulate('change', { target: { value: 'New Title' } })
      await expectSave({
        title: 'New Title',
        description: 'File',
        useCategory: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
        fileType: undefined,
      })
    })

    it('should fail to save without title', async () => {
      await render()
      await selectUseCategory('Documentation')
      wrapper.find('input#file-form-title').simulate('change', { target: { value: '' } })
      await expectError('qvain.validationMessages.files.file.title.required')
    })

    it('should allow changing description', async () => {
      await render()
      await selectUseCategory('Documentation')
      wrapper
        .find('textarea#file-form-description')
        .simulate('change', { target: { value: 'This is a great description' } })
      await expectSave({
        title: 'testfile',
        description: 'This is a great description',
        useCategory: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
        fileType: undefined,
      })
    })
  })

  describe('DirectoryForm', () => {
    const selectUseCategory = label => {
      return selectOption('directory-form-use-category', label)
    }

    it('should allow selecting use category', async () => {
      await render(true)
      await selectUseCategory('Documentation')
      await expectSave({
        title: 'testdir',
        useCategory: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
      })
    })

    it('should fail to save when use category is not set', async () => {
      await render(true)
      await expectError('qvain.validationMessages.files.directory.useCategory.required')
    })

    it('should allow changing title', async () => {
      await render(true)
      await selectUseCategory('Documentation')
      wrapper
        .find('input#directory-form-title')
        .simulate('change', { target: { value: 'New Title' } })
      await expectSave({
        title: 'New Title',
        useCategory: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
      })
    })

    it('should fail to save without title', async () => {
      await render(true)
      await selectUseCategory('Documentation')
      wrapper.find('input#directory-form-title').simulate('change', { target: { value: '' } })
      await expectError('qvain.validationMessages.files.directory.title.required')
    })

    it('should allow changing description', async () => {
      await render(true)
      await selectUseCategory('Documentation')
      wrapper
        .find('textarea#directory-form-description')
        .simulate('change', { target: { value: 'This is a great description' } })
      await expectSave({
        title: 'testdir',
        description: 'This is a great description',
        useCategory: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
      })
    })
  })
})
