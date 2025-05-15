import React from 'react'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter, Route } from 'react-router-dom'
import { axe } from 'jest-axe'
import ReactModal from 'react-modal'
import { observable, when } from 'mobx'
import MockAdapter from 'axios-mock-adapter'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'

import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import dataset, { contact } from '../../../__testdata__/metaxv3/datasets/dataset_att_a'
import Dataset from '@/components/etsin/Dataset'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

jest.setTimeout(25000) // the default 5000ms timeout is not always enough here

jest.mock('@/components/etsin/Dataset/Sidebar/special/importImages')

jest.mock('@/stores/view/accessibility')

const datasetsCalls = observable.array([])

const mockAdapter = new MockAdapter(axios)
mockAdapter.onGet(`https:///v3/datasets/${dataset.id}`).reply(args => {
  datasetsCalls.push(JSON.parse(JSON.stringify(args)))
  return [200, dataset]
})

mockAdapter.onGet(`https:///v3/datasets/${dataset.id}/contact`).reply(args => {
  datasetsCalls.push(JSON.parse(JSON.stringify(args)))
  return [200, contact]
})

const identifier = dataset.id
const path = `/dataset/${identifier}`

const stores = buildStores()
failTestsWhenTranslationIsMissing(stores.Locale)
stores.Accessibility.handleNavigation = jest.fn()

describe('Etsin dataset page', () => {
  let helper

  const renderPage = async () => {
    jest.resetAllMocks()
    datasetsCalls.clear()

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    render(
      <StoresProvider store={stores}>
        <MemoryRouter initialEntries={[path]}>
          <ThemeProvider theme={etsinTheme}>
            <main>
              <label htmlFor="react-select-2-input"> dummy</label>
              {/* to silence react select falsy test fails */}
              <Route path="/dataset/:identifier" component={Dataset} />
            </main>
          </ThemeProvider>
        </MemoryRouter>
      </StoresProvider>,
      { attachTo: helper }
    )
    // wait for async tasks to finish
    await when(() => datasetsCalls.length >= 2)
    await screen.findByRole('article')
  }

  afterEach(() => {
    document.body.removeChild(helper)
  })

  it('should be accessible', async () => {
    await renderPage()
    const tab = screen.getByTestId('tab-description')
    const results = await axe(tab)
    expect(results).toBeAccessible()

    expect(stores.Accessibility.handleNavigation.mock.calls).toEqual([
      ['error'],
      ['dataset', false],
    ])
  })

  describe('Data tab (external resources)', () => {
    it('should be accessible', async () => {
      await renderPage()
      jest.resetAllMocks()
      await userEvent.click(document.querySelector('a#tab-for-data'))

      const tab = screen.getByTestId('tab-data')
      const results = await axe(tab)
      expect(results).toBeAccessible()

      expect(stores.Accessibility.handleNavigation.mock.calls).toEqual([['data', false]])
    })
  })

  describe('Events tab', () => {
    it('should be accessible', async () => {
      await renderPage()
      jest.resetAllMocks()
      await userEvent.click(document.querySelector('a#tab-for-events'))

      const tab = screen.getByTestId('tab-events')
      const results = await axe(tab)
      expect(results).toBeAccessible()

      expect(stores.Accessibility.handleNavigation.mock.calls).toEqual([['events', false]])
    })
  })

  describe('Maps tab', () => {
    it('should be accessible', async () => {
      await renderPage()
      jest.resetAllMocks()
      await userEvent.click(document.querySelector('a#tab-for-maps'))

      const tab = screen.getByTestId('tab-maps')
      const results = await axe(tab)
      expect(results).toBeAccessible()

      expect(stores.Accessibility.handleNavigation.mock.calls).toEqual([['maps', false]])
    })
  })
})
