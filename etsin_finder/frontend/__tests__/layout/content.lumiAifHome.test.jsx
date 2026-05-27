/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

import { render, screen, waitFor } from '@testing-library/react'

import { runInAction } from 'mobx'
import { createRef } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { ThemeProvider } from 'styled-components'

import Content from '@/layout/content'
import { buildStores } from '@/stores'
import EnvClass from '@/stores/domain/env'
import { StoresProvider } from '@/stores/stores'
import { getThemeByApp } from '@/styles/theme'
import { DATA_CATALOG_IDENTIFIER } from '@/utils/constants'

const mockAdapter = new MockAdapter(axios)
mockAdapter.onGet(/\/v3\/datasets/).reply(200, [])
mockAdapter.onGet(/\/v3\/datasets\/aggregates/).reply(200, {
  data_catalog: {
    query_parameter: 'facet_data_catalog',
    hits: [],
  },
  access_type: {
    query_parameter: 'facet_access_type',
    hits: [],
  },
  organization: {
    query_parameter: 'facet_organization',
    hits: [],
  },
  creator: {
    query_parameter: 'facet_creator',
    hits: [],
  },
  field_of_science: {
    query_parameter: 'facet_field_of_science',
    hits: [],
  },
  keyword: {
    query_parameter: 'facet_keyword',
    hits: [],
  },
  infrastructure: {
    query_parameter: 'facet_infrastructure',
    hits: [],
  },
  file_type: {
    query_parameter: 'facet_file_type',
    hits: [],
  },
  project: {
    query_parameter: 'facet_project',
    hits: [],
  },
})

function renderContentAt(path, app) {
  const Env = new EnvClass()
  const stores = buildStores({ Env })
  runInAction(() => {
    stores.Auth.initializing = false
    stores.Env.app = app
  })
  const contentRef = createRef()
  const router = createMemoryRouter(
    [
      {
        path: '*',
        element: (
          <ThemeProvider theme={getThemeByApp(app)}>
            <StoresProvider store={stores}>
              <Content contentRef={contentRef} />
            </StoresProvider>
          </ThemeProvider>
        ),
      },
    ],
    { initialEntries: [path] }
  )
  stores.Env.history.syncWithRouter(router)
  render(<RouterProvider router={router} />)
  return { router, stores }
}

describe('Content Etsin home route', () => {
  it('when etsin_app is lumi-aif.etsin, / shows search at root without facet params in the URL', async () => {
    const { router } = renderContentAt('/', 'lumi-aif.etsin')
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/')
      expect(router.state.location.search).not.toContain('data_catalog__id')
      expect(router.state.location.search).not.toContain('facet_data_catalog')
      expect(router.state.location.search).not.toContain('facet_data_service')
      expect(screen.getByTestId('search-page')).toBeInTheDocument()
    })
  })

  it('when etsin_app is lumi-aif.etsin, /datasets redirects to / without hidden facets in the URL', async () => {
    const { router } = renderContentAt(
      `/datasets?data_catalog__id=${encodeURIComponent(DATA_CATALOG_IDENTIFIER.DAAS)}&facet_data_service=${encodeURIComponent(
        'LUMI AI Factory'
      )}&search=q`,
      'lumi-aif.etsin'
    )
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/')
      expect(router.state.location.search).toBe('?search=q')
    })
    expect(mockAdapter.history.get.length).toBe(2)
  })

  it('when etsin_app is etsin, / should stay on the front page path', async () => {
    const { router } = renderContentAt('/', 'etsin')
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/')
    })
  })
})
