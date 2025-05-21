import { ThemeProvider } from 'styled-components'
import ReactModal from 'react-modal'
import axios from 'axios'
import { setImmediate } from 'timers'
import { render, screen, waitForElementToBeRemoved, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import dataset from '../../__testdata__/dataset.att'
import ManualDownloadModal from '@/components/etsin/Dataset/data/idaResources/manualDownloadModal'
import { useStores } from '@/stores/stores'

const stores = buildStores()

jest.mock('@/stores/stores', () => {
  const mockUseStores = jest.fn()
  return {
    ...jest.requireActual('@/stores/stores'),
    useStores: mockUseStores,
  }
})

axios.get = jest.fn(() =>
  Promise.resolve({
    data: {
      catalog_record: dataset,
    },
  })
)

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

  const renderModal = async (urlGetter = successUrlGetter) => {
    navigator.clipboard.writeText.mockReset()

    // wait for async tasks to finish
    await stores.DatasetQuery.getData(dataset.identifier)
    await flushPromises()
    const { Packages } = stores.DatasetQuery
    Packages.openManualDownloadModal(urlGetter)

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)
    render(
      <ThemeProvider theme={etsinTheme}>
        <main>
          <ManualDownloadModal Packages={Packages} />
        </main>
      </ThemeProvider>,
      { attachTo: helper }
    )
    await waitForElementToBeRemoved(() => document.querySelector('.loader-active'))
  }

  afterEach(() => {
    if (wrapper && wrapper.length > 0) {
      wrapper.unmount?.()
    }
    document.body.removeChild(helper)
  })

  it('should be open', async () => {
    await renderModal()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should have no ErrorDiv', async () => {
    await renderModal()
    expect(screen.queryByTestId('manual-download-error')).not.toBeInTheDocument()
  })

  it('should have ErrorDiv', async () => {
    await renderModal(failUrlGetter)
    expect(screen.getByTestId('manual-download-error')).toBeInTheDocument()
  })

  it('should have wget, cURL and URL fields', async () => {
    await renderModal()
    const section = screen.getByRole('heading', { name: 'Other download options' }).nextSibling
    const titles = within(section)
      .getAllByRole('heading')
      .map(e => e.textContent)
    expect(titles).toEqual(['wget', 'cURL', 'URL'])
  })

  it('should copy wget to clipboard', async () => {
    await renderModal()
    await userEvent.click(screen.getByText('wget').nextSibling.querySelector('button'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'wget --content-disposition "https://example.com/download"'
    )
  })

  it('should copy cURL to clipboard', async () => {
    await renderModal()
    await userEvent.click(screen.getByText('cURL').nextSibling.querySelector('button'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'curl -fOJ "https://example.com/download"'
    )
  })

  it('should copy URL to clipboard', async () => {
    await renderModal()
    await userEvent.click(screen.getByText('URL').nextSibling.querySelector('button'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/download')
  })
})
