import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import React from 'react'

import MockAdapter from 'axios-mock-adapter'

import { contextRenderer } from '@/../__tests__/test-helpers'
import EnvClass from '../../../js/stores/domain/env'
import LocaleClass from '../../../js/stores/view/locale'
import QvainClass from '../../../js/stores/view/qvain'
import { CUMULATIVE_STATE } from '../../../js/utils/constants'

import CumulativeDataset from '../../../js/components/qvain/sections/DataOrigin/IdaCatalog/CumulativeDataset'
import { useStores } from '../../../js/stores/stores'

const mockAdapter = new MockAdapter(axios)
mockAdapter.onGet().reply(200, {})

jest.mock('../../../js/stores/stores', () => ({
  ...jest.requireActual('../../../js/stores/stores'),
  useStores: jest.fn(),
}))

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
    contextRenderer(<CumulativeDataset />, { stores })
    expect(document.querySelector('#cumulativeStateNo').hasAttribute('checked')).toBe(true)
    expect(document.querySelector('#cumulativeStateYes').hasAttribute('checked')).toBe(false)
  })

  it('shows radio buttons with state set to false for draft', async () => {
    const { editDataset } = Qvain
    await editDataset(dataset)
    contextRenderer(<CumulativeDataset />, { stores })
    expect(document.querySelector('#cumulativeStateNo').hasAttribute('checked')).toBe(true)
    expect(document.querySelector('#cumulativeStateYes').hasAttribute('checked')).toBe(false)
  })

  it('shows radio buttons with state set to true for draft', async () => {
    const { editDataset } = Qvain
    await editDataset({ ...dataset, cumulative_state: CUMULATIVE_STATE.YES })
    contextRenderer(<CumulativeDataset />, { stores })
    expect(document.querySelector('#cumulativeStateNo').hasAttribute('checked')).toBe(false)
    expect(document.querySelector('#cumulativeStateYes').hasAttribute('checked')).toBe(true)
  })

  it('does not show cumulation enabling button for published dataset', async () => {
    const { editDataset } = Qvain
    await editDataset({
      ...dataset,
      cumulative_state: CUMULATIVE_STATE.NO,
      draft_of: { identifier: 1 },
    })
    contextRenderer(<CumulativeDataset />, { stores })
    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    await editDataset({
      ...dataset,
      cumulative_state: CUMULATIVE_STATE.CLOSED,
      draft_of: { identifier: 1 },
    })
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('closes cumulation for published dataset', async () => {
    const { editDataset } = Qvain
    await editDataset({
      ...dataset,
      cumulative_state: CUMULATIVE_STATE.YES,
      draft_of: { identifier: 1 },
    })
    contextRenderer(<CumulativeDataset />, { stores })

    // set cumulation to be closed
    const button = screen.getByRole('button', { name: 'Turn non-cumulative' })
    await userEvent.click(button)
    expect(Qvain.cumulativeState).toBe(CUMULATIVE_STATE.YES)
    expect(Qvain.newCumulativeState).toBe(CUMULATIVE_STATE.CLOSED)

    // cancel close
    await userEvent.click(button)
    expect(Qvain.cumulativeState).toBe(CUMULATIVE_STATE.YES)
    expect(Qvain.newCumulativeState).toBe(CUMULATIVE_STATE.YES)
  })
})
