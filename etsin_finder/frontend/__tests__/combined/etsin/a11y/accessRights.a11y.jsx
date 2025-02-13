import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { axe } from 'jest-axe'
import ReactModal from 'react-modal'

import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import dataset from '../../../__testdata__/metaxv3/datasets/dataset_att_a'
import AccessRights from '@/components/etsin/Dataset/accessRights'
import Modal from '@/components/general/modal'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'


jest.mock('@/stores/view/accessibility')
const stores = buildStores()
failTestsWhenTranslationIsMissing(stores.Locale)
stores.Etsin.EtsinDataset.set('dataset', dataset)

describe('Etsin access rights modal', () => {
  let wrapper, helper

  beforeAll(async () => {
    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    wrapper = mount(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <main>
            <AccessRights button />
          </main>
        </ThemeProvider>
      </StoresProvider>,
      { attachTo: helper }
    )
    wrapper.find('button').simulate('click')
  })

  afterAll(() => {
    wrapper?.unmount?.()
    document.body.removeChild(helper)
  })

  it('should be open', async () => {
    expect(wrapper.find(Modal).prop('isOpen')).toBe(true)
  })

  it('should be accessible', async () => {
    const results = await axe(wrapper.getDOMNode())
    expect(results).toBeAccessible()
  })
})
