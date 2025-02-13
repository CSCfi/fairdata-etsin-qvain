import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter, Route } from 'react-router-dom'
import { axe } from 'jest-axe'
import ReactModal from 'react-modal'
import { observable, runInAction, when } from 'mobx'
import MockAdapter from 'axios-mock-adapter'
import { setImmediate } from 'timers'

import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import dataset, { contact } from '../../../__testdata__/metaxv3/datasets/dataset_att_a'
import Dataset from '@/components/etsin/Dataset'
import Description from '@/components/etsin/Dataset/Description'
import Maps from '@/components/etsin/Dataset/maps'
import Events from '@/components/etsin/Dataset/events'
import ExternalResources from '@/components/etsin/Dataset/data/externalResources'
import axios from 'axios'
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

const flushPromises = () => new Promise(setImmediate)

describe('Etsin dataset page', () => {
  let wrapper, helper

  beforeAll(async () => {
    jest.resetAllMocks()
    datasetsCalls.clear()

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    wrapper = mount(
      <StoresProvider store={stores}>
        <MemoryRouter initialEntries={[path]}>
          <ThemeProvider theme={etsinTheme}>
            <main>
              <label htmlFor="react-select-2-input"> dummy</label>
              {/* to silence react select falsy test fails*/}
              <Route path="/dataset/:identifier" component={Dataset} />
            </main>
          </ThemeProvider>
        </MemoryRouter>
      </StoresProvider>,
      { attachTo: helper }
    )
    // wait for async tasks to finish
    await when(() => datasetsCalls.length >= 2)
    await flushPromises()
    wrapper.update()
  })

  afterAll(() => {
    wrapper?.unmount?.()
    document.body.removeChild(helper)
  })

  it('should render description tab', async () => {
    expect(wrapper.find(Description).length).toBe(1)
  })

  it('should be accessible', async () => {
    const results = await axe(wrapper.getDOMNode())
    expect(results).toBeAccessible()
  })

  it('should call Accessibility.handleNavigation for dataset', async () => {
    expect(stores.Accessibility.handleNavigation.mock.calls).toEqual([
      ['error'],
      ['dataset', false],
    ])
  })

  describe('Data tab (external resources)', () => {
    beforeAll(() => {
      jest.resetAllMocks()
      datasetsCalls.clear()

      wrapper.find('a#tab-for-data').simulate('click', { button: 0 })
    })

    it('should render external resources', async () => {
      expect(wrapper.find(ExternalResources).length).toBe(1)
    })

    it('should be accessible', async () => {
      const results = await axe(wrapper.getDOMNode())
      expect(results).toBeAccessible()
    })

    it('should call Accessibility.handleNavigation for data', async () => {
      expect(stores.Accessibility.handleNavigation.mock.calls).toEqual([['data', false]])
    })
  })

  describe('Events tab', () => {
    beforeAll(() => {
      jest.resetAllMocks()
      datasetsCalls.clear()

      wrapper.find('a#tab-for-events').simulate('click', { button: 0 })
    })

    it('should render events tab', async () => {
      expect(wrapper.find(Events).length).toBe(1)
    })

    it('should be accessible', async () => {
      const results = await axe(wrapper.getDOMNode())
      expect(results).toBeAccessible()
    })

    it('should call Accessibility.handleNavigation for data', async () => {
      expect(stores.Accessibility.handleNavigation.mock.calls).toEqual([['events', false]])
    })
  })

  describe('Maps tab', () => {
    beforeAll(() => {
      jest.resetAllMocks()
      runInAction(() => datasetsCalls.clear())

      wrapper.find('a#tab-for-maps').simulate('click', { button: 0 })
    })

    it('should render maps tab', async () => {
      expect(wrapper.find(Maps).length).toBe(1)
    })

    it('should be accessible', async () => {
      const results = await axe(wrapper.getDOMNode())
      expect(results).toBeAccessible()
    })

    it('should call Accessibility.handleNavigation for maps', async () => {
      expect(stores.Accessibility.handleNavigation.mock.calls).toEqual([['maps', false]])
    })
  })
})
