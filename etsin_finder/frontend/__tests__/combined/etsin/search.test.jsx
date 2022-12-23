import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter, Route } from 'react-router-dom'
import { observable } from 'mobx'
import MockAdapter from 'axios-mock-adapter'
import { setImmediate } from 'timers'

import etsinTheme from '@/styles/theme'
import '@/../locale/translations'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import searchResults from '../../__testdata__/searchResults.data'
import Search from '@/components/search'
import axios from 'axios'

jest.mock('@/stores/view/accessibility')

const datasetsCalls = observable.array([])

const getStores = () => {
  const stores = buildStores()
  stores.Env.history = {
    location: {
      search: '',
    },
  }
  return stores
}

const path = `/datasets/some%20dataset`

const flushPromises = () => new Promise(setImmediate)

describe('Etsin search page', () => {
  let wrapper

  beforeAll(async () => {
    jest.resetAllMocks()
    datasetsCalls.clear()
    const mock = new MockAdapter(axios)
    mock.onPost('/es/metax/dataset/_search').reply(200, searchResults)
    const stores = getStores()

    wrapper = mount(
      <StoresProvider store={stores}>
        <MemoryRouter initialEntries={[path]}>
          <ThemeProvider theme={etsinTheme}>
            <main>
              <Route path="/datasets/:query?" component={Search} />
            </main>
          </ThemeProvider>
        </MemoryRouter>
      </StoresProvider>
    )
    await flushPromises()
    wrapper.update()
  })

  it('should have filter button for DPS catalog', () => {
    const catalogFilterButtons = wrapper.find('ul[aria-label="Data Catalog"]').leafHostNodes()
    catalogFilterButtons.find('[children^="Fairdata PAS"]').should.have.lengthOf(1)
  })

  afterAll(() => {
    wrapper?.unmount?.()
  })
})
