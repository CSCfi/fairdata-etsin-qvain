import { when } from 'mobx'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { within, screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeProvider } from 'styled-components'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import ReactModal from 'react-modal'

import etsinTheme from '@/styles/theme'
import datasets from '../../__testdata__/qvain.datasets.v3'
import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import EnvClass from '@/stores/domain/env'
import DatasetsV2 from '@/components/qvain/views/datasetsV2'
import { tableToObjects } from '@helpers'

const mockAdapter = new MockAdapter(axios)

let stores, helper, testLocation

const setupMockAdapter = datasets => {
  mockAdapter.reset()
  mockAdapter.onGet('https://metaxv3:443/v3/datasets').reply(200, datasets)
  mockAdapter.onGet('https://metaxv3:443/v3/user').reply(200, {
    username: 'teppo',
    first_name: 'Teppo',
    last_name: 'Testaaja',
    email: 'teppo@example.com',
    admin_organizations: ['test.csc.fi'],
    available_admin_organizations: [{ id: 'test.csc.fi', pref_label: { en: 'Test Organization' } }],
    default_admin_organization: { id: 'test.csc.fi' },
  })
}

beforeEach(() => {
  setupMockAdapter(datasets)
})

const getStores = () => {
  const Env = new EnvClass()
  Env.setMetaxV3Host('metaxv3', 443)
  Env.Flags.setFlag('QVAIN.METAX_V3.FRONTEND', true)
  Env.app = 'qvain'
  const _stores = buildStores({ Env })
  _stores.Locale.setLang('en')
  _stores.Auth.setUser({
    name: 'teppo',
    first_name: 'Teppo',
    last_name: 'Testaaja',
    email: 'teppo@example.com',
    admin_organizations: [],
    available_admin_organizations: [{ id: 'test.csc.fi', pref_label: { en: 'Test Organization' } }],
    default_admin_organization: { id: 'test.csc.fi' },
  })
  return _stores
}

const CaptureLocation = () => {
  const location = useLocation()
  testLocation = location
  return null
}

const renderDatasets = async ({ showCount = null } = {}) => {
  if (helper) {
    document.body.removeChild(helper)
    helper = null
  }
  stores = getStores()
  if (showCount) {
    stores.QvainDatasets.setShowCount(showCount)
  }

  helper = document.createElement('div')
  document.body.appendChild(helper)
  ReactModal.setAppElement(helper)
  render(
    <StoresProvider store={stores}>
      <MemoryRouter>
        <Routes>
          <Route path="*" Component={CaptureLocation} />
        </Routes>
        <ThemeProvider theme={etsinTheme}>
          <DatasetsV2 />
        </ThemeProvider>
      </MemoryRouter>
    </StoresProvider>
  )
  // wait until datasets have been fetched
  await when(
    () =>
      stores.QvainDatasets.ownDatasets.datasets.length > 0 || stores.QvainDatasets.ownDatasets.error
  )
}

describe('DatasetsV3', () => {
  describe('given error', () => {
    let spy

    beforeEach(() => {
      // hide errors from console
      spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
      spy.mockRestore?.()
    })

    it('should reload datasets on error when button is clicked', async () => {
      mockAdapter.reset()
      mockAdapter.onGet().reply(500, 'this is not supposed to happen')
      await renderDatasets()
      mockAdapter.onGet().reply(200, datasets)
      await userEvent.click(screen.getByRole('button', { name: 'Reload' }))
      const groups = await screen.findAllByRole('rowgroup') // wait for a tbody to render
      expect(groups.length).toBe(8)
    })
  })

  it('should show datasets', async () => {
    await renderDatasets()
    for (const dataset of datasets) {
      expect(screen.getAllByText(dataset.title.en)[0]).toBeInTheDocument()
    }
  })

  it('when clicking "show more", should show more datasets', async () => {
    await renderDatasets({ showCount: { initial: 5, current: 5, increment: 1 } })
    await waitFor(() => expect(document.querySelectorAll('tbody').length).toBe(5))
    const showMore = screen.getByRole('button', { name: /Show more/ })
    await userEvent.click(showMore)
    await waitFor(() => expect(document.querySelectorAll('tbody').length).toBe(6))
    await userEvent.click(showMore)
    await waitFor(() => expect(document.querySelectorAll('tbody').length).toBe(7))
    expect(showMore).not.toBeInTheDocument()
  })

  it('when clicking "create new dataset", should redirect to /dataset', async () => {
    await renderDatasets()
    testLocation.pathname.should.eql('/')

    const createNewBtn = screen.getByRole('button', { name: 'Describe a dataset' })
    await userEvent.click(createNewBtn)
    testLocation.pathname.should.eql('/dataset')
  })

  it('should show label for PAS datasets', async () => {
    setupMockAdapter([
      {
        id: '30942031-abfc-41d1-ae82-d9d3a8f92d8a',
        data_catalog: 'urn:nbn:fi:att:data-catalog-pas',
        metadata_owner: {
          id: 'c183707a-dad5-402f-a3d5-42a9a5ff770f',
          user: {
            first_name: 'fd_user3_first',
            last_name: 'fd_user3_läst',
            organization: 'csc.fi',
            username: 'fd_user3',
            admin_organizations: [],
          },
          organization: 'csc.fi',
          admin_organization: 'csc.fi',
        },
        persistent_identifier: 'doi:10.82614/f5212244-bde3-4f81-9489-d912bdde234e',
        state: 'published',
        title: {
          en: 'PAS process running',
        },
        created: '2026-03-24T10:47:59Z',
        dataset_versions: [
          {
            id: '30942031-abfc-41d1-ae82-d9d3a8f92d8a',
            title: {
              en: 'PAS process running',
            },
            persistent_identifier: 'doi:10.82614/f5212244-bde3-4f81-9489-d912bdde234e',
            state: 'published',
            created: '2026-03-24T10:47:59Z',
            version: 1,
            preservation: {
              pas_package_created: false,
              pas_process_running: true,
            },
          },
        ],
      },
      {
        id: 'e66726f3-1090-4c53-a04c-51502c50d521',
        data_catalog: 'urn:nbn:fi:att:data-catalog-pas',
        metadata_owner: {
          id: 'c183707a-dad5-402f-a3d5-42a9a5ff770f',
          user: {
            first_name: 'fd_user3_first',
            last_name: 'fd_user3_läst',
            organization: 'csc.fi',
            username: 'fd_user3',
            admin_organizations: [],
          },
          organization: 'csc.fi',
          admin_organization: 'csc.fi',
        },
        persistent_identifier: 'doi:10.82614/e00b555d-7db3-4043-8c7f-16f8d97b63d2',
        state: 'published',
        title: {
          en: 'Dataset in PAS catalog',
        },
        created: '2026-03-24T09:44:31Z',
        dataset_versions: [
          {
            id: 'e66726f3-1090-4c53-a04c-51502c50d521',
            title: {
              en: 'Dataset in PAS catalog',
            },
            persistent_identifier: 'doi:10.82614/e00b555d-7db3-4043-8c7f-16f8d97b63d2',
            state: 'published',
            created: '2026-03-24T09:44:31Z',
            version: 1,
            preservation: {
              pas_package_created: false,
              pas_process_running: false,
            },
          },
        ],
      },
    ])

    await renderDatasets()

    const rows = tableToObjects(screen.getByRole('table')).map(dataset => [
      dataset.Title,
      dataset.Status,
    ])

    expect(rows).toEqual([
      ['PAS process running', 'Published, DPS processing'],
      ['Dataset in PAS catalog', 'Published, DPS'],
    ])

    const getMoreActions = async button => {
      // Extract action labels from popup menu
      await userEvent.click(button)
      const menu = within(screen.getByRole('table')).getByRole('menu')
      const actions = Array.from(menu.querySelectorAll('li')).map(li => li.textContent.trim())
      return actions
    }

    const moreButtons = screen.getAllByRole('button', { name: 'More' })
    // PAS process running -> no delete available
    expect(await getMoreActions(moreButtons[0])).toEqual([
      'View in Etsin',
      'Add editors',
      'Use as template',
    ])
    // PAS process not running -> delete available for organization admin
    expect(await getMoreActions(moreButtons[1])).toEqual([
      'View in Etsin',
      'Add editors',
      'Use as template',
      'Delete',
    ])
  })
})
