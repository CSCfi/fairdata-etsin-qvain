import React from 'react'
import { mount } from 'enzyme'
import { axe, toHaveNoViolations } from 'jest-axe'

import '../../../../locale/translations'
import CookiesNotification from '../../../../js/layout/cookiesNotification.jsx'

expect.extend(toHaveNoViolations)

describe('Cookies notification', () => {
  let wrapper

  beforeAll(async () => {
    wrapper = mount(<CookiesNotification />)
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
