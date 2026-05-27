import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { vi } from 'vitest'

import { useStores } from '@/stores/stores'
import etsinTheme from '@/styles/theme'
import Dataset from '@/components/qvain/views/datasetsV2/dataset'
import { DATA_CATALOG_IDENTIFIER } from '@/utils/constants'

vi.mock('@/stores/stores', async () => {
  const actual = await vi.importActual('@/stores/stores')
  return {
    ...actual,
    useStores: vi.fn(),
  }
})

vi.mock('@/utils/Translate', () => ({
  __esModule: true,
  default: ({ content, component: Component = 'span', attributes, onClick, children, ...rest }) => {
    const Comp = Component || 'span'
    return (
      <Comp {...rest} {...attributes} onClick={onClick}>
        {children ?? content}
      </Comp>
    )
  },
}))

const renderDatasetRow = dataset => {
  useStores.mockReturnValue({
    QvainDatasets: {
      loadTime: new Date('2021-01-01T00:00:00Z'),
      share: { modal: { open: vi.fn() } },
      removeModal: { open: vi.fn() },
      removeDataset: vi.fn(),
      removeDatasetChanges: vi.fn(),
    },
    Locale: {
      getValueTranslation: value => value?.en ?? value,
      translate: key => key,
    },
    Auth: {
      userName: 'test-user',
      user: { admin_organizations: [] },
    },
    Env: {
      getQvainUrl: path => path,
      getEtsinUrl: path => path,
      history: { navigate: vi.fn() },
    },
    Matomo: { recordEvent: vi.fn() },
  })

  return render(
    <ThemeProvider theme={etsinTheme}>
      <table>
        <tbody>
          <Dataset dataset={dataset} group={[dataset]} isLatest />
        </tbody>
      </table>
    </ThemeProvider>
  )
}

describe('DatasetsV2 - DAAS logo', () => {
  it('shows DAAS logo when dataset is in DAAS catalog', () => {
    const dataset = {
      id: '1',
      identifier: '1',
      sources: ['creator'],
      data_catalog: { identifier: DATA_CATALOG_IDENTIFIER.DAAS },
      research_dataset: { title: { en: 'DAAS dataset' } },
      state: 'published',
      date_created: '2021-01-01T00:00:00Z',
      metadata_provider_user: 'test-user',
    }
    renderDatasetRow(dataset)
    expect(screen.queryAllByRole('img', { name: /DAAS/i }).length).toBe(1)
  })

  it('does not show DAAS logo for non-DAAS datasets', () => {
    const dataset = {
      id: '2',
      identifier: '2',
      sources: ['creator'],
      data_catalog: { identifier: DATA_CATALOG_IDENTIFIER.IDA },
      research_dataset: { title: { en: 'IDA dataset' } },
      state: 'published',
      date_created: '2021-01-01T00:00:00Z',
      metadata_provider_user: 'test-user',
    }
    renderDatasetRow(dataset)
    expect(screen.queryAllByRole('img', { name: /DAAS/i }).length).toBe(0)
  })
})

