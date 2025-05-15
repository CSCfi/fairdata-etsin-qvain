import { screen } from '@testing-library/react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'

import DirectoryForm from '@/components/qvain/sections/DataOrigin/general/FilePicker/forms/directoryForm'
import FileForm from '@/components/qvain/sections/DataOrigin/general/FilePicker/forms/fileForm'
import PasState from '@/components/qvain/views/headers/pasState'
import { Directory, File, Project } from '@/stores/view/common.files.items'

import { contextRenderer } from '@/../__tests__/test-helpers'
import { DATA_CATALOG_IDENTIFIER } from '@/utils/constants'
import { metaxResponses } from '../../__testdata__/qvainPas.data'

import { buildStores } from '@/stores'

const getStores = () => {
  const stores = buildStores()
  return stores
}

const mockAdapter = new MockAdapter(axios)
mockAdapter.onGet().reply(async ({ url }) => {
  const path = new URL(url).pathname
  if (!metaxResponses[path]) {
    console.error(`Error: no mock response for ${path}`)
  }
  await Promise.delay(0)
  return [200, metaxResponses[path]]
})

describe('Qvain.PasState', () => {
  const renderState = stores => {
    stores.Qvain.Keywords.set(['key', 'word'])
    return contextRenderer(<PasState />, { stores })
  }

  it('shows pas state', async () => {
    const stores = getStores()
    stores.Qvain.dataCatalog = DATA_CATALOG_IDENTIFIER.IDA
    stores.Qvain.setPreservationState(80)
    renderState(stores)
    expect(screen.getByTestId('pas-state').textContent).toContain('80:')

    stores.Qvain.setPreservationState(0)
    stores.Qvain.setDataCatalog(DATA_CATALOG_IDENTIFIER.PAS)
    await Promise.resolve()

    expect(screen.getByTestId('pas-state').textContent).not.toContain('80:')
    expect(screen.getByTestId('pas-state').textContent).toContain('0:')
  })
})

describe('Qvain.Files', () => {
  const renderFiles = (stores, editDirectory) => {
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
    return contextRenderer(<Form requestClose={() => {}} setChanged={() => {}} />, { stores })
  }

  it('prevents editing of file fields', async () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(80)
    renderFiles(stores)

    const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]'))
    expect(inputs.length).toBe(3)
    inputs.forEach(c => expect(c.hasAttribute('disabled')).toBe(true))

    const textareas = Array.from(document.querySelectorAll('textarea:not([type="hidden"]'))
    expect(textareas.length).toBe(1)
    textareas.forEach(c => expect(c.hasAttribute('disabled')).toBe(true))
  })

  it('allows editing of file fields', async () => {
    const stores = getStores()
    stores.Auth.user.idaProjects = ['project_y']
    stores.Qvain.setPreservationState(0)
    renderFiles(stores)

    const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]'))
    expect(inputs.length).toBe(3)
    inputs.forEach(c => expect(c.hasAttribute('disabled')).toBe(false))

    const textareas = Array.from(document.querySelectorAll('textarea:not([type="hidden"]'))
    expect(textareas.length).toBe(1)
    textareas.forEach(c => expect(c.hasAttribute('disabled')).toBe(false))
  })

  it('prevents editing of directory fields', async () => {
    const stores = getStores()
    stores.Auth.user.idaProjects = ['project_y']
    stores.Qvain.setPreservationState(80)
    renderFiles(stores, true)

    const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]'))
    expect(inputs.length).toBe(3)
    inputs.forEach(c => expect(c.hasAttribute('disabled')).toBe(true))

    const textareas = Array.from(document.querySelectorAll('textarea:not([type="hidden"]'))
    expect(textareas.length).toBe(1)
    textareas.forEach(c => expect(c.hasAttribute('disabled')).toBe(true))
  })

  it('allows editing of directory fields', async () => {
    const stores = getStores()
    stores.Auth.user.idaProjects = ['project_y']
    stores.Qvain.setPreservationState(100)
    renderFiles(stores, true)

    const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]'))
    expect(inputs.length).toBe(3)
    inputs.forEach(c => expect(c.hasAttribute('disabled')).toBe(false))

    const textareas = Array.from(document.querySelectorAll('textarea:not([type="hidden"]'))
    expect(textareas.length).toBe(1)
    textareas.forEach(c => expect(c.hasAttribute('disabled')).toBe(false))
  })
})
