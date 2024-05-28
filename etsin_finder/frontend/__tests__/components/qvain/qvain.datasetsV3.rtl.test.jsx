import React from 'react'
import { when } from 'mobx'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { ThemeProvider } from 'styled-components'
import { MemoryRouter, Route } from 'react-router-dom'
import ReactModal from 'react-modal'

import '@/../locale/translations'
import etsinTheme from '@/styles/theme'
import datasets from '../../__testdata__/qvain.datasets.v3'
import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import EnvClass from '@/stores/domain/env'
import DatasetsV2 from '@/components/qvain/views/datasetsV2'

const mockAdapter = new MockAdapter(axios)

let stores, helper, testLocation

beforeEach(() => {
  mockAdapter.reset()
  mockAdapter.onGet().reply(200, datasets)
})

const renderDatasets = async ({ showCount = null } = {}) => {
  if (helper) {
    document.body.removeChild(helper)
    helper = null
  }
  const Env = new EnvClass()
  Env.Flags.setFlag('QVAIN.METAX_V3.FRONTEND', true)
  Env.app = 'qvain'
  stores = buildStores({ Env })
  stores.Locale.setLang('en')
  stores.Auth.setUser({
    name: 'teppo',
  })
  if (showCount) {
    stores.QvainDatasets.setShowCount(showCount)
  }

  helper = document.createElement('div')
  document.body.appendChild(helper)
  ReactModal.setAppElement(helper)
  render(
    <StoresProvider store={stores}>
      <MemoryRouter>
        <Route
          path="*"
          render={({ location }) => {
            testLocation = location
            return null
          }}
        />
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
})
