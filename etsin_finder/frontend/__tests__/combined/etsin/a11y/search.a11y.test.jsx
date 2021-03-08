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
import stores from '../../../../js/stores'
import { StoresProvider } from '../../../../js/stores/stores'
import searchResults from '../../../__testdata__/searchResults.data'
import Search from '../../../../js/components/search'
import Accessibility from '../../../../js/stores/view/accessibility'
import axios from 'axios'

jest.mock('../../../../js/stores/view/accessibility')
expect.extend(toHaveNoViolations)

jest.mock('axios')

const datasetsCalls = observable.array([])

import Env from '../../../../js/stores/domain/env'
Env.history = {
  location: {
    search:
      '?keys=Funding%20Organization&terms=organization_name_en.keyword&p=1&sort=best&pas=false',
  },
}

const path = `/datasets/some%20dataset`

Accessibility.handleNavigation = jest.fn()

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
      </StoresProvider>,
    )
    await flushPromises()
    wrapper.update()
  })

  afterAll(() => {
    wrapper?.unmount?.()
  })

  it('should be accessible', async () => {
    const results = await axe(wrapper.getDOMNode())
    expect(results).toHaveNoViolations()
  })

  it('should call Accessibility.handleNavigation for datasets', async () => {
    expect(Accessibility.handleNavigation.mock.calls).toEqual([['datasets']])
  })
})
