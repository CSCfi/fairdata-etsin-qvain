import React from 'react'
import { mount } from 'enzyme'
import { configure } from 'mobx'
import axios from 'axios'
import ReactModal from 'react-modal'
import { ThemeProvider } from 'styled-components'
import { axe } from 'jest-axe'
import MockAdapter from 'axios-mock-adapter'

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
  const useStores = jest.fn()

  return {
    ...jest.requireActual('../../../../js/stores/stores'),
    useStores,
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
  let helper, wrapper

  beforeEach(async () => {
    mockAdapter.onGet().reply(({ url }) => {
      return [200, organizationMockGet(url)]
    })
    await stores.Qvain.editDataset(actorsDataset)
    stores.Qvain.Actors.editActor(Actor())

    useStores.mockReturnValue(stores)

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    wrapper = mount(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <ActorModal />
        </ThemeProvider>
      </StoresProvider>,
      { attachTo: helper }
    )
  })

  afterEach(() => {
    document.body.removeChild(helper)
    wrapper.unmount()
    wrapper.detach()
  })

  it('person modal is accessible', async () => {
    const { editActor, actors } = stores.Qvain.Actors
    editActor(actors.find(actor => actor.type === ENTITY_TYPE.PERSON))
    const results = await axe(helper)
    expect(results).toBeAccessible({ ignore: ['aria-hidden-focus'] })
  })

  it('organization modal is accessible', async () => {
    const { editActor, actors } = stores.Qvain.Actors
    editActor(actors.find(actor => actor.type === ENTITY_TYPE.ORGANIZATION))
    const results = await axe(helper)
    expect(results).toBeAccessible({ ignore: ['aria-hidden-focus'] })
  })
})
