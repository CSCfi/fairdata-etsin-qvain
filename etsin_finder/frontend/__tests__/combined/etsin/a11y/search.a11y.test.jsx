import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter, Route } from 'react-router-dom'
import { axe } from 'jest-axe'
import { observable } from 'mobx'
import { setImmediate } from 'timers'

import etsinTheme from '../../../../js/styles/theme'
import '../../../../locale/translations'
import { buildStores } from '../../../../js/stores'
import { StoresProvider } from '../../../../js/stores/stores'
import searchResults from '../../../__testdata__/searchResults.data'
import Search from '../../../../js/components/search'
import axios from 'axios'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

failTestsWhenTranslationIsMissing()

jest.setTimeout(45000) // the default 5000ms timeout is not always enough here

jest.mock('../../../../js/stores/view/accessibility')

jest.mock('axios')

const datasetsCalls = observable.array([])

const stores = buildStores()

stores.Env.history = {
  location: {
    search:
      '?keys=Funding%20Organization&terms=organization_name_en.keyword&p=1&sort=best&pas=false',
  },
}

const path = `/datasets/some%20dataset`

stores.Accessibility.handleNavigation = jest.fn()

const flushPromises = () => new Promise(setImmediate)

describe('Etsin search page', () => {
  let wrapper

  beforeAll(async () => {
    jest.resetAllMocks()
    datasetsCalls.clear()

    axios.post.mockReturnValue(
      Promise.resolve({
        data: searchResults,
      })
    )

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

  afterAll(() => {
    wrapper?.unmount?.()
  })

  it('should be accessible', async () => {
    const results = await axe(wrapper.getDOMNode())
    expect(results).toBeAccessible({ ignore: ['identical-links-same-purpose'] })
  })

  it('should call Accessibility.handleNavigation for datasets', async () => {
    expect(stores.Accessibility.handleNavigation.mock.calls).toEqual([['datasets']])
  })
})
