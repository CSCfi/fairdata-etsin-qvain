import React from 'react'
import { shallow, mount } from 'enzyme'
import axios from 'axios'

import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import etsinTheme from '../../../js/styles/theme'
import MockAdapter from 'axios-mock-adapter'

import { CUMULATIVE_STATE } from '../../../js/utils/constants'
import EnvClass from '../../../js/stores/domain/env'
import QvainClass from '../../../js/stores/view/qvain'
import LocaleClass from '../../../js/stores/view/locale'
import AccessibilityClass from '../../../js/stores/view/accessibility'

import CumulativeDataset, {
  CumulativeStateButton,
} from '../../../js/components/qvain/sections/DataOrigin/IdaCatalog/CumulativeDataset'
import { useStores, StoresProvider } from '../../../js/stores/stores'

const mockAdapter = new MockAdapter(axios)
mockAdapter.onGet().reply(200, {})

jest.mock('../../../js/stores/stores', () => {
  const useStores = jest.fn()

  return {
    ...jest.requireActual('../../../js/stores/stores'),
    useStores,
  }
})

const Env = new EnvClass()
const Qvain = new QvainClass(Env)
const Locale = new LocaleClass(Env)

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

describe('Qvain CumulativeDataset', () => {
  beforeEach(() => {
    useStores.mockReturnValue(stores)
    Qvain.resetQvainStore()
  })

  it('shows radio buttons for new dataset', () => {
    const component = shallow(<CumulativeDataset />, <StoresProvider store={stores} />)
    expect(component.find('#cumulativeStateNo').prop('checked')).toBe(true)
    expect(component.find('#cumulativeStateYes').prop('checked')).toBe(false)
  })

  it('shows radio buttons with state set to false for draft', async () => {
    const { editDataset } = Qvain
    await editDataset(dataset)
    const component = shallow(<CumulativeDataset />, <StoresProvider store={stores} />)
    expect(component.find('#cumulativeStateNo').prop('checked')).toBe(true)
    expect(component.find('#cumulativeStateYes').prop('checked')).toBe(false)
  })

  it('shows radio buttons with state set to true for draft', async () => {
    const { editDataset } = Qvain
    await editDataset({ ...dataset, cumulative_state: CUMULATIVE_STATE.YES })
    const component = shallow(<CumulativeDataset />, <StoresProvider store={stores} />)
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
    const component = shallow(<CumulativeDataset />, <StoresProvider store={stores} />)
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
    let component = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <CumulativeDataset />
          </ThemeProvider>
        </BrowserRouter>
      </StoresProvider>
    )
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
