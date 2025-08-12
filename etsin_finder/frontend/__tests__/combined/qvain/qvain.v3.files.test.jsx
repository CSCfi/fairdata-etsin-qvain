import { ThemeProvider } from 'styled-components'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import ReactModal from 'react-modal'

import { Route, Routes } from 'react-router-dom'

import { screen, render, within, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import EnvClass from '@/stores/domain/env'
import { StoresProvider } from '@/stores/stores'
import Qvain from '@/components/qvain/views/main'
import { failTestsWhenTranslationIsMissing } from '@helpers'
import DataMemoryRouter from '@helpers/DataMemoryRouter'

const registerMissingTranslationHandler = failTestsWhenTranslationIsMissing()

// Replace debounce milliseconds with 0
jest.mock('lodash.debounce', () => f => jest.requireActual('lodash.debounce')(f, 0))
jest.setTimeout(25000)
import dataset from '../../__testdata__/metaxv3/datasets/dataset_ida_a.data'
import FilesMock from '@testdata/files.data'

const mockAdapter = new MockAdapter(axios)
const filesMock = new FilesMock()
filesMock.setFilesFromPaths([
  '/data/file1.csv',
  '/data/file2.csv',
  '/data/file3.csv',
  '/info/something.txt',
  '/readme.md',
])

// axios mocks
beforeEach(() => {
  filesMock.setDatasetFiles({})
  mockAdapter.reset()
  mockAdapter.onGet(new RegExp('/v3/reference-data/.*')).reply(200, [])
  mockAdapter.onGet(new RegExp('/v3/organizations')).reply(200, [])
  filesMock.registerHandler(mockAdapter)
  mockAdapter.resetHistory()
})

// rendering helpers
const renderQvain = async ({ initialPath, overrides = {}, draftOverrides = {} } = {}) => {
  const metaxDataset = { ...dataset, cumulative_state: 0, ...overrides }
  const publishedDataset = { ...dataset, ...overrides, state: 'published' }
  const linkedDatasetDraft = {
    ...metaxDataset,
    ...draftOverrides, // draft-only overrides
    id: 'linked-draft-id',
    draft_of: {
      id: metaxDataset.id,
    },
  }
  mockAdapter.onGet(`https://metaxv3:443/v3/datasets/${metaxDataset.id}`).reply(200, metaxDataset)
  mockAdapter.onPatch(`https://metaxv3:443/v3/datasets/${metaxDataset.id}`).reply(200, metaxDataset)
  mockAdapter
    .onPost(`https://metaxv3:443/v3/datasets/${metaxDataset.id}/publish`)
    .reply(200, publishedDataset)

  // Linked draft
  mockAdapter
    .onPost(`https://metaxv3:443/v3/datasets/${metaxDataset.id}/create-draft`)
    .reply(201, linkedDatasetDraft)
  mockAdapter
    .onGet(`https://metaxv3:443/v3/datasets/${linkedDatasetDraft.id}`)
    .reply(200, linkedDatasetDraft)
  mockAdapter
    .onPatch(`https://metaxv3:443/v3/datasets/${linkedDatasetDraft.id}`)
    .reply(200, linkedDatasetDraft)
  mockAdapter
    .onPost(`https://metaxv3:443/v3/datasets/${linkedDatasetDraft.id}/publish`)
    .reply(200, publishedDataset)

  document.cookie = 'etsin_app=qvain' // sets etsin_app
  const Env = new EnvClass()
  Env.Flags.setFlag('QVAIN.METAX_V3.FRONTEND', true)
  Env.Flags.setFlag('QVAIN.REMS', true)
  Env.setMetaxV3Host('metaxv3', 443)
  const stores = buildStores({ Env })
  stores.Auth.setUser({
    name: 'testuser',
    firstName: 'Teppo',
    lastName: 'Testaaja',
    loggedIn: true,
    homeOrganizationId: 'csc.fi',
    idaProjects: ['testproject'],
  })
  registerMissingTranslationHandler(stores.Locale)

  render(
    <ThemeProvider theme={etsinTheme}>
      <DataMemoryRouter
        initialEntries={[initialPath || `/dataset/${metaxDataset.id}`]}
        stores={stores}
      >
        <StoresProvider store={stores}>
          <Routes>
            <Route path="/dataset/:identifier" Component={Qvain} />
          </Routes>
        </StoresProvider>
      </DataMemoryRouter>
    </ThemeProvider>
  )
  ReactModal.setAppElement(document.createElement('div'))
  await waitForElementToBeRemoved(() => screen.queryByText('Loading dataset'))
}

describe('Qvain with an opened dataset', () => {
  it('allows adding files to dataset that originally had none', async () => {
    await renderQvain()
    await userEvent.click(screen.getByTestId('open-add-files'))
    const modal = screen.getByRole('dialog')
    await userEvent.click(within(modal).getByRole('combobox', { name: 'Select project' }))
    await userEvent.click(within(modal).getByRole('option', { name: 'testproject' }))

    await userEvent.click(within(modal).getByTestId('select-/readme.md'))
    await userEvent.click(within(modal).getByTestId('select-/data/'))
    await userEvent.click(within(modal).getByRole('button', { name: 'Add files' }))

    const submitButton = screen.getByRole('button', { name: 'Save as draft' })
    await userEvent.click(submitButton) // should submit data to metax
    const fileset = JSON.parse(mockAdapter.history.patch[0].data).fileset
    expect(fileset).toEqual({
      directory_actions: [{ action: 'add', pathname: '/data/' }],
      file_actions: [{ action: 'add', id: 'id-/readme.md' }],
      storage_service: 'ida',
      csc_project: 'testproject',
    })
  })

  it('allows adding files to published dataset with a project but no files', async () => {
    await renderQvain({
      overrides: {
        fileset: {
          csc_project: 'testproject',
          storage_service: 'ida',
          total_files_count: 0,
          total_files_size: 0,
        },
      },
      initialPath: '/dataset/linked-draft-id',
    })

    await userEvent.click(screen.getByTestId('open-add-files'))
    const modal = screen.getByRole('dialog')

    await userEvent.click(within(modal).getByTestId('select-/readme.md'))
    await userEvent.click(within(modal).getByTestId('select-/data/'))
    await userEvent.click(within(modal).getByRole('button', { name: 'Add files' }))

    const submitButton = screen.getByRole('button', { name: 'Save as draft' })
    await userEvent.click(submitButton) // should submit data to metax
    const fileset = JSON.parse(mockAdapter.history.patch[0].data).fileset
    expect(fileset).toEqual({
      directory_actions: [{ action: 'add', pathname: '/data/' }],
      file_actions: [{ action: 'add', id: 'id-/readme.md' }],
      storage_service: 'ida',
      csc_project: 'testproject',
    })
  })

  it('allows adding more files to draft of empty published dataset', async () => {
    filesMock.setDatasetFiles({
      'linked-draft-id': ['/readme.md'],
    })
    await renderQvain({
      draftOverrides: {
        // only draft has files
        fileset: {
          csc_project: 'testproject',
          storage_service: 'ida',
          total_files_count: 1,
          total_files_size: 1024,
        },
      },
      initialPath: '/dataset/linked-draft-id',
    })

    await userEvent.click(screen.getByTestId('open-add-files'))
    const modal = screen.getByRole('dialog')
    await userEvent.click(within(modal).getByTestId('select-/data/'))
    await userEvent.click(within(modal).getByRole('button', { name: 'Add files' }))

    const submitButton = screen.getByRole('button', { name: 'Save as draft' })
    await userEvent.click(submitButton) // should submit data to metax
    const fileset = JSON.parse(mockAdapter.history.patch[0].data).fileset
    expect(fileset).toEqual({
      directory_actions: [{ action: 'add', pathname: '/data/' }],
      file_actions: [],
      storage_service: 'ida',
      csc_project: 'testproject',
    })
  })

  it('allows adding files to published cumulative dataset', async () => {
    filesMock.setDatasetFiles({
      [dataset.id]: ['/readme.md'],
    })
    await renderQvain({
      overrides: {
        cumulative_state: 1,
        fileset: {
          csc_project: 'testproject',
          storage_service: 'ida',
          total_files_count: 1,
          total_files_size: 1024,
        },
      },
    })

    await userEvent.click(screen.getByTestId('open-add-files'))
    const modal = screen.getByRole('dialog')

    expect(screen.queryByTestId('select-/readme.md')).not.toBeInTheDocument() // already added
    await userEvent.click(within(modal).getByTestId('select-/data/'))
    await userEvent.click(within(modal).getByRole('button', { name: 'Add files' }))

    const submitButton = screen.getByRole('button', { name: 'Save as draft' })
    await userEvent.click(submitButton) // should submit data to metax
    const fileset = JSON.parse(mockAdapter.history.patch[0].data).fileset
    expect(fileset).toEqual({
      file_actions: [],
      directory_actions: [{ action: 'add', pathname: '/data/' }],
      storage_service: 'ida',
      csc_project: 'testproject',
    })
  })

  it('prevents adding files to draft of noncumulative dataset that was published with files', async () => {
    filesMock.setDatasetFiles({
      [dataset.id]: ['/readme.md'],
      'linked-draft-id': ['/readme.md'],
    })
    const overrides = {
      fileset: {
        csc_project: 'testproject',
        storage_service: 'ida',
        total_files_count: 1,
        total_files_size: 1024,
      },
    }
    await renderQvain({
      overrides,
      initialPath: '/dataset/linked-draft-id',
    })

    expect(screen.queryByTestId('open-add-files')).not.toBeInTheDocument()
  })
})
