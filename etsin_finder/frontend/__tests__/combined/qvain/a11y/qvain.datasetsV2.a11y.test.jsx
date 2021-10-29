import React from 'react'
import { mount } from 'enzyme'
import { when } from 'mobx'
import axios from 'axios'

import { axe } from 'jest-axe'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'

import '@/../locale/translations'
import etsinTheme from '@/styles/theme'
import datasets from '../../../__testdata__/qvain.datasets'
import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import DatasetsV2 from '@/components/qvain/views/datasetsV2'

let stores

jest.setTimeout(25000) // the default 5000ms timeout is not always enough here

beforeEach(() => {
  stores = buildStores()
  stores.Auth.setUser({
    name: 'teppo',
  })
  stores.Env.Flags.setFlag('UI.NEW_DATASETS_VIEW', true)
})

jest.mock('axios')
axios.get = jest.fn((...args) => {
  return Promise.resolve({
    data: datasets,
  })
})

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
