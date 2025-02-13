import React from 'react'
import { mount } from 'enzyme'
import { axe } from 'jest-axe'

import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import Footer from '../../../../js/layout/footer'

describe('Footer', () => {
  let wrapper

  beforeAll(async () => {
    const stores = buildStores()
    wrapper = mount(
      <StoresProvider store={stores}>
        <Footer />
      </StoresProvider>
    )
  })

  afterAll(() => {
    jest.resetAllMocks()
    wrapper?.unmount?.()
  })

  it('should be accessible', async () => {
    const results = await axe(wrapper.getDOMNode())
    expect(results).toBeAccessible()
  })
})
