import React from 'react'
import { mount } from 'enzyme'
import { when } from 'mobx'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { axe } from 'jest-axe'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'

import '@/../locale/translations'
import etsinTheme from '@/styles/theme'
import datasets from '../../../__testdata__/qvain.datasets'
import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import DatasetsV2 from '@/components/qvain/views/datasetsV2'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

failTestsWhenTranslationIsMissing()

let stores
const mockAdapter = new MockAdapter(axios)

jest.setTimeout(50000) // the default 5000ms timeout is not always enough here

beforeEach(() => {
  stores = buildStores()
  stores.Auth.setUser({
    name: 'teppo',
  })
  stores.Env.Flags.setFlag('UI.NEW_DATASETS_VIEW', true)
})

mockAdapter.onGet().reply(200, datasets)

describe('DatasetsV2', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <DatasetsV2 />
          </ThemeProvider>
        </BrowserRouter>
      </StoresProvider>
    )
  })

  afterEach(() => {
    wrapper?.unmount?.()
  })

  it('is accessible', async () => {
    // wait until datasets have been fetched
    await when(() => stores.QvainDatasets.datasetGroupsOnPage.length > 0)
    wrapper.update()

    const results = await axe(wrapper.getDOMNode(), { rules: { region: { enabled: false } } })
    expect(results).toBeAccessible()
  })
})
