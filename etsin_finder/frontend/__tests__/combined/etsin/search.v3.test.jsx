import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

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
import dataset_ida_a from '../../__testdata__/metaxv3/datasets/dataset_ida_a.data'
import dataset_ida_b from '../../__testdata__/metaxv3/datasets/dataset_ida_b.data'

const common_query = 'publishing_channels=etsin&latest_versions=true&state=published'

const getQueryParam = (key, value) => {
  return `${key}=${value}`
}

const getFilteredAggregation = (facet, entry) => {
  /* Create a deep clone from aggregations_a so that no reference to 
  aggregations_a exists: */
  const aggregations = JSON.parse(JSON.stringify(aggregations_a))

  // Filter to include only objects that contain the search word: 
  const hits = aggregations[facet].hits.filter((object) => {
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
  .onGet(`https://metaxv3:443/v3/datasets/aggregates?language=en&limit=20&offset=0&${common_query}`)
  .reply(200, aggregations_a)
mockAdapter
  .onGet(
    `https://metaxv3:443/v3/datasets?keyword=web-development&limit=20&offset=0&${common_query}`
  )
  .reply(200, { results: [dataset_ida_a], count: 1 })
mockAdapter
  .onGet(
    `https://metaxv3:443/v3/datasets/aggregates?language=en&keyword=web-development&limit=20&offset=0&${common_query}`
  )
  .reply(200, aggregations_a)
mockAdapter
  .onGet(`https://metaxv3:443/v3/datasets?search=test&limit=20&offset=0&${common_query}`)
  .reply(200, { ...dataset_ida_a, count: 0, results: [] })
mockAdapter
  .onGet(`https://metaxv3:443/v3/datasets/aggregates?language=en&search=test&limit=20&offset=0&${common_query}`)
  .reply(200, aggregations_a)
mockAdapter
  .onGet(`https://metaxv3:443/v3/datasets?limit=20&offset=20&${common_query}`)
  .reply(200, { results: [dataset_ida_b], count: 21 })
mockAdapter
  .onGet(`https://metaxv3:443/v3/datasets/aggregates?language=en&limit=20&offset=20&${common_query}`)
  .reply(200, aggregations_b)
mockAdapter
  .onGet(`https://metaxv3:443/v3/datasets/aggregates?language=en&limit=20&offset=0&${common_query}&` +
    `${getQueryParam('organization_facet_search', 'KONE')}`)
  .reply(200, getFilteredAggregation('organization', 'KONE'))

mockAdapter.resetHistory()

const getStores = () => {
  const Env = new EnvClass()
  Env.history = {
    location: {
      pathname: 'https://etsin',
    },
  }
  Env.setMetaxV3Host('metaxv3', 443)
  const stores = buildStores({ Env })

  return stores
}

const renderEtsin = (path = '/datasets') => {
  const stores = getStores()
  return render(
    <ThemeProvider theme={etsinTheme}>
      <MemoryRouter initialEntries={[path]}>
        <StoresProvider store={stores}>
          <Routes>
            <Route path="/datasets" Component={Search} />
          </Routes>
        </StoresProvider>
      </MemoryRouter>
    </ThemeProvider>
  )
}

describe('Etsin search page', () => {
  beforeEach(() => {
    mockAdapter.resetHistory()
  })

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

    describe('when clicking keyword filter section', () => {
      test('it shows keyword aggregation', async () => {
        renderEtsin()
        for (const kw of dataset_ida_a.keyword) {
          expect(await screen.findByText(`${kw} (1)`)).toBeInTheDocument()
        }
      })

      describe('when selecting a filter keyword: web-development', () => {
        test('it goes to url /datasets?keyword=web-development', async () => {
          renderEtsin()
          await userEvent.click(screen.getByTestId('search-filter-keyword'))
          await userEvent.click(screen.getByText('web-development (1)'))
          expect(mockAdapter.history.get).toHaveLength(4)
          expect(mockAdapter.history.get[2].url).toContain('keyword=web-development')
        })
      })

      describe('when typing "KONE" into the Organization facet input', () => {
        test('the input field text will be "KONE"', async () => {
          renderEtsin()
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
      })

      describe('when typing "KONE" into the Organization facet input', () => {
        test('it filters only the options that contain "KONE" case-insensitively', async () => {
          renderEtsin()
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
      })

      describe('when typing "KONE" into the Organization facet input', () => {
        test('it adds a query param accordingly to the request', async () => {
          renderEtsin()
          await userEvent.click(screen.getByText('Organization').closest('button'))
          const organizationFacet = screen.getByTestId('organization-facet')
          const input = within(organizationFacet).getByPlaceholderText('Narrow down the list')

          expect(mockAdapter.history.get.some((element) => {
            return element.url.includes('aggregates')
          })).toBe(true)

          expect(mockAdapter.history.get.some((element) => {
            return element.url.includes('organization_facet_search')
          })).toBe(false)

          fireEvent.change(input, { target: { value: 'KONE' } })

          await waitFor(() => {
            expect(mockAdapter.history.get.some((element) => {
              return element.url.includes('aggregates') && element.url.includes('organization_facet_search=KONE')
            })).toBe(true)
          })
        })
      })

      describe("when writing 'test' to search bar", () => {
        test('it goes to url /datasets?search=test', async () => {
          renderEtsin()
          const searchBar = await screen.findByLabelText('Search bar')
          await userEvent.type(searchBar, 'test{enter}')
          expect(mockAdapter.history.get).toHaveLength(4)
          expect(mockAdapter.history.get[2].url).toContain('search=test')
        })
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

    expect(within(temporalFacet).getByText(/start year cannot be later than end year/)).toBeInTheDocument()
  })
})

describe('When the start year is invalid in the Time Period facet', () => {
  test('it should display the indented validation error', async () => {
    renderEtsin()
    await userEvent.click(screen.getByText('Time Period').closest('button'))
    const temporalFacet = screen.getByTestId('temporal')
    const fromInput = within(temporalFacet).getByLabelText('From')
    const toInput = within(temporalFacet).getByLabelText('To')
    const searchButton = within(temporalFacet).getByText('Search').closest('button')

    fireEvent.change(fromInput, { target: { value: '11' } })
    fireEvent.change(toInput, { target: { value: '2022' } })
    await userEvent.click(searchButton)

    expect(within(temporalFacet).getByText(/The given start period is invalid/)).toBeInTheDocument()
  })
})

describe('When the end year is invalid in the Time Period facet', () => {
  test('it should display the indented validation error', async () => {
    renderEtsin()
    await userEvent.click(screen.getByText('Time Period').closest('button'))
    const temporalFacet = screen.getByTestId('temporal')
    const fromInput = within(temporalFacet).getByLabelText('From')
    const toInput = within(temporalFacet).getByLabelText('To')
    const searchButton = within(temporalFacet).getByText('Search').closest('button')

    fireEvent.change(fromInput, { target: { value: '2000' } })
    fireEvent.change(toInput, { target: { value: 'aa' } })
    await userEvent.click(searchButton)

    expect(within(temporalFacet).getByText(/The given end period is invalid/)).toBeInTheDocument()
  })
})