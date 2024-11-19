import React from 'react'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

// context
import { ThemeProvider } from 'styled-components'
import { MemoryRouter, Route } from 'react-router-dom'
import etsinTheme from '@/styles/theme'
import { StoresProvider } from '@/stores/stores'
import '../../../locale/translations'

import Search from '@/components/etsin/Search'

import { buildStores } from '@/stores'
import EnvClass from '@/stores/domain/env'

import aggregations_a from '../../__testdata__/metaxv3/search/aggregations_a.data'
import aggregations_b from '../../__testdata__/metaxv3/search/aggregations_b.data'
import dataset_ida_a from '../../__testdata__/metaxv3/datasets/dataset_ida_a.data'
import dataset_ida_b from '../../__testdata__/metaxv3/datasets/dataset_ida_b.data'

const mockAdapter = new MockAdapter(axios)
mockAdapter
  .onGet('https://metaxv3:443/v3/datasets?limit=20&offset=0&publishing_channels=etsin')
  .reply(200, { results: [dataset_ida_a], count: 1 })
mockAdapter
  .onGet('https://metaxv3:443/v3/datasets/aggregates?limit=20&offset=0&publishing_channels=etsin')
  .reply(200, aggregations_a)
mockAdapter
  .onGet(
    'https://metaxv3:443/v3/datasets?keyword=web-development&limit=20&offset=0&publishing_channels=etsin'
  )
  .reply(200, { results: [dataset_ida_a], count: 1 })
mockAdapter
  .onGet(
    'https://metaxv3:443/v3/datasets/aggregates?keyword=web-development&limit=20&offset=0&publishing_channels=etsin'
  )
  .reply(200, aggregations_a)
mockAdapter
  .onGet('https://metaxv3:443/v3/datasets?search=test&limit=20&offset=0&publishing_channels=etsin')
  .reply(200, { ...dataset_ida_a, count: 0, results: [] })
mockAdapter
  .onGet(
    'https://metaxv3:443/v3/datasets/aggregates?search=test&limit=20&offset=0&publishing_channels=etsin'
  )
  .reply(200, aggregations_a)
mockAdapter
  .onGet('https://metaxv3:443/v3/datasets?limit=20&offset=20&publishing_channels=etsin')
  .reply(200, { results: [dataset_ida_b], count: 21 })
mockAdapter
  .onGet('https://metaxv3:443/v3/datasets/aggregates?limit=20&offset=20&publishing_channels=etsin')
  .reply(200, aggregations_b)

mockAdapter.resetHistory()

const getStores = () => {
  const Env = new EnvClass()
  Env.history = {
    location: {
      pathname: 'https://etsin',
    },
  }
  Env.setMetaxV3Host('metaxv3', 443)
  Env.Flags.setFlag('ETSIN.METAX_V3.FRONTEND', true)
  const stores = buildStores({ Env })

  return stores
}

const renderEtsin = (path = '/datasets') => {
  const stores = getStores()
  return render(
    <ThemeProvider theme={etsinTheme}>
      <MemoryRouter initialEntries={[path]}>
        <StoresProvider store={stores}>
          <Route path="/datasets" component={Search} />
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
          // eslint-disable-next-line no-await-in-loop
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
