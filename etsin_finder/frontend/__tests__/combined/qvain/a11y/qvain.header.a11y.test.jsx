import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { axe, toHaveNoViolations } from 'jest-axe'

import etsinTheme from '../../../../js/styles/theme'
import '../../../../locale/translations'
import stores from '../../../../js/stores'
import { StoresProvider } from '../../../../js/stores/stores'
import QvainHeader from '../../../../js/components/qvain/general/header'

expect.extend(toHaveNoViolations)

describe('Qvain header', () => {
  let wrapper

  beforeAll(async () => {
    wrapper = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <header>
              <QvainHeader />
            </header>
          </ThemeProvider>
        </BrowserRouter>
      </StoresProvider>
    )
  })

  afterAll(() => {
    jest.resetAllMocks()
    wrapper?.unmount?.()
  })

  it('should be accessible', async () => {
    const results = await axe(wrapper.getDOMNode())
    expect(results).toHaveNoViolations()
  })
})
