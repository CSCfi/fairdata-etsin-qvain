import axios from 'axios'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import ReactModal from 'react-modal'
import { render, screen } from '@testing-library/react'

import etsinTheme from '../../../../js/styles/theme'
import QvainContent from '../../../../js/components/qvain/views/main/index'
import { buildStores } from '../../../../js/stores'
import { StoresProvider } from '../../../../js/stores/stores'
import dataset from '../../../__testdata__/dataset.att'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

const stores = buildStores()

failTestsWhenTranslationIsMissing(stores.Locale)

global.fdweRecordEvent = () => {}

jest.mock('axios')

jest.setTimeout(40000) // the default 5000ms timeout is not always enough here

axios.get.mockReturnValue(
  Promise.resolve({
    data: {
      hits: {
        hits: [],
      },
    },
  })
)

describe('Qvain editor', () => {
  let helper

  const renderEditor = async () => {
    await stores.Qvain.editDataset(dataset)

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    render(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <main>
              <QvainContent />
            </main>
          </ThemeProvider>
        </BrowserRouter>
      </StoresProvider>,
      { attachTo: helper }
    )
  }

  afterEach(() => {
    document.body.removeChild(helper)
  })

  it('is accessible', async () => {
    await renderEditor()
    const results = await axe(screen.getByRole('main'))
    expect(results).toBeAccessible()
  })
})
