import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'

import etsinTheme from '@/styles/theme'

import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import TabsStore from '../../../js/stores/view/qvain/tabs'
import Tabs from '@/components/qvain/views/datasetsV2/tabs'

let stores

beforeEach(() => {
  stores = buildStores()
  stores.Locale.setMissingTranslationHandler(key => key)
  stores.QvainDatasets.tabs = new TabsStore(
    { all: 'test.tabs.all', another: 'test.tabs.another' },
    'all'
  )
})

describe('Datasets Tabs', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <Tabs />
          </ThemeProvider>
        </BrowserRouter>
      </StoresProvider>
    )
  })

  afterEach(() => {
    wrapper?.unmount?.()
  })

  const findTabWithText = text => {
    return wrapper.find('button').filterWhere(btn => {
      return btn.prop('children') === text
    })
  }

  it('should initially show default tab', async () => {
    findTabWithText("test.tabs.all").prop('aria-selected').should.be.true
    findTabWithText("test.tabs.another").prop('aria-selected').should.not.be.true
  })

  it('should change tab', async () => {
    findTabWithText("test.tabs.another").simulate('click')
    findTabWithText("test.tabs.another").prop('aria-selected').should.be.true
    findTabWithText("test.tabs.all").prop('aria-selected').should.not.be.true
  })
})
