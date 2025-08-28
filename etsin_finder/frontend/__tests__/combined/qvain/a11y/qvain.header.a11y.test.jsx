import { BrowserRouter } from 'react-router'
import { axe } from 'jest-axe'
import { screen } from '@testing-library/react'

import { buildStores } from '../../../../js/stores'
import QvainHeader from '../../../../js/components/qvain/general/header'
import { contextRenderer, failTestsWhenTranslationIsMissing } from '../../../test-helpers'

const stores = buildStores()

failTestsWhenTranslationIsMissing(stores.Locale)

describe('Qvain header', () => {
  const renderHeader = () =>
    contextRenderer(
      <BrowserRouter>
        <header>
          <QvainHeader />
        </header>
      </BrowserRouter>,
      { stores }
    )

  it('should be accessible', async () => {
    await renderHeader()
    const results = await axe(screen.getByRole('banner'))
    expect(results).toBeAccessible()
  })
})
