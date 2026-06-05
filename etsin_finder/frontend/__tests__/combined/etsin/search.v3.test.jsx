import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { runInAction } from 'mobx'

// context
import { ThemeProvider } from 'styled-components'
import { MemoryRouter, Route, Routes } from 'react-router'
import etsinTheme from '@/styles/theme'
import { StoresProvider } from '@/stores/stores'

import Search from '@/components/etsin/Search'

import { buildStores } from '@/stores'
import EnvClass from '@/stores/domain/env'

import aggregations_a from '../../__testdata__/metaxv3/search/aggregations_a.data'
import aggregations_b from '../../__testdata__/metaxv3/search/aggregations_b.data'
import dataset_ida_a, {
  dataset_geolocation,
  dataset_open_a_catalog_expanded,
} from '../../__testdata__/metaxv3/datasets/dataset_ida_a.data'
import dataset_ida_b from '../../__testdata__/metaxv3/datasets/dataset_ida_b.data'

import L from 'leaflet'
import Dataset from '@/components/etsin/Dataset'
import { cloneDeep } from 'lodash-es'
import { HelmetProvider } from 'react-helmet-async'

// Mock for geoman library and pm-related methods:
vi.mock('@geoman-io/leaflet-geoman-free', () => ({}))

L.Map.prototype.pm = {
  addControls: vi.fn(),
  disableDraw: vi.fn(),
  getGeomanLayers: vi.fn().mockImplementation(() => {
    return {
      _layers: {},
    }
  }),
  Toolbar: {
    setButtonDisabled: vi.fn(),
  },
}

const common_query =
  'publishing_channels=etsin&latest_versions=true&state=published&filter_language=en'
const common_aggregates_query = `${common_query}&expand_data_services=true`

const getFilteredAggregation = (facet, entry) => {
  // Create a deep clone from aggregations_a so that no reference to
  // aggregations_a exists:
  const aggregations = cloneDeep(aggregations_a)

  // Filter to include only objects that contain the search word:
  const hits = aggregations[facet].hits.filter(object => {
    return String(object.value.en).toLowerCase().includes(entry.toLowerCase())
  })

  // Replace old hits with filtered ones:
  aggregations[facet].hits = hits

  return aggregations
}

const mockAdapter = new MockAdapter(axios)
mockAdapter
  .onGet(`https://metaxv3:443/v3/datasets?limit=20&offset=0&${common_query}`)
  .reply(200, { results: [dataset_ida_a], count: 1 })
mockAdapter
  .onGet(`https://metaxv3:443/v3/datasets/aggregates?limit=20&offset=0&${common_aggregates_query}`)
  .reply(200, aggregations_a)
mockAdapter
  .onGet(
    `https://metaxv3:443/v3/datasets?facet_keyword=web-development&limit=20&offset=0&${common_query}`
  )
  .reply(200, { results: [dataset_ida_a], count: 1 })
mockAdapter
  .onGet(
    `https://metaxv3:443/v3/datasets/aggregates?facet_keyword=web-development&limit=20&offset=0&${common_aggregates_query}`
  )
  .reply(200, aggregations_a)
mockAdapter
  .onGet(`https://metaxv3:443/v3/datasets?search=test&limit=20&offset=0&${common_query}`)
  .reply(200, { ...dataset_ida_a, count: 0, results: [] })
mockAdapter
  .onGet(
    `https://metaxv3:443/v3/datasets/aggregates?search=test&limit=20&offset=0&${common_aggregates_query}`
  )
  .reply(200, aggregations_a)
mockAdapter
  .onGet(`https://metaxv3:443/v3/datasets?limit=20&offset=20&${common_query}`)
  .reply(200, { results: [dataset_ida_b], count: 21 })
mockAdapter
  .onGet(`https://metaxv3:443/v3/datasets/aggregates?limit=20&offset=20&${common_aggregates_query}`)
  .reply(200, aggregations_b)
mockAdapter
  .onGet(
    `https://metaxv3:443/v3/datasets/aggregates?limit=20&offset=0&${common_aggregates_query}&` +
    `organization_facet_search=KONE`
  )
  .reply(200, getFilteredAggregation('organization', 'KONE'))
mockAdapter
  .onGet(
    `https://metaxv3:443/v3/datasets?geolocation=POINT%2826.1+61.6%29&limit=20&offset=0&${common_query}`
  )
  .reply(200, { results: [dataset_geolocation], count: 1 })
mockAdapter
  .onGet(
    `https://metaxv3:443/v3/datasets/aggregates?geolocation=POINT%2826.1+61.6%29&limit=20&offset=0&${common_aggregates_query}`
  )
  .reply(200, aggregations_a)
mockAdapter
  .onGet(`https://metaxv3:443/v3/datasets/${dataset_open_a_catalog_expanded.id}`)
  .reply(200, { ...dataset_open_a_catalog_expanded, state: 'published' })
mockAdapter
  .onGet(`https://metaxv3:443/v3/datasets/${dataset_open_a_catalog_expanded.id}/contact`)
  .reply(200, {})

mockAdapter.resetHistory()

const getStores = () => {
  const Env = new EnvClass()
  Env.history = {
    location: {
      pathname: 'https://etsin',
    },
  }
  Env.setMetaxV3Host('metaxv3', 443)
  Env.Flags.setFlag('ETSIN.GEOPORTTI_PROTO', true)
  Env.Flags.setFlag('ETSIN.UI.V2', true)
  Env.Flags.setFlag('ETSIN.REMS', true)
  const stores = buildStores({ Env })

  // Mock setLayers method:
  stores.Etsin.Search.MapSearch = {
    ...stores.Etsin.Search.MapSearch,
    retrieve: vi.fn(),
    setResetLayers: vi.fn(),
  }

  return stores
}

const renderEtsin = (path = '/datasets', stores = getStores()) => {
  return render(
    <HelmetProvider>
      <ThemeProvider theme={etsinTheme}>
        <MemoryRouter initialEntries={[path]}>
          <StoresProvider store={stores}>
            <Routes>
              <Route path="/datasets" Component={Search} />
              <Route path={`/dataset/:identifier/*`} Component={Dataset} />
            </Routes>
          </StoresProvider>
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>
  )
}

describe('Etsin search page', () => {
  beforeEach(() => {
    mockAdapter.resetHistory()
  })

  const waitInitialResultsLoaded = async () => {
    await screen.findByText('1 result')
  }

  describe('´given url /datasets', () => {
    test('it shows count of one', async () => {
      renderEtsin()
      expect(await screen.findByText('1 result')).toBeInTheDocument()
      expect(await screen.findByText(dataset_ida_a.title.en)).toBeInTheDocument()
      expect(
        await screen.findByText(
          'This dataset is used for testing all fields in the Etsin dataset page.',
          {
            exact: false,
          }
        )
      ).toBeInTheDocument()
      expect(
        await screen.findByText(dataset_ida_a.field_of_science[0].pref_label.en)
      ).toBeInTheDocument()
      expect(
        await screen.findByText(dataset_ida_a.access_rights.access_type.pref_label.en)
      ).toBeInTheDocument()
    })

    test('it should not add dataset-specific links supporting signposting to the document head', async () => {
      renderEtsin()
      const head = document.head
      expect(head.querySelector('link[rel="type"]')).not.toBeInTheDocument()
    })

    describe('when clicking keyword filter section', () => {
      test('it shows keyword aggregation', async () => {
        renderEtsin()
        await waitInitialResultsLoaded()
        for (const kw of dataset_ida_a.keyword) {
          expect(await screen.findByText(`${kw} (1)`)).toBeInTheDocument()
        }
      })

      describe('when selecting a filter keyword: web-development', () => {
        test('it goes to url /datasets?keyword=web-development', async () => {
          renderEtsin()
          await waitInitialResultsLoaded()
          await userEvent.click(screen.getByTestId('search-filter-keyword'))
          await userEvent.click(screen.getByText('web-development (1)'))
          expect(mockAdapter.history.get).toHaveLength(4)
          expect(mockAdapter.history.get[2].url).toContain('facet_keyword=web-development')
        })

        test('it keeps the keyword section expanded after deselecting last active value', async () => {
          renderEtsin()
          await waitInitialResultsLoaded()

          const keywordSectionButton = screen.getByTestId('search-filter-keyword')
          await userEvent.click(keywordSectionButton)
          await userEvent.click(screen.getByText('web-development (1)'))
          await userEvent.click(screen.getByText('web-development (1)'))

          await waitFor(() => {
            expect(keywordSectionButton).toHaveAttribute('aria-expanded', 'true')
          })
        })

        test('it closes the keyword section and resets filters when the Remove filters button is clicked', async () => {
          renderEtsin()
          await waitInitialResultsLoaded()

          // Open the keyword facet:
          await userEvent.click(screen.getByTestId('search-filter-keyword'))

          // Select the "web-development" filter within the keyword facet:
          await userEvent.click(await screen.findByRole('switch', { name: 'web-development (1)' }))

          // Verify that the "web-development" filter has been selected:
          expect(await screen.findByRole('switch', { name: 'web-development (1)' })).toHaveClass('active')

          // Click the Remove filters button:
          await userEvent.click(await screen.findByRole('button', { name: 'Remove filters' }))

          // Verify that the facet is closed:
          expect(await screen.findByTestId('search-filter-keyword')).toHaveAttribute('aria-expanded', 'false')

          // Open the facet again and verify that the filter is no longer active:
          await userEvent.click(screen.getByTestId('search-filter-keyword'))
          expect(screen.getByRole('switch', { name: 'web-development (1)' })).not.toHaveClass('active')
        })

        test('it keeps the search page mounted while loading next results', async () => {
          const stores = getStores()
          renderEtsin('/datasets', stores)
          await waitInitialResultsLoaded()
          await userEvent.click(screen.getByTestId('search-filter-keyword'))
          await userEvent.click(screen.getByText('web-development (1)'))

          runInAction(() => {
            stores.Etsin.Search.setIsLoading(true)
          })
          await waitFor(() => {
            expect(screen.getByTestId('search-page')).toBeInTheDocument()
          })
        })
      })

      describe("when writing 'test' to search bar", () => {
        test('it goes to url /datasets?search=test', async () => {
          renderEtsin()
          await waitInitialResultsLoaded()
          const searchBar = await screen.findByLabelText('Search bar')
          await userEvent.type(searchBar, 'test{enter}')
          expect(mockAdapter.history.get).toHaveLength(4)
          expect(mockAdapter.history.get[2].url).toContain('search=test')
        })
      })
    })

    describe('when typing "KONE" into the Organization facet input', () => {
      test('the input field text will be "KONE"', async () => {
        renderEtsin()
        await waitInitialResultsLoaded()
        await userEvent.click(screen.getByText('Organization').closest('button'))
        const organizationFacet = screen.getByTestId('organization-facet')
        const input = within(organizationFacet).getByPlaceholderText('Narrow down the list')

        expect(input).toBeInTheDocument()
        expect(input.value).toBe('')

        fireEvent.change(input, { target: { value: 'KONE' } })

        await waitFor(() => {
          expect(input.value).toBe('KONE')
        })
      })

      test('it filters only the options that contain "KONE" case-insensitively', async () => {
        renderEtsin()
        await waitInitialResultsLoaded()
        await userEvent.click(screen.getByText('Organization').closest('button'))
        const organizationFacet = screen.getByTestId('organization-facet')

        const input = within(organizationFacet).getByPlaceholderText('Narrow down the list')

        expect(within(organizationFacet).getByText('Kone Foundation (1)')).toBeInTheDocument()
        expect(within(organizationFacet).getByText('Test org (1)')).toBeInTheDocument()

        fireEvent.change(input, { target: { value: 'KONE' } })

        await waitFor(() => {
          expect(within(organizationFacet).getByText('Kone Foundation (1)')).toBeInTheDocument()
        })

        await waitFor(() => {
          expect(within(organizationFacet).queryByText('Test org (1)')).not.toBeInTheDocument()
        })
      })

      test('it adds a query param accordingly to the request', async () => {
        renderEtsin()
        await waitInitialResultsLoaded()
        await userEvent.click(screen.getByText('Organization').closest('button'))
        const organizationFacet = screen.getByTestId('organization-facet')
        const input = within(organizationFacet).getByPlaceholderText('Narrow down the list')

        expect(
          mockAdapter.history.get.some(element => {
            return element.url.includes('aggregates')
          })
        ).toBe(true)

        expect(
          mockAdapter.history.get.some(element => {
            return element.url.includes('organization_facet_search')
          })
        ).toBe(false)

        fireEvent.change(input, { target: { value: 'KONE' } })

        await waitFor(() => {
          expect(
            mockAdapter.history.get.some(element => {
              return (
                element.url.includes('aggregates') &&
                element.url.includes('organization_facet_search=KONE')
              )
            })
          ).toBe(true)
        })
      })
    })

    describe('When the start year is after the end year in the Time Period Facet', () => {
      test('it should show a validation error', async () => {
        renderEtsin()
        await userEvent.click(screen.getByText('Time Period').closest('button'))
        const temporalFacet = screen.getByTestId('temporal')
        const fromInput = within(temporalFacet).getByLabelText('From')
        const toInput = within(temporalFacet).getByLabelText('To')
        const searchButton = within(temporalFacet).getByText('Search').closest('button')

        expect(fromInput).toBeInTheDocument()
        expect(toInput).toBeInTheDocument()
        expect(searchButton).toBeInTheDocument()

        fireEvent.change(fromInput, { target: { value: '2024' } })
        fireEvent.change(toInput, { target: { value: '2022' } })
        await userEvent.click(searchButton)

        expect(
          within(temporalFacet).getByText(/start year cannot be later than end year/)
        ).toBeInTheDocument()
      })
    })

    describe('When the start year is invalid in the Time Period facet', () => {
      test('it should display the intended validation error', async () => {
        renderEtsin()
        await userEvent.click(screen.getByText('Time Period').closest('button'))
        const temporalFacet = screen.getByTestId('temporal')
        const fromInput = within(temporalFacet).getByLabelText('From')
        const toInput = within(temporalFacet).getByLabelText('To')
        const searchButton = within(temporalFacet).getByText('Search').closest('button')

        fireEvent.change(fromInput, { target: { value: '11' } })
        fireEvent.change(toInput, { target: { value: '2022' } })
        await userEvent.click(searchButton)

        expect(
          within(temporalFacet).getByText(/The given start period is invalid/)
        ).toBeInTheDocument()
      })
    })

    describe('When the end year is invalid in the Time Period facet', () => {
      test('it should display the intended validation error', async () => {
        renderEtsin()
        await userEvent.click(screen.getByText('Time Period').closest('button'))
        const temporalFacet = screen.getByTestId('temporal')
        const fromInput = within(temporalFacet).getByLabelText('From')
        const toInput = within(temporalFacet).getByLabelText('To')
        const searchButton = within(temporalFacet).getByText('Search').closest('button')

        fireEvent.change(fromInput, { target: { value: '2000' } })
        fireEvent.change(toInput, { target: { value: 'aa' } })
        await userEvent.click(searchButton)

        expect(
          within(temporalFacet).getByText(/The given end period is invalid/)
        ).toBeInTheDocument()
      })
    })
  })

  describe('´given url /datasets?page=2', () => {
    test('it shows page two and exactly one dataset there', async () => {
      renderEtsin('/datasets?page=2')
      expect(await screen.findByText(dataset_ida_b.title.en)).toBeInTheDocument()
      expect(await screen.findByLabelText('Current page 2')).toBeInTheDocument()
    })
  })

  describe('when datasets are queried by geolocation', () => {
    test('retrieve method is triggered once (the geolocation is applied to the map)', () => {
      const stores = getStores()
      renderEtsin('/datasets?geolocation=POINT(26.1 61.6)', stores)
      expect(stores.Etsin.Search.MapSearch.retrieve).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Etsin search page navigation', () => {
  describe('when navigating to a dataset view and back', () => {
    test('it restores the filter state from the previous search', { timeout: 20_000 }, async () => {
      renderEtsin()

      // Select the keyword filter:
      await userEvent.click(await screen.findByTestId('search-filter-keyword'))
      await userEvent.click(await screen.findByRole('switch', { name: 'web-development (1)' }))

      expect(
        mockAdapter.history.get.some(element =>
          element.url.includes('facet_keyword=web-development')
        )
      ).toBe(true)

      await screen.findByText('1 result')

      // Navigate to dataset:
      await userEvent.click(await screen.findByRole('heading', { name: 'All Fields Test Dataset' }))
      await screen.findByRole('article')

      // Click the Go Back link:
      await userEvent.click(await screen.findByRole('link', { name: 'Go back' }))

      await screen.findByText('1 result')

      // The keyword filter should remain selected:
      expect(await screen.findByRole('switch', { name: 'web-development (1)' })).toHaveClass(
        'active'
      )

      // Deselect the filter:
      await userEvent.click(await screen.findByRole('switch', { name: 'web-development (1)' }))

      // Navigate to the dataset landing page again without filters:
      await userEvent.click(await screen.findByRole('heading', { name: 'All Fields Test Dataset' }))
      await screen.findByRole('article')

      // Click the Go back link:
      await userEvent.click(await screen.findByRole('link', { name: 'Go back' }))

      // No filter should be active:
      await userEvent.click(await screen.findByTestId('search-filter-keyword'))
      expect(await screen.findByRole('switch', { name: 'web-development (1)' })).not.toHaveClass(
        'active'
      )
    })
  })
})
