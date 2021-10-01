import React from 'react'
import { mount } from 'enzyme'

import { axe, toHaveNoViolations } from 'jest-axe'

import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'

import '@/../locale/translations'
import etsinTheme from '@/styles/theme'

import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import DatasetsV2 from '@/components/qvain/views/datasetsV2'

expect.extend(toHaveNoViolations)

let stores

beforeEach(() => {
  stores = buildStores()
  stores.Auth.setUser({
    name: 'teppo',
  })
  stores.Env.Flags.setFlag('UI.NEW_DATASETS_VIEW', true)
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
    const results = await axe(wrapper.getDOMNode(), { rules: { region: { enabled: false } } })
    expect(results).toHaveNoViolations()
  })
})
