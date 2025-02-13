import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { axe } from 'jest-axe'
import ReactModal from 'react-modal'

import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import etsinTheme from '@/styles/theme'
import dataset from '../../../__testdata__/metaxv3/datasets/dataset_att_a'
import Contact from '@/components/etsin/Dataset/contact'
import Modal from '@/components/general/modal'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'


const emailInfo = {
  CONTRIBUTOR: true,
  CREATOR: true,
  CURATOR: true,
  PUBLISHER: true,
  RIGHTS_HOLDER: true,
}

const registerMissingTranslationHandler = failTestsWhenTranslationIsMissing()

describe('Etsin contact modal', () => {
  let wrapper, helper

  beforeAll(async () => {
    const stores = buildStores()
    registerMissingTranslationHandler(stores.Locale)
    stores.Etsin.EtsinDataset.set('dataset', dataset)
    stores.Etsin.EtsinDataset.set('emails', emailInfo)

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)
    wrapper = mount(
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <main>
            <Contact datasetID={dataset.identifier} emails={emailInfo} isRems={true} />
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
