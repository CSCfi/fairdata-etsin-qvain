import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import ReactModal from 'react-modal'
import axios from 'axios'
import { when } from 'mobx'

import etsinTheme from '../../../../js/styles/theme'
import '../../../../locale/translations'
import QvainDatasets from '../../../../js/components/qvain/views/datasets'
import RemoveModal from '../../../../js/components/qvain/views/datasets/removeModal'
import { MoreButton } from '../../../../js/components/qvain/views/datasets/datasetGroup'
import { buildStores } from '../../../../js/stores'
import { StoresProvider } from '../../../../js/stores/stores'
import datasets from '../../../__testdata__/qvain.datasets'

let stores

beforeEach(() => {
  stores = buildStores()
  stores.Auth.setUser({
    name: 'teppo',
  })
})

jest.mock('axios')
axios.get = jest.fn((...args) => {
  return Promise.resolve({
    data: datasets,
  })
})

describe('Qvain datasets page', () => {
  let wrapper

  beforeEach(async () => {
    stores.QvainDatasets.setDatasetsPerPage(6)
    wrapper = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <main>
              <QvainDatasets />
            </main>
          </ThemeProvider>
        </BrowserRouter>
      </StoresProvider>
    )
    // wait until datasets have been fetched
    await when(() => stores.QvainDatasets.datasetGroupsOnPage.length > 0)
    wrapper.update()

    // show more versions
    wrapper.find(MoreButton).simulate('click')
  })

  afterEach(() => {
    wrapper?.unmount?.()
  })

  it('is accessible', async () => {
    const results = await axe(wrapper.getDOMNode())
    expect(results).toBeAccessible()
  })
})

describe('Qvain dataset removal modal', () => {
  let wrapper, helper
  const dataset = {
    next_draft: {
      identifier: 'x',
    },
  }

  beforeEach(async () => {
    stores.QvainDatasets.removeModal.open({
      dataset,
      onlyChanges: false,
      postRemoveCallback: jest.fn(),
    })
    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    wrapper = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <RemoveModal />
          </ThemeProvider>
        </BrowserRouter>
      </StoresProvider>,
      { attachTo: helper }
    )
  })

  afterEach(() => {
    wrapper?.unmount?.()
    document.body.removeChild(helper)
  })

  it('is accessible', async () => {
    const results = await axe(wrapper.getDOMNode())
    expect(results).toBeAccessible()
  })
})
