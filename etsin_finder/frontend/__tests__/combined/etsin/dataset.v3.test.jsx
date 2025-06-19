import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ReactModal from 'react-modal'

// context
import { StoresProvider } from '@/stores/stores'
import etsinTheme from '@/styles/theme'
import { MemoryRouter, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import Dataset from '@/components/etsin/Dataset'

import { buildStores } from '@/stores'
import EnvClass from '@/stores/domain/env'

import { textValues } from '@helpers'
import {
  dataset_open_a_catalog_expanded,
  dataset_rems,
} from '@testdata/metaxv3/datasets/dataset_ida_a.data'
import {
  approvedApplication,
  approvedApplicationList,
  remsApplicationBase,
} from '@testdata/rems.data'

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

const renderEtsin = async (
  dataset = dataset_open_a_catalog_expanded,
  { userLogged = false, tab = undefined } = {}
) => {
  mockAdapter.reset()
  mockAdapter
    .onGet(`https://metaxv3:443/v3/datasets/${dataset.id}`)
    .reply(200, { ...dataset, state: 'published' })
  mockAdapter.onGet(`https://metaxv3:443/v3/datasets/${dataset.id}/contact`).reply(200, {})
  mockAdapter
    .onGet(`https://metaxv3:443/v3/datasets/${dataset.id}/rems-application-base`)
    .reply(200, remsApplicationBase)
  mockAdapter
    .onPost(`https://metaxv3:443/v3/datasets/${dataset.id}/rems-applications`)
    .reply(200, { success: true, 'application-id': 123 })
  mockAdapter
    .onGet(`https://metaxv3:443/v3/datasets/${dataset.id}/rems-applications`)
    .reply(200, [])
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

  const initialEntries = [`/dataset/${dataset.id}`]

  if (tab) {
    initialEntries[0] += `/${tab}`
  }

  render(
    <ThemeProvider theme={etsinTheme}>
      <MemoryRouter initialEntries={initialEntries}>
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
    if (dt.textContent === 'Other identifiers') {
      values[dt.textContent] = dd.textContent
    } else {
      values[cleanupText(dt.firstChild)] = dd.textContent
    }
  }

  return values
}

describe('Etsin dataset page', () => {
  test('renders dataset', async () => {
    const newDataset = dataset_open_a_catalog_expanded
    newDataset.other_identifiers.push(
      { notation: 'urn:nbn:fi:csc-test' },
      { notation: 'doi:10.0000/00-00' },
      { notation: 'not-a-link' }
    )

    await renderEtsin(newDataset)
    screen.getByRole('heading', { name: /All Fields Test Dataset/ })
    screen.getByRole('button', { name: 'Open' })
    /* Click Other identifiers title's plus button so that other identifiers 
    are rendered:*/
    await userEvent.click(screen.getByTestId('toggle-show-expandable-dataset-info-item-children'))

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
      'Other identifiers': 'urn:nbn:fi:csc-testdoi:10.0000/00-00'
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
    await renderEtsin(dataset_rems, { userLogged: true })
    await userEvent.click(screen.getByTestId('rems-button'))
    const dialog = screen.getByRole('dialog')
    within(dialog).getByRole('heading', { name: 'Apply for Data Access' })

    // List licenses, terms for data access should be first
    const listItems = within(dialog)
      .getAllByRole('listitem')
      .map(e => textValues(e))
    expect(listItems).toEqual([
      ['Terms for data access', 'Terms here'],
      [
        'Creative Commons Attribution 4.0 International (CC BY 4.0)',
        'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0',
      ],
      ['License name', 'https://license.url'],
    ])

    // Submit button should be clickable after accepting terms
    await userEvent.click(
      within(dialog).getByRole('checkbox', {
        name: 'I agree to the terms for data access and the licenses.',
      })
    )
    const clickSubmitPromise = userEvent.click(within(dialog).getByRole('button', { name: 'Submit' }))

    // Mock responses for created application
    mockAdapter
      .onGet(`https://metaxv3:443/v3/datasets/${dataset_rems.id}/rems-applications`)
      .reply(200, approvedApplicationList)
    mockAdapter
      .onGet(`https://metaxv3:443/v3/datasets/${dataset_rems.id}/rems-applications/123`)
      .reply(200, approvedApplication)
    await clickSubmitPromise

    // Check that correct application creation request is sent
    expect(mockAdapter.history.post).toHaveLength(1)
    const request = mockAdapter.history.post[0]
    expect(request.url).toBe(
      'https://metaxv3:443/v3/datasets/4eb1c1ac-b2a7-4e45-8c63-099b0e7ab4b0/rems-applications'
    )
    expect(request.data).toBe('{"accept_licenses":[4,1,5]}')

    // Created application should be in a new tab and active
    const tab = within(dialog).getByRole('tab', { name: /Application.*123/ })
    expect(tab.getAttribute("aria-selected")).toBe("true")
    expect(within(dialog).getByText("Application created on March 5, 2025")).toBeInTheDocument()
  })

  test('renders REMS error message', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {}) // hide console.error from output
    await renderEtsin(dataset_rems, { userLogged: true })

    mockAdapter
      .onGet(`https://metaxv3:443/v3/datasets/${dataset_rems.id}/rems-application-base`)
      .reply(500, remsApplicationBase)

    await userEvent.click(screen.getByTestId('rems-button'))
    const dialog = screen.getByRole('dialog')
    within(dialog).getByRole('heading', { name: 'Apply for Data Access' })
    within(dialog).getByText('There was an error loading access data')
    expect(within(dialog).getByRole('button', { name: 'Submit' })).toBeDisabled()
  })
})
