import { ThemeProvider } from 'styled-components'
import { axe } from 'jest-axe'
import ReactModal from 'react-modal'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { MemoryRouter } from 'react-router'
import { render, screen } from '@testing-library/react'

import etsinTheme from '../../../../js/styles/theme'
import { buildStores } from '../../../../js/stores'
import { StoresProvider } from '../../../../js/stores/stores'
import FrontPage from '../../../../js/components/etsin/FrontPage'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

const stores = buildStores()
failTestsWhenTranslationIsMissing(stores.Locale)

const mockAdapter = new MockAdapter(axios)
mockAdapter.onGet().reply(200, { count: 1 })
mockAdapter.onPost().reply(200, {
  aggregations: {
    distinct_keywords: { value: 2 },
    distinct_fieldsofscience: { value: 3 },
    distinct_projects: { value: 4 },
  },
})

jest.mock('../../../../js/stores/view/accessibility')
const mockLocation = {
  pathname: '/',
}

describe('Etsin frontpage', () => {
  let helper

  const renderPage = async () => {
    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    render(
      <StoresProvider store={stores}>
        <MemoryRouter>
          <ThemeProvider theme={etsinTheme}>
            <main>
              <FrontPage location={mockLocation} />
            </main>
          </ThemeProvider>
        </MemoryRouter>
      </StoresProvider>,
      { attachTo: helper }
    )
  }

  afterEach(() => {
    document.body.removeChild(helper)
  })

  it('should be accessible', async () => {
    renderPage()
    const results = await axe(screen.getByRole('main'))
    expect(results).toBeAccessible()
  })
})
