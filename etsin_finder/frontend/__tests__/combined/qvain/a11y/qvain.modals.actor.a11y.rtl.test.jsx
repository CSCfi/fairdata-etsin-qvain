import { configure } from 'mobx'
import axios from 'axios'
import ReactModal from 'react-modal'
import { ThemeProvider } from 'styled-components'
import { axe } from 'jest-axe'
import MockAdapter from 'axios-mock-adapter'
import { render, screen } from '@testing-library/react'

import { buildStores } from '../../../../js/stores'
import etsinTheme from '../../../../js/styles/theme'
import { ENTITY_TYPE } from '../../../../js/utils/constants'
import ActorModal from '../../../../js/components/qvain/sections/Actors/Modal'
import { Actor } from '../../../../js/stores/view/qvain/qvain.actors'
import organizationMockGet, {
  dataset as actorsDataset,
} from '../../../__testdata__/qvain.actors.data'
import { useStores, StoresProvider } from '../../../../js/stores/stores'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

jest.setTimeout(10000)

const mockAdapter = new MockAdapter(axios)

// Make sure MobX store values are not mutated outside actions.
configure({
  enforceActions: 'always',
})

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
