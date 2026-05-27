import { cleanup, screen } from '@testing-library/react'
import { contextRenderer } from '@/../__tests__/test-helpers'
import ExternalResources from '@/components/etsin/Dataset/data/externalResources'
import { buildStores } from '@/stores'
import { useStores } from '@/stores/stores'

afterEach(cleanup)

vi.mock('@/stores/stores')

const createStores = (remoteResources, dataServices = []) => {
  const stores = buildStores()
  stores.Etsin.EtsinDataset.dataset = {
    remote_resources: remoteResources,
    data_catalog: {
      data_services: dataServices,
    },
  }
  return stores
}

describe('External resources', () => {
  it('shows size column but hides data service in the table', () => {
    const stores = createStores(
      [
        {
          identifier: 'resource-1',
          title: { en: 'Resource one' },
          byte_size: 1536,
          data_service: 'urn:service:lumi-aif',
        },
      ],
      [
        {
          id: 'urn:service:lumi-aif',
          pref_label: { en: 'LUMI-AIF' },
        },
      ]
    )
    useStores.mockReturnValue(stores)

    contextRenderer(<ExternalResources />)

    expect(screen.getByText('Resource one')).toBeInTheDocument()
    expect(screen.getByText('1.5 KB')).toBeInTheDocument()
    expect(screen.queryByText('LUMI-AIF')).not.toBeInTheDocument()
  })

  it('does not show empty size and data service values', () => {
    const stores = createStores([
      {
        identifier: 'resource-2',
        title: { en: 'Resource two' },
      },
    ])
    useStores.mockReturnValue(stores)

    contextRenderer(<ExternalResources />)

    expect(screen.queryByText('LUMI-AIF')).not.toBeInTheDocument()
    expect(screen.queryByText(/KB|MB|GB|Bytes/)).not.toBeInTheDocument()
  })

  it('shows fallback name when title is missing', () => {
    const stores = createStores([
      {
        identifier: 'resource-3',
        access_url: 'https://example.org/source',
      },
    ])
    useStores.mockReturnValue(stores)

    contextRenderer(<ExternalResources />)

    expect(screen.getByText('https://example.org/source')).toBeInTheDocument()
  })

  it('shows download/info/source buttons directly when download is http(s)', async () => {
    const stores = createStores([
      {
        identifier: 'resource-4',
        title: { en: 'Resource menu' },
        access_url: 'https://example.org/source',
        download_url: 'https://example.org/download',
      },
    ])
    useStores.mockReturnValue(stores)

    contextRenderer(<ExternalResources />)

    const downloadButton = screen.getByRole('link', { name: 'Download' })
    expect(downloadButton).toBeInTheDocument()

    expect(screen.getByText('Info').closest('button')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'External source page' })).toBeInTheDocument()

    expect(screen.queryByLabelText('Resource actions')).not.toBeInTheDocument()
    expect(screen.queryByRole('menu', { name: 'Resource actions' })).not.toBeInTheDocument()
  })

  it('hides download button and shows file path when download is file://', async () => {
    const stores = createStores([
      {
        identifier: 'resource-6',
        title: { en: 'Local file resource' },
        download_url: 'file:///tmp/example.txt',
      },
    ])
    useStores.mockReturnValue(stores)

    contextRenderer(<ExternalResources />)

    expect(screen.queryByRole('link', { name: 'Download' })).not.toBeInTheDocument()
    expect(screen.getByText('/tmp/example.txt')).toBeInTheDocument()

    expect(screen.getByText('Info').closest('button')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'External source page' })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Resource actions')).not.toBeInTheDocument()
  })

  it('truncates long local file path preview and preserves ending characters', () => {
    const stores = createStores([
      {
        identifier: 'resource-7',
        download_url: 'file:///home/torvinen/README-or-super-long-file-name-that-keeps-going.txt',
      },
    ])
    useStores.mockReturnValue(stores)

    contextRenderer(<ExternalResources />)

    expect(screen.getAllByText('/home/torvinen/README-o...oing.txt')).toHaveLength(2)
  })

  it('shows info as primary button when download is missing', async () => {
    const stores = createStores([
      {
        identifier: 'resource-5',
        title: { en: 'No download resource' },
        access_url: 'https://example.org/source',
      },
    ])
    useStores.mockReturnValue(stores)

    contextRenderer(<ExternalResources />)

    expect(screen.getByText('Info').closest('button')).toBeInTheDocument()

    expect(screen.queryByRole('link', { name: 'Download' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'External source page' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Resource actions')).not.toBeInTheDocument()
  })
})
