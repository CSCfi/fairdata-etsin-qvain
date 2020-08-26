import React from 'react'
import { shallow } from 'enzyme'
import axios from 'axios'

import '../locale/translations'
import { CUMULATIVE_STATE } from '../js/utils/constants'
import Env from '../js/stores/domain/env'
import QvainStoreClass from '../js/stores/view/qvain'
import Locale from '../js/stores/view/language'
import CumulativeState, {
  CumulativeStateButton,
} from '../js/components/qvain/files/cumulativeStateV2'

global.Promise = require('bluebird')

Promise.config({
  cancellation: true,
})

jest.mock('axios')
axios.get.mockImplementation((...args) => {})

const Qvain = new QvainStoreClass(Env)
const CumulativeStateBase = CumulativeState.wrappedComponent

Env.setMetaxApiV2(true)
const stores = {
  Env,
  Qvain,
  Locale,
}

const dataset = {
  identifier: 100,
  cumulative_state: CUMULATIVE_STATE.NO,
  research_dataset: {
    title: { en: 'title' },
    description: { en: 'description' },
    keywords: ['keyword'],
    dataCatalog: 'urn:nbn:fi:att:data-catalog-ida',
    actors: {
      type: 'organization',
      roles: ['creator'],
      organizations: [
        {
          name: {
            en: 'Test organization',
          },
        },
      ],
    },
    access_rights: {
      license: [
        {
          name: { en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)' },
          identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
        },
      ],
      accessType: {
        url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
      },
    },
  },
}

describe('Qvain CumulativeState', () => {
  beforeEach(() => {
    Qvain.resetQvainStore()
  })

  it('shows radio buttons for new dataset', () => {
    const component = shallow(<CumulativeStateBase Stores={stores} />)
    expect(component.find('#cumulativeStateNo').prop('checked')).toBe(true)
    expect(component.find('#cumulativeStateYes').prop('checked')).toBe(false)
  })

  it('shows radio buttons with state set to false for draft', async () => {
    const { editDataset } = Qvain
    await editDataset(dataset)
    const component = shallow(<CumulativeStateBase Stores={stores} />)
    expect(component.find('#cumulativeStateNo').prop('checked')).toBe(true)
    expect(component.find('#cumulativeStateYes').prop('checked')).toBe(false)
  })

  it('shows radio buttons with state set to true for draft', async () => {
    const { editDataset } = Qvain
    await editDataset({ ...dataset, cumulative_state: CUMULATIVE_STATE.YES })
    const component = shallow(<CumulativeStateBase Stores={stores} />)
    expect(component.find('#cumulativeStateNo').prop('checked')).toBe(false)
    expect(component.find('#cumulativeStateYes').prop('checked')).toBe(true)
  })

  it('does not show cumulation enabling button for published dataset', async () => {
    const { editDataset } = Qvain
    await editDataset({
      ...dataset,
      cumulative_state: CUMULATIVE_STATE.NO,
      draft_of: { identifier: 1 },
    })
    const component = shallow(<CumulativeStateBase Stores={stores} />)
    expect(component.find(CumulativeStateButton).length).toBe(0)

    await editDataset({
      ...dataset,
      cumulative_state: CUMULATIVE_STATE.CLOSED,
      draft_of: { identifier: 1 },
    })
    component.update()
    expect(component.find(CumulativeStateButton).length).toBe(0)
  })

  it('closes cumulation for published dataset', async () => {
    const { editDataset } = Qvain
    await editDataset({
      ...dataset,
      cumulative_state: CUMULATIVE_STATE.YES,
      draft_of: { identifier: 1 },
    })
    const component = shallow(<CumulativeStateBase Stores={stores} />)
    expect(component.find(CumulativeStateButton).length).toBe(1)

    // set cumulation to be closed
    component.find(CumulativeStateButton).simulate('click')
    component.update()
    expect(Qvain.cumulativeState).toBe(CUMULATIVE_STATE.YES)
    expect(Qvain.newCumulativeState).toBe(CUMULATIVE_STATE.CLOSED)

    // cancel close
    component.find(CumulativeStateButton).simulate('click')
    component.update()
    expect(Qvain.cumulativeState).toBe(CUMULATIVE_STATE.YES)
    expect(Qvain.newCumulativeState).toBe(CUMULATIVE_STATE.YES)
  })
})
