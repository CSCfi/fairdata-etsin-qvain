import { configure } from 'mobx'
import axios from 'axios'
import ReactModal from 'react-modal'
import { ThemeProvider } from 'styled-components'
import { axe } from 'jest-axe'
import MockAdapter from 'axios-mock-adapter'
import { render, screen } from '@testing-library/react'

import { buildStores } from '@/stores'
import etsinTheme from '@/styles/theme'
import { ENTITY_TYPE } from '@/utils/constants'
import ActorModal from '@/components/qvain/sections/Actors/Modal'
import { Actor } from '@/stores/view/qvain/qvain.actors'
import organizationMockGet, { dataset as actorsDataset } from '@testdata/qvain.actors.data'
import { useStores, StoresProvider } from '@/stores/stores'
import { failTestsWhenTranslationIsMissing } from '@helpers'

vi.setConfig({ testTimeout: 10000 })

const mockAdapter = new MockAdapter(axios)

// Make sure MobX store values are not mutated outside actions.
configure({
  enforceActions: 'always',
})

vi.mock('@/stores/stores', async () => {
  const useStoresMock = vi.fn()

  return {
    ...(await vi.importActual('@/stores/stores')),
    useStores: useStoresMock,
  }
})

const stores = buildStores()
failTestsWhenTranslationIsMissing(stores.Locale)

beforeEach(() => {
  stores.Qvain.resetQvainStore()
  stores.Qvain.Actors.clearReferenceOrganizations()
  useStores.mockReturnValue(stores)
})

describe('Qvain.Actors modal', () => {
  let helper

  const renderModal = async () => {
    mockAdapter.onGet().reply(({ url }) => [200, organizationMockGet(url)])
    await stores.Qvain.editDataset(actorsDataset)
    stores.Qvain.Actors.editActor(Actor())

    useStores.mockReturnValue(stores)

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    render(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <ActorModal />
        </ThemeProvider>
      </StoresProvider>,
      { attachTo: helper }
    )
  }

  afterEach(() => {
    document.body.removeChild(helper)
  })

  it('person modal is accessible', async () => {
    await renderModal()
    const { editActor, actors } = stores.Qvain.Actors
    editActor(actors.find(actor => actor.type === ENTITY_TYPE.PERSON))
    const results = await axe(screen.getByRole('dialog'))
    expect(results).toBeAccessible({ ignore: ['aria-hidden-focus'] })
  })

  it('organization modal is accessible', async () => {
    await renderModal()
    const { editActor, actors } = stores.Qvain.Actors
    editActor(actors.find(actor => actor.type === ENTITY_TYPE.ORGANIZATION))
    const results = await axe(screen.getByRole('dialog'))
    expect(results).toBeAccessible({ ignore: ['aria-hidden-focus'] })
  })
})
