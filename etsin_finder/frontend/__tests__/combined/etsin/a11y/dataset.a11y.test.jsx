import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter, Route } from 'react-router-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import ReactModal from 'react-modal'
import { observable, when } from 'mobx'

global.Promise = require('bluebird')

import etsinTheme from '../../../../js/styles/theme'
import '../../../../locale/translations'
import { buildStores } from '../../../../js/stores'
import { StoresProvider } from '../../../../js/stores/stores'
import dataset from '../../../__testdata__/dataset.att'
import Dataset from '../../../../js/components/dataset'
import Description from '../../../../js/components/dataset/description'
import Maps from '../../../../js/components/dataset/maps'
import Events from '../../../../js/components/dataset/events'
import ExternalResources from '../../../../js/components/dataset/data/externalResources'
import axios from 'axios'

jest.mock('../../../../js/components/dataset/sidebar/special/importImages', () => ({
  __esModule: true,
  default: () => {
    return { 'fairdata_tree_logo.svg': '/url/to/fairdata_tree_logo.svg' }
  },
}))

jest.mock('../../../../js/stores/view/accessibility')
expect.extend(toHaveNoViolations)

jest.mock('axios')

const datasetsCalls = observable.array([])

const mockGet = () => {
  axios.get = jest.fn((...args) => {
    datasetsCalls.push(JSON.parse(JSON.stringify(args)))
    return Promise.resolve({
      data: {
        catalog_record: dataset,
        email_info: {
          CONTRIBUTOR: false,
          CREATOR: false,
          CURATOR: false,
          PUBLISHER: false,
          RIGHTS_HOLDER: false,
        },
      },
    })
  })
}

const identifier = dataset.identifier
const path = `/dataset/${identifier}`

const stores = buildStores()
stores.Accessibility.handleNavigation = jest.fn()

const flushPromises = () => new Promise(setImmediate)

describe('Etsin dataset page', () => {
  let wrapper, helper

  beforeAll(async () => {
    jest.resetAllMocks()
    datasetsCalls.clear()
    mockGet()

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    wrapper = mount(
      <StoresProvider store={stores}>
        <MemoryRouter initialEntries={[path]}>
          <ThemeProvider theme={etsinTheme}>
            <main>
              <Route path="/dataset/:identifier" component={Dataset} />
            </main>
          </ThemeProvider>
        </MemoryRouter>
      </StoresProvider>,
      { attachTo: helper }
    )

    // wait for async tasks to finish
    await when(() => datasetsCalls.length >= 1)
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
    expect(results).toHaveNoViolations()
  })

  it('should call Accessibility.handleNavigation for dataset', async () => {
    expect(stores.Accessibility.handleNavigation.mock.calls).toEqual([['dataset', false]])
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
      expect(results).toHaveNoViolations()
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
      expect(results).toHaveNoViolations()
    })

    it('should call Accessibility.handleNavigation for data', async () => {
      expect(stores.Accessibility.handleNavigation.mock.calls).toEqual([['events', false]])
    })
  })

  describe('Maps tab', () => {
    beforeAll(() => {
      jest.resetAllMocks()
      datasetsCalls.clear()
      wrapper.find('a#tab-for-maps').simulate('click', { button: 0 })
    })

    it('should render maps tab', async () => {
      expect(wrapper.find(Maps).length).toBe(1)
    })

    it('should be accessible', async () => {
      const results = await axe(wrapper.getDOMNode())
      expect(results).toHaveNoViolations()
    })

    it('should call Accessibility.handleNavigation for maps', async () => {
      expect(stores.Accessibility.handleNavigation.mock.calls).toEqual([['maps', false]])
    })
  })
})
