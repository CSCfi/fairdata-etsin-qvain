import React from 'react'
import ReactModal from 'react-modal'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// context
import { ThemeProvider } from 'styled-components'
import { MemoryRouter, Route } from 'react-router-dom'
import etsinTheme from '@/styles/theme'
import { StoresProvider } from '@/stores/stores'

import Dataset from '@/components/etsin/Dataset'

import { buildStores } from '@/stores'
import EnvClass from '@/stores/domain/env'

import {
  dataset_open_a_catalog_expanded,
  dataset_rems,
} from '../../__testdata__/metaxv3/datasets/dataset_ida_a.data'

// Avoid reactmodal warnings
ReactModal.setAppElement(document.createElement('div'))

const mockAdapter = new MockAdapter(axios)

const getStores = () => {
  const Env = new EnvClass()
  Env.history = {
    location: {
      pathname: 'https://etsin',
    },
  }
  Env.setMetaxV3Host('metaxv3', 443)
  Env.Flags.setFlag('ETSIN.UI.V2', true)
  Env.Flags.setFlag('ETSIN.REMS', true)
  const stores = buildStores({ Env })

  return stores
}

const renderEtsin = async (dataset = dataset_open_a_catalog_expanded, userLogged = false) => {
  mockAdapter.reset()
  mockAdapter
    .onGet(`https://metaxv3:443/v3/datasets/${dataset.id}`)
    .reply(200, { ...dataset, state: 'published' })
  mockAdapter.onGet(`https://metaxv3:443/v3/datasets/${dataset.id}/contact`).reply(200, {})
  mockAdapter
    .onPost(`https://metaxv3:443/v3/datasets/${dataset.id}/rems-applications`)
    .reply(200, { success: true })
  const stores = getStores()
  if (userLogged) {
    // REMS requires user login
    stores.Auth.userLogged = true
    stores.Auth.cscUserLogged = true
    stores.Auth.setUser({
      name: 'fd_user3',
      firstName: 'fd',
      lastName: 'user',
      loggedIn: true,
      homeOrganizationId: undefined,
      idaProjects: [],
      isUsingRems: undefined, // not used by V3, use flag instead
      csrfToken: undefined,
    })
  }
  render(
    <ThemeProvider theme={etsinTheme}>
      <MemoryRouter initialEntries={[`/dataset/${dataset.id}`]}>
        <StoresProvider store={stores}>
          <Route path="/dataset/:identifier" component={Dataset} />
        </StoresProvider>
      </MemoryRouter>
    </ThemeProvider>
  )

  await screen.findByRole('article')
}

const cleanupText = node => {
  // Return node.textContent without tooltip texts
  const clone = node.cloneNode(true)
  for (const tooltip of clone.querySelectorAll('[class*="Tooltip"]')) {
    tooltip.remove()
  }
  const text = clone.textContent
  clone.remove()
  return text
}

const getDLValues = () => {
  // Return map of <dt> text to corresponding <dd> text content
  const dts = document.getElementsByTagName('dt')
  const values = {}
  for (const dt of dts) {
    const dd = dt.nextElementSibling
    expect(dd.tagName).toBe('DD') // DT should be followed by DD
    values[cleanupText(dt.firstChild)] = dd.textContent
  }
  return values
}

describe('Etsin dataset page', () => {
  test('renders dataset', async () => {
    await renderEtsin()
    screen.getByRole('heading', { name: /All Fields Test Dataset/ })
    screen.getByRole('button', { name: 'Open' })
    const values = getDLValues()
    expect(values).toEqual({
      Description: expect.stringContaining('This dataset is used for testing all fields'),
      'Data Type': 'Audiovisual',
      'Field of Science': 'Computer and information sciences',
      Keywords:
        'test, software development, web-development, testi, ohjelmistokehitys, web-kehitys',
      Language: 'Finnish, English',
      'Spatial Coverage':
        'Unioninkatu (Random Address in Helsinki)Tapiola (Another Random Address in Espoo)',
      'Temporal Coverage': 'September 20, 2023 – November 25, 2023',
      'Catalog publisher': 'Testing',
      Identifier: expect.stringContaining('doi: 10.23729/ee43f42b-e455-4849-9d70-7e3a52b307f5'),
      Cite: 'Copy Citation/References',
      'Subject heading': 'software developmentweb pages',
      License: 'Other (Open)Creative Commons Attribution 4.0 International (CC BY 4.0)',
      'Projects and Funding': 'Project',
      Access: 'Open',
      Publisher: 'Test org, Test dept',
      Curator: 'Kone Foundation',
    })
  })

  test('renders citation modal', async () => {
    await renderEtsin()
    await userEvent.click(screen.getByRole('button', { name: 'Copy Citation/References' }))
    const dialog = screen.getByRole('dialog')
    const header = within(dialog).getByRole('heading', { name: 'APA' })
    expect(header.nextElementSibling.textContent).toEqual(
      'Kone Foundation, & Henkilö, K. (2023). All Fields Test Dataset. ' +
        'Test org, Test dept. https://doi.org/10.23729/ee43f42b-e455-4849-9d70-7e3a52b307f5'
    )
  })

  test('renders REMS application', async () => {
    await renderEtsin(dataset_rems, true)
    await userEvent.click(screen.getByTestId('rems-button'))
    const dialog = screen.getByRole('dialog')
    within(dialog).getByRole('heading', { name: 'Apply for Data Access' })

    // Submit button should be clickable after accepting terms
    await userEvent.click(within(dialog).getByTestId('accept-access-terms'))
    await userEvent.click(within(dialog).getByTestId('submit-access-application'))
  })
})
