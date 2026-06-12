import { ThemeProvider } from 'styled-components'
import ReactModal from 'react-modal'
import axios from 'axios'
import { render, screen, waitForElementToBeRemoved, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import dataset from '../../__testdata__/dataset.att'
import ManualDownloadModalV2 from '@/components/etsin/Dataset/data/idaResources/ManualDownloadModalV2'
import { useStores } from '@/stores/stores'
import MockAdapter from 'axios-mock-adapter'
import type { OSOption } from '@/utils/getOS'
import type { UILanguage } from '@/stores/view/locale'

const stores = buildStores()

vi.mock('@/stores/stores', async () => {
  const mockUseStores = vi.fn()
  return {
    ...(await vi.importActual('@/stores/stores')),
    useStores: mockUseStores,
  }
})

const authorization = {
  dataset_id: '8bea36b9-c179-4b25-ba8a-7cf001f49556',
  scope: null,
  access_id: 'f123bc',
  access_token: 'sh4r3t0k3n',
  expires: '2026-06-22T11:16:57Z',
  sitemap_url: 'https://download-test/sitemap.xml',
  resourcelist_url: 'https://download-test/.well-known/resourcesync/resourcelist.xml',
  changelist_url: 'https://download-test/.well-known/resourcesync/changelist.xml',
  preview_url: 'https://download-test/api/preview/8bea36b9-c179-4b25-ba8a-7cf001f49556',
  metadata_url: 'https://download-test/api/metadata/8bea36b9-c179-4b25-ba8a-7cf001f49556',
  download_url: 'https://download-test/api/download?access_id=fvdy1j&access_token=sh4r3t0k3n',
  curl: 'curl info',
  wget: 'wget info',
  rclone_ls: 'rclone_ls info',
  rclone_copy: 'rclone_copy info',
  rclone_mount: 'rclone_mount info',
  windows_mount_en: 'use this <code>windows_mount_en command</code>',
  windows_mount_fi: 'use this <code>windows_mount_fi command</code>',
  windows_mount_sv: 'use this <code>windows_mount_sv command</code>',
  macos_mount_en: 'use this <code>macos_mount_en command</code>',
  macos_mount_fi: 'use this <code>macos_mount_fi command</code>',
  macos_mount_sv: 'use this <code>macos_mount_sv command</code>',
  linux_mount_en: 'use this <code>linux_mount_en command</code>',
  linux_mount_fi: 'use this <code>linux_mount_fi command</code>',
  linux_mount_sv: 'use this <code>linux_mount_sv command</code>',
}

const mockAdapter = new MockAdapter(axios)
mockAdapter.onGet().reply(200, { catalog_record: dataset })
;(useStores as any).mockReturnValue(stores)

vitest.spyOn(console, 'error').mockImplementation(() => {})

stores.DatasetQuery.getData()

vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn() } })

const nextSibling = (element: Element): HTMLElement => {
  const sibling = element.nextElementSibling
  if (!sibling) {
    throw new Error('no sibling found')
  }
  return sibling as HTMLElement
}

let helper = document.createElement('div')
document.body.appendChild(helper)
ReactModal.setAppElement(helper)

describe('Etsin manual download options modal', () => {
  const successUrlGetter = async () => authorization

  const failUrlGetter = async () => {
    throw new Error('oops')
  }

  const renderModal = async (
    urlGetter = successUrlGetter,
    { osChoice = 'windows', language = 'en' }: { osChoice?: OSOption; language?: UILanguage } = {}
  ) => {
    stores.Env.setOSChoice(osChoice)
    stores.Locale.setLang(language)
    ;(navigator.clipboard.writeText as any).mockReset()

    // wait for async tasks to finish
    await stores.DatasetQuery.getData(dataset.identifier)
    const { Packages } = stores.DatasetQuery
    Packages.openManualDownloadModal(urlGetter)

    render(
      <ThemeProvider theme={etsinTheme}>
        <main>
          <ManualDownloadModalV2 Packages={Packages} />
        </main>
      </ThemeProvider>
    )
    await waitForElementToBeRemoved(() => document.querySelector('.loader-active'))
  }

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

  it('should list fields', async () => {
    await renderModal()
    const section = nextSibling(screen.getByRole('heading', { name: 'Other download options' }))
    const titles = within(section)
      .getAllByRole('term') // dt
      .map(e => e.textContent)
    expect(titles).toEqual([
      'Access ID',
      'Access token',
      'Expires',
      'Download URL',
      'cURL',
      'Wget',
      'Rclone copy',
      'Rclone ls',
      'Rclone mount',
    ])
  })

  it('should copy url to clipboard', async () => {
    await renderModal()
    await userEvent.click(
      nextSibling(screen.getByText('Download URL')).querySelector('button') as HTMLElement
    )
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(authorization.download_url)
  })

  it('should copy wget to clipboard', async () => {
    await renderModal()
    await userEvent.click(nextSibling(screen.getByText('Wget')).querySelector('button')!)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('wget info')
  })

  it('should copy curl to clipboard', async () => {
    await renderModal()
    await userEvent.click(nextSibling(screen.getByText('cURL')).querySelector('button')!)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('curl info')
  })

  it('should render windows mount instructions', async () => {
    await renderModal()
    const heading = screen.getByRole('heading', { name: 'Windows mount' })
    const copyButton = within(nextSibling(heading)).getByRole('button')
    await userEvent.click(copyButton)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('windows_mount_en command')
  })

  it('should render linux mount instructions', async () => {
    await renderModal(undefined, { osChoice: 'linux' })
    const heading = screen.getByRole('heading', { name: 'Linux mount' })
    const copyButton = within(nextSibling(heading)).getByRole('button')
    await userEvent.click(copyButton)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('linux_mount_en command')
  })

  it('should render macos mount instructions', async () => {
    await renderModal(undefined, { osChoice: 'macos' })
    const heading = screen.getByRole('heading', { name: 'macOS mount' })
    const copyButton = within(nextSibling(heading)).getByRole('button')
    await userEvent.click(copyButton)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('macos_mount_en command')
  })

  it('should render windows mount instructions in finnish', async () => {
    await renderModal(undefined, { language: 'fi' })
    const heading = screen.getByRole('heading', { name: 'Windows mount' })
    const copyButton = within(nextSibling(heading)).getByRole('button')
    await userEvent.click(copyButton)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('windows_mount_fi command')
  })
})
