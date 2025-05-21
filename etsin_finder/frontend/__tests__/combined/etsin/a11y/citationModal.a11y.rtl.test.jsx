import { ThemeProvider } from 'styled-components'
import { axe } from 'jest-axe'
import ReactModal from 'react-modal'
import axios from 'axios'
import { setImmediate } from 'timers'
import { render, screen } from '@testing-library/react'

import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import dataset from '../../../__testdata__/metaxv3/datasets/dataset_att_a'
import CitationModal from '@/components/etsin/Dataset/citation/citationModal'
import { useStores } from '@/stores/stores'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

const stores = buildStores()
stores.Etsin.EtsinDataset.set('dataset', dataset)
failTestsWhenTranslationIsMissing(stores.Locale)

jest.mock('@/stores/stores', () => {
  const useStoresMock = jest.fn()

  return {
    ...jest.requireActual('@/stores/stores'),
    useStores: useStoresMock,
  }
})

axios.get = jest.fn(() =>
  Promise.resolve({
    data: dataset,
  })
)

useStores.mockReturnValue(stores)

const flushPromises = () => new Promise(setImmediate)

describe('Etsin citation modal', () => {
  let helper

  const renderModal = async () => {
    // wait for async tasks to finish
    await flushPromises()
    stores.Etsin.EtsinDataset.setShowCitationModal(true)

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)
    render(
      <ThemeProvider theme={etsinTheme}>
        <main>
          <CitationModal />
        </main>
      </ThemeProvider>,
      { attachTo: helper }
    )
  }

  afterEach(() => {
    document.body.removeChild(helper)
  })

  it('should be accessible', async () => {
    await renderModal()
    const dialog = screen.getByRole('dialog')
    const results = await axe(dialog)
    expect(results).toBeAccessible()
  })
})
