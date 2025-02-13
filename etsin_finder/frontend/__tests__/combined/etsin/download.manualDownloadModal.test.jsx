import React, { useState } from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import ReactModal from 'react-modal'
import axios from 'axios'
import { setImmediate } from 'timers'

import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import dataset from '../../__testdata__/dataset.att'
import ManualDownloadModal from '@/components/etsin/Dataset/data/idaResources/manualDownloadModal'
import { ErrorDiv } from '@/components/etsin/Dataset/data/idaResources/manualDownloadModal/content'
import Modal from '@/components/general/modal'
import { useStores } from '@/stores/stores'
import CopyField, {
  LoaderWrapper,
} from '@/components/etsin/Dataset/data/idaResources/manualDownloadModal/copyField'

const stores = buildStores()

jest.mock('@/stores/stores', () => {
  const useStores = jest.fn()
  return {
    ...jest.requireActual('@/stores/stores'),
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

// mock useState so the returned setter can be replaced with one that tracks total number of setter calls
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}))
const { useState: useStateOriginal } = jest.requireActual('react')
let useStateSetCount = 0
useState.mockImplementation((...args) => {
  const [value, setter] = useStateOriginal(...args)
  return [
    value,
    (...args) => {
      useStateSetCount += 1
      setter(...args)
    },
  ]
})

useStores.mockReturnValue(stores)

const flushPromises = () => new Promise(setImmediate)

stores.DatasetQuery.getData()

navigator.clipboard = {
  writeText: jest.fn(),
}

describe('Etsin manual download options modal', () => {
  let wrapper, helper

  const successUrlGetter = () => ({
    url: 'https://example.com/download',
  })

  const failUrlGetter = () => ({
    error: 'failure, oops',
  })

  const createAsyncUrlGetter = () => {
    let resolve
    const promise = new Promise(resolveFunc => {
      resolve = () => {
        resolveFunc({ url: 'https://example.com/download' })
      }
    })
    const getter = () => promise

    return {
      getter,
      resolve,
    }
  }

  const render = async (urlGetter = successUrlGetter) => {
    navigator.clipboard.writeText.mockReset()

    // wait for async tasks to finish
    await stores.DatasetQuery.getData(dataset.identifier)
    await flushPromises()
    const { Packages } = stores.DatasetQuery
    Packages.openManualDownloadModal(urlGetter)

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
  }

  afterEach(() => {
    useStateSetCount = 0
    if (wrapper && wrapper.length > 0) {
      wrapper.unmount?.()
    }
    document.body.removeChild(helper)
  })

  it('should be open', async () => {
    await render()
    expect(wrapper.find(Modal).prop('isOpen')).toBe(true)
  })

  it('should have no ErrorDiv', async () => {
    await render()
    wrapper.find(ErrorDiv).exists().should.be.false
  })

  it('should have ErrorDiv', async () => {
    await render(failUrlGetter)
    wrapper.find(ErrorDiv).exists().should.be.true
  })

  it('should hide loaders after getting URL', async () => {
    const { getter, resolve } = createAsyncUrlGetter()
    await render(getter)
    wrapper.find(LoaderWrapper).exists().should.be.true
    await act(async () => {
      await resolve()
      wrapper.update()
    })
    wrapper.find(LoaderWrapper).exists().should.be.false
  })

  it('should not call useState setters after unmounting', async () => {
    const { getter, resolve } = createAsyncUrlGetter()
    await render(getter)
    wrapper.unmount()
    useStateSetCount = 0
    await act(async () => {
      await resolve()
    })
    useStateSetCount.should.eql(0)
  })

  it('should have wget, cURL and URL fields', async () => {
    await render()
    wrapper
      .find(CopyField)
      .map(v => v.prop('title'))
      .should.eql(['wget', 'cURL', 'URL'])
  })

  it('should copy wget to clipboard', async () => {
    await render()
    wrapper.find(CopyField).find({ title: 'wget' }).find('button').simulate('click')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'wget --content-disposition "https://example.com/download"'
    )
  })

  it('should copy cURL to clipboard', async () => {
    await render()
    wrapper.find(CopyField).find({ title: 'cURL' }).find('button').simulate('click')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'curl -fOJ "https://example.com/download"'
    )
  })

  it('should copy URL to clipboard', async () => {
    await render()
    wrapper.find(CopyField).find({ title: 'URL' }).find('button').simulate('click')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/download')
  })
})
