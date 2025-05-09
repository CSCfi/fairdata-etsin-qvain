import React from 'react'
import { axe } from 'jest-axe'
import { render } from '@testing-library/react'

import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import Footer from '../../../../js/layout/footer'

describe('Footer', () => {
  it('should be accessible', async () => {
    const stores = buildStores()
    const { container } = render(
      <StoresProvider store={stores}>
        <Footer />
      </StoresProvider>
    )

    const results = await axe(container)
    expect(results).toBeAccessible()
  })
})
