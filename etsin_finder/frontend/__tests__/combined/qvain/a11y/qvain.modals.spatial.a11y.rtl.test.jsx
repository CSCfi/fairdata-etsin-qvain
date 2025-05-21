import { configure } from 'mobx'
import axios from 'axios'
import ReactModal from 'react-modal'
import { ThemeProvider } from 'styled-components'
import { axe } from 'jest-axe'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import etsinTheme from '../../../../js/styles/theme'
import dataset from '../../../__testdata__/dataset.att'
import { getReferenceData } from '../../../__testdata__/referenceData.data'
import { useStores, StoresProvider } from '../../../../js/stores/stores'
import Spatial from '../../../../js/components/qvain/sections/Geographics/SpatialFieldContent'
import { buildStores } from '../../../../js/stores'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

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

describe('Spatial coverage modal', () => {
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
          <Spatial Store={stores} />
        </ThemeProvider>
      </StoresProvider>,
      { attachTo: helper }
    )

    await userEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0])
  }

  afterEach(() => {
    document.body.removeChild(helper)
  })

  it('is accessible', async () => {
    await renderModal()
    const dialog = screen.getByRole('dialog')
    const results = await axe(dialog)
    expect(results).toBeAccessible({ ignore: ['aria-hidden-focus'] })
  })
})
