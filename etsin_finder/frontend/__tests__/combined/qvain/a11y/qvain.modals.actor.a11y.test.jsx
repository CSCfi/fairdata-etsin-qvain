import React from 'react'
import { mount } from 'enzyme'
import { configure } from 'mobx'
import axios from 'axios'
import ReactModal from 'react-modal'
import { ThemeProvider } from 'styled-components'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

import '../../../../locale/translations'
import etsinTheme from '../../../../js/styles/theme'
import { ENTITY_TYPE } from '../../../../js/utils/constants'
import ActorModal from '../../../../js/components/qvain/fields/actors/modal'
import Env from '../../../../js/stores/domain/env'
import QvainStoreClass from '../../../../js/stores/view/qvain'
import { Actor } from '../../../../js/stores/view/qvain/qvain.actors'
import LocaleStore from '../../../../js/stores/view/locale'
import organizationMockGet, {
  dataset as actorsDataset,
} from '../../../__testdata__/qvain.actors.data'
import { useStores, StoresProvider } from '../../../../js/stores/stores'

global.Promise = require('bluebird')

// Make sure MobX store values are not mutated outside actions.
configure({
  enforceActions: 'always',
})

jest.mock('axios')

jest.mock('../../../../js/stores/stores', () => {
  const useStores = jest.fn()

  return {
    ...jest.requireActual('../../../../js/stores/stores'),
    useStores,
  }
})

const QvainStore = new QvainStoreClass(Env)
Env.Flags.setFlag('METAX_API_V2', true)
const stores = {
  Env,
  Qvain: QvainStore,
  Locale: LocaleStore,
}
beforeEach(() => {
  axios.get.mockReset()
  stores.Qvain.resetQvainStore()
  stores.Qvain.Actors.clearReferenceOrganizations()
  useStores.mockReturnValue(stores)
})

describe('Qvain.Actors modal', () => {
  let helper, wrapper

  beforeEach(async () => {
    axios.get.mockImplementation(organizationMockGet)
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
    expect(results).toHaveNoViolations()
  })

  it('organization modal is accessible', async () => {
    const { editActor, actors } = stores.Qvain.Actors
    editActor(actors.find(actor => actor.type === ENTITY_TYPE.ORGANIZATION))
    const results = await axe(helper)
    expect(results).toHaveNoViolations()
  })
})
