import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import etsinTheme from '@/styles/theme'
import PasState from '@/components/qvain/views/headers/pasState'
import FileForm from '@/components/qvain/sections/DataOrigin/general/FilePicker/forms/fileForm'
import DirectoryForm from '@/components/qvain/sections/DataOrigin/general/FilePicker/forms/directoryForm'
import { File, Directory, Project } from '@/stores/view/common.files.items'

import { DATA_CATALOG_IDENTIFIER } from '@/utils/constants'
import { metaxResponses } from '../../__testdata__/qvainPas.data'

import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'

const stores = buildStores()

const getStores = () => {
  stores.Qvain.resetQvainStore()
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

// Unmount mounted components after each test to avoid tests affecting each other.
let wrapper
afterEach(() => {
  if (wrapper && wrapper.unmount && wrapper.length === 1) {
    wrapper.unmount()
    wrapper = null
  }
})


describe('Qvain.PasState', () => {
  const render = stores => {
    stores.Qvain.Keywords.set(['key', 'word'])
    return mount(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <PasState />
        </ThemeProvider>
      </StoresProvider>
    )
  }

  it('shows pas state', () => {
    const stores = getStores()
    stores.Qvain.dataCatalog = DATA_CATALOG_IDENTIFIER.IDA
    stores.Qvain.setPreservationState(80)
    wrapper = render(stores)
    expect(wrapper.find(PasState).text().includes('80:')).toBe(true)
    wrapper.unmount()

    stores.Qvain.dataCatalog = DATA_CATALOG_IDENTIFIER.PAS
    stores.Qvain.setPreservationState(0)
    wrapper = render(stores)
    expect(wrapper.find(PasState).text().includes('80:')).toBe(false)
    expect(wrapper.find(PasState).text().includes('0:')).toBe(true)
  })
})

describe('Qvain.Files', () => {
  const render = (stores, editDirectory) => {
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
    return mount(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <Form requestClose={() => {}} setChanged={() => {}} />
        </ThemeProvider>
      </StoresProvider>
    )
  }

  it('prevents editing of file fields', async () => {
    const stores = getStores()
    stores.Qvain.setPreservationState(80)
    wrapper = render(stores)

    const inputs = wrapper.find('input').not('[type="hidden"]')
    const textareas = wrapper.find('textarea').not('[type="hidden"]')

    expect(inputs.length).toBe(3)
    inputs.forEach(c => expect(c.props().disabled).toBe(true))

    expect(textareas.length).toBe(1)
    textareas.forEach(c => expect(c.props().disabled).toBe(true))
  })

  it('allows editing of file fields', async () => {
    const stores = getStores()
    stores.Auth.user.idaProjects = ['project_y']
    stores.Qvain.setPreservationState(0)
    wrapper = render(stores)
    const inputs = wrapper.find('input').not('[type="hidden"]')
    expect(inputs.length).toBe(3)
    inputs.forEach(c => expect(c.props().disabled).toBe(false))

    const textareas = wrapper.find('textarea').not('[type="hidden"]')
    expect(textareas.length).toBe(1)
    textareas.forEach(c => expect(c.props().disabled).toBe(false))
  })

  it('prevents editing of directory fields', async () => {
    const stores = getStores()
    stores.Auth.user.idaProjects = ['project_y']
    stores.Qvain.setPreservationState(80)
    wrapper = render(stores, true)

    const inputs = wrapper.find('input').not('[type="hidden"]')
    expect(inputs.length).toBe(3)
    inputs.forEach(c => expect(c.props().disabled).toBe(true))

    const textareas = wrapper.find('textarea').not('[type="hidden"]')
    expect(textareas.length).toBe(1)
    textareas.forEach(c => expect(c.props().disabled).toBe(true))
  })

  it('allows editing of directory fields', async () => {
    const stores = getStores()
    stores.Auth.user.idaProjects = ['project_y']
    stores.Qvain.setPreservationState(100)
    wrapper = render(stores, true)

    const inputs = wrapper.find('input').not('[type="hidden"]')
    expect(inputs.length).toBe(3)
    inputs.forEach(c => expect(c.props().disabled).toBe(false))

    const textareas = wrapper.find('textarea').not('[type="hidden"]')
    expect(textareas.length).toBe(1)
    textareas.forEach(c => expect(c.props().disabled).toBe(false))
  })
})
