import React from 'react'
import { mount } from 'enzyme'
import { configure } from 'mobx'
import axios from 'axios'
import ReactModal from 'react-modal'
import { ThemeProvider } from 'styled-components'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

import '../../../../locale/translations'
import { buildStores } from '../../../../js/stores'
import etsinTheme from '../../../../js/styles/theme'
import dataset from '../../../__testdata__/dataset.att'
import { getReferenceData } from '../../../__testdata__/referenceData.data'
import { useStores, StoresProvider } from '../../../../js/stores/stores'
import Provenance from '../../../../js/components/qvain/fields/history/provenance/ProvenanceFieldContent'
import { EditButton } from '../../../../js/components/qvain/general/buttons/iconButtons'
import Modal from '../../../../js/components/general/modal'

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

const stores = buildStores()
stores.Env.Flags.setFlag('METAX_API_V2', true)

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
  let helper, wrapper

  beforeEach(async () => {
    await stores.Qvain.editDataset(dataset)

    useStores.mockReturnValue(stores)

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    wrapper = mount(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <Provenance />
        </ThemeProvider>
      </StoresProvider>,
      { attachTo: helper }
    )

    wrapper.find(EditButton).first().simulate('click')
    wrapper.update()
  })

  afterEach(() => {
    document.body.removeChild(helper)
    wrapper.unmount()
    wrapper.detach()
  })

  it('is open', async () => {
    expect(wrapper.find(Modal).prop('isOpen')).toBe(true)
  })

  it('is accessible', async () => {
    const results = await axe(helper)
    expect(results).toHaveNoViolations()
  })
})
