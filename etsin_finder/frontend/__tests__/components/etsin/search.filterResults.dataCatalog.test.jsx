import { ThemeProvider } from 'styled-components'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router'
import { runInAction } from 'mobx'

import { buildStores } from '@/stores'
import etsinTheme from '@/styles/theme'
import { getThemeByApp } from '@/styles/theme'
import FilterResults from '@/components/etsin/Search/filterResults'
import { StoresProvider } from '@/stores/stores'
import { LUMI_AIF_ETSIN_APP_COOKIE } from '@/utils/lumiAifEtsinSearch'

const LocationSearch = () => {
  const location = useLocation()
  return <div data-testid="location-search">{location.search}</div>
}

describe('Etsin data catalog filter with data services', () => {
  const renderFilterResults = (initialEntry = '/datasets', loading = false) => {
    const stores = buildStores()
    runInAction(() => {
      stores.Etsin.Search.isLoading = loading
      stores.Etsin.Search.aggregations = {
        data_catalog: {
          query_parameter: 'facet_data_catalog',
          hits: [
            {
              value: { en: 'Dataset as a Service datasets' },
              count: 5,
              data_service: [{ value: { en: 'LUMI-AIF' }, count: 1 }],
            },
          ],
        },
        data_service: {
          query_parameter: 'facet_data_service',
          hits: [],
        },
      }
    })

    return render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <StoresProvider store={stores}>
          <ThemeProvider theme={etsinTheme}>
            <FilterResults />
            <LocationSearch />
          </ThemeProvider>
        </StoresProvider>
      </MemoryRouter>
    )
  }

  const renderFilterResultsLumiPortal = () => {
    const stores = buildStores()
    runInAction(() => {
      stores.Env.app = LUMI_AIF_ETSIN_APP_COOKIE
      stores.Etsin.Search.isLoading = false
      stores.Etsin.Search.aggregations = {
        data_catalog: {
          query_parameter: 'facet_data_catalog',
          hits: [
            {
              value: { en: 'Dataset as a Service datasets' },
              count: 5,
              data_service: [{ value: { en: 'LUMI-AIF' }, count: 1 }],
            },
          ],
        },
        data_service: {
          query_parameter: 'facet_data_service',
          hits: [],
        },
      }
    })
    return render(
      <MemoryRouter initialEntries={['/']}>
        <StoresProvider store={stores}>
          <ThemeProvider theme={etsinTheme}>
            <FilterResults />
          </ThemeProvider>
        </StoresProvider>
      </MemoryRouter>
    )
  }

  it('hides Data Catalog section on LUMI-AIF portal where Daas + LUMI-AIF are fixed', () => {
    renderFilterResultsLumiPortal()
    expect(screen.queryByRole('button', { name: 'Data Catalog' })).not.toBeInTheDocument()
    expect(screen.queryByTestId('data_catalog-facet')).not.toBeInTheDocument()
  })

  it('uses dark facet heading text color on LUMI-AIF portal', () => {
    const stores = buildStores()
    runInAction(() => {
      stores.Env.app = LUMI_AIF_ETSIN_APP_COOKIE
      stores.Etsin.Search.isLoading = false
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <StoresProvider store={stores}>
          <ThemeProvider theme={getThemeByApp(LUMI_AIF_ETSIN_APP_COOKIE)}>
            <FilterResults />
          </ThemeProvider>
        </StoresProvider>
      </MemoryRouter>
    )

    const accessFacetHeading = screen.getByRole('button', { name: 'Access' })
    expect(window.getComputedStyle(accessFacetHeading).color).toMatch(
      /#231f20|black|rgb\(35,\s*31,\s*32\)|rgb\(0,\s*0,\s*0\)/
    )
  })

  it('expands selected data catalog and clears nested data services when deselected', async () => {
    renderFilterResults()

    const sectionButton = screen.getByRole('button', { name: 'Data Catalog' })
    await userEvent.click(sectionButton)

    const catalogButton = screen.getByRole('switch', {
      name: 'Dataset as a Service datasets (5)',
    })
    await userEvent.click(catalogButton)

    expect(screen.getByRole('switch', { name: 'LUMI-AIF (1)' })).toBeInTheDocument()
    expect(screen.getByTestId('location-search').textContent).toContain(
      'facet_data_catalog=Dataset+as+a+Service+datasets'
    )

    await userEvent.click(screen.getByRole('switch', { name: 'LUMI-AIF (1)' }))
    expect(screen.getByTestId('location-search').textContent).toContain('facet_data_service=LUMI-AIF')

    await userEvent.click(screen.getByRole('switch', { name: 'Dataset as a Service datasets (5)' }))

    expect(screen.queryByRole('switch', { name: 'LUMI-AIF (1)' })).not.toBeInTheDocument()
    expect(screen.getByTestId('location-search').textContent).not.toContain('facet_data_catalog=')
    expect(screen.getByTestId('location-search').textContent).not.toContain('facet_data_service=')
    expect(sectionButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('shows loading indicator and disables catalog switches while loading', async () => {
    renderFilterResults('/datasets', true)

    await userEvent.click(screen.getByRole('button', { name: 'Data Catalog' }))
    const catalogSwitch = screen.getByRole('switch', { name: 'Dataset as a Service datasets (5)' })
    expect(screen.getByTestId('data_catalog-loading-indicator')).toBeInTheDocument()
    expect(catalogSwitch).toBeDisabled()
  })

  it('shows mini expand icon for catalogs with data services', async () => {
    renderFilterResults()

    await userEvent.click(screen.getByRole('button', { name: 'Data Catalog' }))
    const catalogSwitch = screen.getByRole('switch', {
      name: 'Dataset as a Service datasets (5)',
    })
    expect(catalogSwitch.querySelector('svg[data-icon="chevron-right"]')).toBeInTheDocument()

    await userEvent.click(catalogSwitch)
    const activeCatalogSwitch = screen.getByRole('switch', {
      name: 'Dataset as a Service datasets (5)',
    })
    expect(activeCatalogSwitch.querySelector('svg[data-icon="chevron-down"]')).toBeInTheDocument()
  })
})
