import { configure } from 'mobx'
import axios from 'axios'
import ReactModal from 'react-modal'
import { ThemeProvider } from 'styled-components'
import { axe } from 'jest-axe'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { buildStores } from '../../../../js/stores'
import etsinTheme from '../../../../js/styles/theme'
import dataset from '../../../__testdata__/dataset.att'
import { getReferenceData } from '../../../__testdata__/referenceData.data'
import { useStores, StoresProvider } from '../../../../js/stores/stores'
import RelatedResource from '../../../../js/components/qvain/sections/Publications'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

jest.setTimeout(10000)

// Make sure MobX store values are not mutated outside actions.
configure({
  enforceActions: 'always',
})

jest.mock('axios')

jest.mock('../../../../js/stores/stores', () => {
  const useStoresMock = jest.fn()

  return {
    ...jest.requireActual('../../../../js/stores/stores'),
    useStores: useStoresMock,
  }
})

const stores = buildStores()
failTestsWhenTranslationIsMissing(stores.Locale)

beforeEach(() => {
  axios.get.mockReset()
  axios.get.mockImplementation(url => {
    const { pathname } = new URL(url, 'https://localhost')
    if (pathname.startsWith('/es/reference_data/')) {
      return Promise.resolve({ data: getReferenceData(url) })
    }
    return Promise.resolve({ data: undefined })
  })
  stores.Qvain.resetQvainStore()
  stores.Qvain.Actors.clearReferenceOrganizations()
  useStores.mockReturnValue(stores)
})

describe('Related resources modal', () => {
  let helper

  const renderModal = async () => {
    await stores.Qvain.editDataset(dataset)

    useStores.mockReturnValue(stores)

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    render(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <RelatedResource />
        </ThemeProvider>
      </StoresProvider>,
      { attachTo: helper }
    )

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
  }

  afterEach(() => {
    document.body.removeChild(helper)
  })

  it('is accessible', async () => {
    await renderModal()
    const results = await axe(screen.getByRole('dialog'))
    expect(results).toBeAccessible({ ignore: ['aria-hidden-focus'] })
  })
})
