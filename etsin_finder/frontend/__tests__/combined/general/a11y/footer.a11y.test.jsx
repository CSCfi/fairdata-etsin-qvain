import React from 'react'
import { mount } from 'enzyme'
import { axe, toHaveNoViolations } from 'jest-axe'

import '../../../../locale/translations'
import Footer from '../../../../js/layout/footer'

expect.extend(toHaveNoViolations)

describe('Footer', () => {
  let wrapper

  beforeAll(async () => {
    wrapper = mount(<Footer />)
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
