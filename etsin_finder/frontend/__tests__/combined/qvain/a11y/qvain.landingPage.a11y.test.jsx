import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { axe, toHaveNoViolations } from 'jest-axe'

import etsinTheme from '../../../../js/styles/theme'
import '../../../../locale/translations'
import stores from '../../../../js/stores'
import { StoresProvider } from '../../../../js/stores/stores'
import LandingPage from '../../../../js/components/qvain/views/landingPage/index.jsx'
import Accessibility from '../../../../js/stores/view/accessibility'

jest.mock('../../../../js/stores/view/accessibility')
expect.extend(toHaveNoViolations)

describe('Qvain landing page', () => {
  let wrapper

  beforeAll(async () => {
    Accessibility.handleNavigation = jest.fn()
    wrapper = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <main>
              <LandingPage />
            </main>
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

  it.skip('should call Accessibility.handleNavigation', async () => {
    // maybe deprecated after stores refactor check it before merge to test
    expect(Accessibility.handleNavigation.mock.calls).toEqual([[]])
  })
})
