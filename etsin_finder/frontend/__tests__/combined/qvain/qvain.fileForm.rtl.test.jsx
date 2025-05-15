import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { configure } from 'mobx'
import React from 'react'
import { setImmediate } from 'timers'

import { contextRenderer } from '@/../__tests__/test-helpers'
import DirectoryForm from '@/components/qvain/sections/DataOrigin/general/FilePicker/forms/directoryForm'
import FileForm from '@/components/qvain/sections/DataOrigin/general/FilePicker/forms/fileForm'
import { buildStores } from '@/stores'
import { Directory, File, Project } from '@/stores/view/common.files.items'
import { getReferenceData } from '../../__testdata__/referenceData.data'

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

  let stores

  const renderForm = async editDirectory => {
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

    contextRenderer(<Form requestClose={() => {}} setChanged={() => {}} />, { stores })
    await flushPromises()
  }

  const selectOption = async (inputId, optionLabel) => {
    await userEvent.click(document.getElementById(inputId))
    await userEvent.click(screen.getByRole('option', { name: optionLabel }))
    await flushPromises()
  }

  const expectSave = async result => {
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await flushPromises()
    const { calls } = stores.Qvain.Files.applyInEdit.mock
    if (result === undefined) {
      expect(calls).toEqual([])
    } else {
      expect(calls[0][0]).toEqual(result)
    }
  }

  const expectError = async errorKey => {
    await expectSave(undefined)
    expect(screen.getAllByText(stores.Locale.translate(errorKey))[0]).toBeInTheDocument()
  }

  describe('FileForm', () => {
    const selectUseCategory = label => selectOption('file-form-use-category', label)

    const selectFileType = async label => selectOption('file-form-file-type', label)

    it('should allow selecting use category', async () => {
      await renderForm()
      await selectUseCategory('Documentation')
      await expectSave({
        title: 'testfile',
        description: 'File',
        useCategory: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
        fileType: undefined,
      })
    })

    it('should fail to save without use category', async () => {
      await renderForm()
      await expectError('qvain.validationMessages.files.file.useCategory.required')
    })

    it('should allow selecting file type', async () => {
      await renderForm()
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
      await renderForm()
      await selectUseCategory('Documentation')
      const input = screen.getByLabelText('Title', { exact: false })
      await userEvent.clear(input)
      await userEvent.type(input, 'New Title')
      await expectSave({
        title: 'New Title',
        description: 'File',
        useCategory: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
        fileType: undefined,
      })
    })

    it('should fail to save without title', async () => {
      await renderForm()
      await selectUseCategory('Documentation')
      const input = screen.getByLabelText('Title', { exact: false })
      await userEvent.clear(input)
      await expectError('qvain.validationMessages.files.file.title.required')
    })

    it('should allow changing description', async () => {
      await renderForm()
      await selectUseCategory('Documentation')
      const input = screen.getByLabelText('Description')
      await userEvent.clear(input)
      await userEvent.type(input, 'This is a great description')
      await expectSave({
        title: 'testfile',
        description: 'This is a great description',
        useCategory: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
        fileType: undefined,
      })
    })
  })

  describe('DirectoryForm', () => {
    const selectUseCategory = label => selectOption('directory-form-use-category', label)

    it('should allow selecting use category', async () => {
      await renderForm(true)
      await selectUseCategory('Documentation')
      await expectSave({
        title: 'testdir',
        useCategory: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
      })
    })

    it('should fail to save when use category is not set', async () => {
      await renderForm(true)
      await expectError('qvain.validationMessages.files.directory.useCategory.required')
    })

    it('should allow changing title', async () => {
      await renderForm(true)
      await selectUseCategory('Documentation')
      const input = screen.getByLabelText('Title', { exact: false })
      await userEvent.clear(input)
      await userEvent.type(input, 'New Title')
      await expectSave({
        title: 'New Title',
        useCategory: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
      })
    })

    it('should fail to save without title', async () => {
      await renderForm(true)
      await selectUseCategory('Documentation')
      const input = screen.getByLabelText('Title', { exact: false })
      await userEvent.clear(input)
      await expectError('qvain.validationMessages.files.directory.title.required')
    })

    it('should allow changing description', async () => {
      await renderForm(true)
      await selectUseCategory('Documentation')
      const input = screen.getByLabelText('Description')
      await userEvent.clear(input)
      await userEvent.type(input, 'This is a great description')
      await expectSave({
        title: 'testdir',
        description: 'This is a great description',
        useCategory: 'http://uri.suomi.fi/codelist/fairdata/use_category/code/documentation',
      })
    })
  })
})
