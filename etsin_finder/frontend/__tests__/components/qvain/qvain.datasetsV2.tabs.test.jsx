import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import counterpart from 'counterpart'

import '@/../locale/translations'
import etsinTheme from '@/styles/theme'

import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import TabsStore from '../../../js/stores/view/qvain/tabs'
import Tabs from '@/components/qvain/views/datasetsV2/tabs'

let stores

const tabTranslations = { all: 'all tab', another: 'another tab' }

counterpart.registerTranslations('en', {
  test: { tabs: tabTranslations },
})

beforeEach(() => {
  stores = buildStores()
  stores.QvainDatasets.tabs = new TabsStore({ all: 'test.tabs.all', another: 'test.tabs.another' }, 'all')
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

  const findTabWithText = text =>
    wrapper.find('button').filterWhere(btn => {
      return btn.prop('children') === text
    })

  it('should initially show default tab', async () => {
    findTabWithText(tabTranslations.all).prop('aria-selected').should.be.true
    findTabWithText(tabTranslations.another).prop('aria-selected').should.not.be.true
  })

  it('should change tab', async () => {
    findTabWithText(tabTranslations.another).simulate('click')
    findTabWithText(tabTranslations.another).prop('aria-selected').should.be.true
    findTabWithText(tabTranslations.all).prop('aria-selected').should.not.be.true
  })
})
