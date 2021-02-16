import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import ReactModal from 'react-modal'
import axios from 'axios'
import { observable, when } from 'mobx'

import etsinTheme from '../../../../js/styles/theme'
import '../../../../locale/translations'
import QvainDatasets from '../../../../js/components/qvain/views/datasets'
import RemoveModal from '../../../../js/components/qvain/views/datasets/removeModal'
import { MoreButton } from '../../../../js/components/qvain/views/datasets/datasetGroup'
import stores from '../../../../js/stores'
import { StoresProvider } from '../../../../js/stores/stores'
import datasets from '../../../__testdata__/qvain.datasets'

global.Promise = require('bluebird')

expect.extend(toHaveNoViolations)

stores.Auth.setUser({
  name: 'teppo',
})

const datasetsCalls = observable.array([])

jest.mock('axios')
axios.get = jest.fn((...args) => {
  datasetsCalls.push(JSON.parse(JSON.stringify(args)))
  return Promise.resolve({
    data: datasets,
  })
})

describe('Qvain datasets page', () => {
  let wrapper

  beforeEach(async () => {
    datasetsCalls.clear()
    stores.QvainDatasets.setDatasetsPerPage(5)
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
    await when(() => datasetsCalls.length > 0)
    wrapper.update()

    // show more versions
    wrapper.find(MoreButton).simulate('click')
  })

  afterEach(() => {
    wrapper?.unmount?.()
  })

  it('is accessible', async () => {
    const results = await axe(wrapper.getDOMNode())
    expect(results).toHaveNoViolations()
  })
})

describe('Qvain dataset removal modal', () => {
  let wrapper, helper
  const dataset = {
    next_draft: {
      identifier: 'x',
    },
  }

  const nop = () => {}

  beforeEach(async () => {
    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    datasetsCalls.clear()
    wrapper = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <RemoveModal dataset={dataset} onClose={nop} postRemoveUpdate={nop} />
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
    expect(results).toHaveNoViolations()
  })
})
