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
import Provenance from '../../../../js/components/qvain/sections/History'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

vi.setConfig({ testTimeout: 20000 })

// Make sure MobX store values are not mutated outside actions.
configure({
  enforceActions: 'always',
})

vi.mock('axios')

vi.mock('../../../../js/stores/stores', async () => {
  const useStoresMock = vi.fn()

  return {
    ...(await vi.importActual('@/stores/stores')),
    useStores: useStoresMock,
  }
})

const stores = buildStores()
stores.Auth.setUser({
  name: 'teppo',
  admin_organizations: [],
  available_admin_organizations: [{ id: 'org-1', pref_label: { en: 'Organization 1' } }],
  default_admin_organization: { id: 'org-1' },
})

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

describe('Provenance modal', () => {
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
          <Provenance />
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
