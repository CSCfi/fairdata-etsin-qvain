import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { axe } from 'jest-axe'
import ReactModal from 'react-modal'
import axios from 'axios'
import { setImmediate } from 'timers'

import etsinTheme from '@/styles/theme'
import '../../../../locale/translations'
import { buildStores } from '@/stores'
import dataset from '../../../__testdata__/metaxv3/datasets/dataset_att_a'
import CitationModal from '@/components/etsin/Dataset/citation/citationModal'
import Modal from '@/components/general/modal'
import { useStores } from '@/stores/stores'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

failTestsWhenTranslationIsMissing()

const stores = buildStores()
stores.Etsin.EtsinDataset.set('dataset', dataset)

jest.mock('@/stores/stores', () => {
  const useStores = jest.fn()

  return {
    ...jest.requireActual('@/stores/stores'),
    useStores,
  }
})

axios.get = jest.fn(() => {
  return Promise.resolve({
    data: dataset,
  })
})

useStores.mockReturnValue(stores)

const flushPromises = () => new Promise(setImmediate)

describe('Etsin citation modal', () => {
  let wrapper, helper

  beforeAll(async () => {
    // wait for async tasks to finish
    await flushPromises()

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)
    wrapper = mount(
      <ThemeProvider theme={etsinTheme}>
        <main>
          <CitationModal />
        </main>
      </ThemeProvider>,
      { attachTo: helper }
    )
  })

  afterAll(() => {
    wrapper?.unmount?.()
    document.body.removeChild(helper)
  })

  it('should be accessible', async () => {
    const results = await axe(wrapper.getDOMNode())
    expect(results).toBeAccessible()
  })
})
