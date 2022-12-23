import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { axe } from 'jest-axe'
import ReactModal from 'react-modal'
import axios from 'axios'
import { setImmediate } from 'timers'

import etsinTheme from '../../../../js/styles/theme'
import '../../../../locale/translations'
import stores from '../../../../js/stores'
import dataset from '../../../__testdata__/dataset.att'
import ManualDownloadModal from '../../../../js/components/dataset/data/idaResources/manualDownloadModal'
import Modal from '../../../../js/components/general/modal'
import { useStores } from '../../../../js/stores/stores'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

failTestsWhenTranslationIsMissing()

jest.mock('../../../../js/stores/stores', () => {
  const useStores = jest.fn()

  return {
    ...jest.requireActual('../../../../js/stores/stores'),
    useStores,
  }
})

axios.get = jest.fn(() => {
  return Promise.resolve({
    data: {
      catalog_record: dataset,
    },
  })
})

useStores.mockReturnValue(stores)

const flushPromises = () => new Promise(setImmediate)

stores.DatasetQuery.getData()

describe('Etsin manual download options modal', () => {
  let wrapper, helper

  beforeAll(async () => {
    // wait for async tasks to finish
    await stores.DatasetQuery.getData(dataset.identifier)
    await flushPromises()
    const { Packages } = stores.DatasetQuery
    Packages.openManualDownloadModal(async () => {
      return { url: 'https://example.com/download' }
    })

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)
    await act(async () => {
      wrapper = mount(
        <ThemeProvider theme={etsinTheme}>
          <main>
            <ManualDownloadModal Packages={Packages} />
          </main>
        </ThemeProvider>,
        { attachTo: helper }
      )
    })
    wrapper.update()
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
