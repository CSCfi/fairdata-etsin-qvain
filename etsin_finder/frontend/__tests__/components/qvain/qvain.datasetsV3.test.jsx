import { when } from 'mobx'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { within, screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { ThemeProvider } from 'styled-components'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import ReactModal from 'react-modal'

import etsinTheme from '@/styles/theme'
import datasets from '../../__testdata__/qvain.datasets.v3'
import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import EnvClass from '@/stores/domain/env'
import DatasetsV2 from '@/components/qvain/views/datasetsV2'

const mockAdapter = new MockAdapter(axios)

let stores, helper, testLocation

// Combine arrays of same length, e.g. [1, 2, 3], ['a', 'b', 'c'] -> [[1, 'a'], ...]
const zip = (a, b) => a.map((k, i) => [k, b[i]])

beforeEach(() => {
  mockAdapter.reset()
  mockAdapter.onGet('https://metaxv3:443/v3/datasets').reply(200, datasets)
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
  await when(() => stores.QvainDatasets.datasetGroups.length > 0 || stores.QvainDatasets.error)
}

describe('DatasetsV3', () => {
  describe('given error', () => {
    let spy

    beforeEach(() => {
      // hide errors from console
      spy = jest.spyOn(console, 'error').mockImplementation(() => {})
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

  it('should show dataset permissions in modal', async () => {
    mockAdapter.onGet('https://metaxv3:443/v3/datasets/7/permissions').reply(200, {
      creators: [
        {
          username: 'teppo',
          first_name: 'Teppo',
          last_name: 'Testaaja',
          email: 'teppo@example.com',
        },
      ],
      editors: [
        {
          username: 'toinen',
          first_name: 'Toinen',
          last_name: 'Tyyppi',
          email: 'toinen@example.com',
        },
      ],
    })

    await renderDatasets({ showCount: { initial: 1, current: 1, increment: 1 } })

    // Open editors modal,
    // the auto-hiding table buttons are aria-bidden so not available by role
    const editorsBtn = screen.getByText('Editors', { selector: 'button' })
    await userEvent.click(editorsBtn)
    const dialog = screen.getByRole('dialog')
    within(dialog).getByRole('heading', { name: 'Share metadata editing rights' })

    // Open members tab
    const membersBtn = within(dialog).getByRole('tab', { name: /Members/ })
    await userEvent.click(membersBtn)

    // Check members are listed correctly
    const getTexts = elems => Array.from(elems).map(elem => elem.textContent)
    const members = getTexts(document.querySelectorAll('.member-name'))
    const roles = getTexts(document.querySelectorAll('.member-role'))
    const membersRoles = zip(Array.from(members), Array.from(roles))
    expect(membersRoles).toEqual([
      ['Teppo Testaaja (teppo, teppo@example.com)', 'Creator'],
      ['Toinen Tyyppi (toinen, toinen@example.com)', 'Editor'],
    ])
  })
})
