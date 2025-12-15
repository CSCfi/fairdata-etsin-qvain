import { ThemeProvider } from 'styled-components'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import ReactModal from 'react-modal'
import { Route, Routes } from 'react-router'

import {
  waitFor,
  screen,
  render,
  waitForElementToBeRemoved,
  fireEvent,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import EnvClass from '@/stores/domain/env'
import { StoresProvider } from '@/stores/stores'
import Qvain from '@/components/qvain/views/main'
import { failTestsWhenTranslationIsMissing } from '@helpers'
import DataMemoryRouter from '@helpers/DataMemoryRouter'
import { access_types as accessTypes } from '@testdata/metaxv3/refs/access_rights.data'
import { dataset_open_a_catalog_expanded as dataset } from '@testdata/metaxv3/datasets/dataset_ida_a.data'
import {
  data_catalog_ida as idaCatalog,
  data_catalog_att as attCatalog,
} from '@testdata/metaxv3/refs/data_catalogs.data'

const registerMissingTranslationHandler = failTestsWhenTranslationIsMissing()

ReactModal.setAppElement(document.createElement('div'))

// Replace debounce milliseconds with 0
vi.mock('lodash-es', async () => {
  const actual = await vi.importActual('lodash-es')
  return { ...actual, debounce: f => actual.debounce(f, 0) }
})

vi.setConfig({ testTimeout: 25000 })

const mockAdapter = new MockAdapter(axios)

// axios mocks
beforeEach(() => {
  mockAdapter.reset()
  mockAdapter
    .onGet('https://metaxv3:443/v3/reference-data/access-types?pagination=false')
    .reply(200, accessTypes)
  mockAdapter.onGet(new RegExp('/v3/reference-data/.*')).reply(200, [])
  mockAdapter.onGet(new RegExp('/v3/organizations')).reply(200, [])
  mockAdapter.resetHistory()
})

const renderQvain = async (overrides = {}, { initialPath } = {}) => {
  const metaxDataset = {
    ...dataset,
    state: 'published',
    ...overrides,
    // Ensure metadata_owner.admin_organization is set
    metadata_owner: {
      ...dataset.metadata_owner,
      admin_organization: 'org-1',
      ...(overrides.metadata_owner || {}),
    },
  }
  const publishedDataset = { ...metaxDataset, state: 'published' }
  const linkedDatasetDraft = {
    ...metaxDataset,
    id: 'linked-draft-id',
    draft_of: {
      id: metaxDataset.id,
    },
  }
  mockAdapter.onGet(`https://metaxv3:443/v3/datasets/${metaxDataset.id}`).reply(200, metaxDataset)
  mockAdapter.onPatch(`https://metaxv3:443/v3/datasets/${metaxDataset.id}`).reply(200, metaxDataset)
  mockAdapter
    .onPost(`https://metaxv3:443/v3/datasets/${metaxDataset.id}/publish`)
    .reply(200, publishedDataset)

  // Linked draft
  mockAdapter
    .onPost(`https://metaxv3:443/v3/datasets/${metaxDataset.id}/create-draft`)
    .reply(201, linkedDatasetDraft)
  mockAdapter
    .onGet(`https://metaxv3:443/v3/datasets/${linkedDatasetDraft.id}`)
    .reply(200, linkedDatasetDraft)
  mockAdapter
    .onPatch(`https://metaxv3:443/v3/datasets/${linkedDatasetDraft.id}`)
    .reply(200, linkedDatasetDraft)
  mockAdapter
    .onPost(`https://metaxv3:443/v3/datasets/${linkedDatasetDraft.id}/publish`)
    .reply(200, publishedDataset)
  mockAdapter.onGet(`https://metaxv3:443/v3/auth/user`).reply(200, {
    name: 'teppo',
    admin_organizations: [],
    available_admin_organizations: [
      { id: 'org-1', pref_label: { en: 'Organization 1', fi: 'Organisaatio 1' } },
      { id: 'org-2', pref_label: { en: 'Organization 2', fi: 'Organisaatio 2' } },
    ],
    default_admin_organization: { id: 'org-1', pref_label: { en: 'Organization 1' } },
  })

  // When loading an existing dataset, catalog is included in the payload (?expand_catalog=true).
  // When creating new dataset, catalogs need to be loaded separately.
  for (const catalog of [idaCatalog, attCatalog]) {
    mockAdapter.onGet(`https://metaxv3:443/v3/data-catalogs/${catalog.id}`).reply(200, catalog)
  }

  document.cookie = 'etsin_app=qvain' // sets etsin_app
  const Env = new EnvClass()
  Env.Flags.setFlag('QVAIN.METAX_V3.FRONTEND', true)
  Env.Flags.setFlag('QVAIN.REMS', true)
  Env.setMetaxV3Host('metaxv3', 443)
  const stores = buildStores({ Env })
  registerMissingTranslationHandler(stores.Locale)
  stores.Auth.setUser({
    name: 'teppo',
    admin_organizations: [],
    available_admin_organizations: [
      { id: 'org-1', pref_label: { en: 'Organization 1', fi: 'Organisaatio 1' } },
      { id: 'org-2', pref_label: { en: 'Organization 2', fi: 'Organisaatio 2' } },
    ],
    default_admin_organization: { id: 'org-1', pref_label: { en: 'Organization 1' } },
  })

  render(
    <ThemeProvider theme={etsinTheme}>
      <DataMemoryRouter
        initialEntries={[initialPath || `/dataset/${metaxDataset.id}`]}
        stores={stores}
      >
        <StoresProvider store={stores}>
          <Routes>
            <Route path="/dataset" Component={Qvain} />
            <Route path="/dataset/:identifier" Component={Qvain} />
          </Routes>
        </StoresProvider>
      </DataMemoryRouter>
    </ThemeProvider>
  )
  if (initialPath !== '/dataset') {
    await waitForElementToBeRemoved(() => screen.queryByText('Loading dataset'))
  }

  // Wait for dataset to load
  await waitFor(() => {
    expect(stores.Qvain.original).toBeDefined()
  })

  return stores
}

describe('Qvain admin org draft button validation', () => {
  it('should disable draft button and show tooltip when admin org is changed for published dataset', async () => {
    const stores = await renderQvain()

    // Wait for admin org to be initialized
    await waitFor(() => {
      expect(stores.Qvain.AdminOrg.selectedAdminOrg).toBeDefined()
    })
    expect(stores.Qvain.AdminOrg.selectedAdminOrg.value).toBe('org-1')

    // Verify that publishedDataset has the original admin org
    // This is what the validation will check against
    expect(stores.Qvain.publishedDataset).toBeDefined()
    expect(stores.Qvain.publishedDataset?.metadata_owner_admin_org).toBe('org-1')

    // Select a different admin org
    const selectInput =
      document.getElementById('admin-org-select') ||
      screen.getByLabelText(/Organization that will have maintenance rights/i)
    await userEvent.click(selectInput)

    const option = await screen.findByRole('option', { name: 'Organization 2' })
    await userEvent.click(option)

    // Wait for selection to be applied
    await waitFor(() => {
      expect(stores.Qvain.AdminOrg.selectedAdminOrg.value).toBe('org-2')
    })

    // Confirm the selection
    const checkbox =
      document.getElementById('admin-org-confirmation') || screen.getByRole('checkbox')
    await userEvent.click(checkbox)

    // Wait for confirmation to be applied
    await waitFor(() => {
      expect(stores.Qvain.AdminOrg.confirmationSelected).toBe(true)
    })

    // Wait for prevalidation to complete
    await waitFor(
      () => {
        expect(stores.Qvain.Submit.prevalidationDone).toBe(true)
      },
      { timeout: 3000 }
    )

    // Verify that the validation error is set correctly
    expect(stores.Qvain.Submit.draftValidationError).toBeDefined()
    // ValidationError from yup has an errors array
    const errors = stores.Qvain.Submit.draftValidationError?.errors || []
    expect(errors.length).toBeGreaterThan(0)
    const errorMessage = errors[0] || stores.Qvain.Submit.draftValidationError?.message
    expect(errorMessage).toContain(
      'Cannot save draft with different admin organization than the previously published dataset'
    )

    // Check that draft button is disabled
    const draftButton = screen.getByRole('button', { name: 'Save as draft' })
    expect(draftButton).toBeDisabled()

    // Hover over the draft button to show tooltip
    const draftButtonWrapper = document.getElementById('draft-button-wrapper')
    expect(draftButtonWrapper).toBeInTheDocument()

    // Trigger mouseenter event to show tooltip
    fireEvent.mouseEnter(draftButtonWrapper)

    // Wait for tooltip to appear and check the error message
    // The error message should be visible in the tooltip
    await waitFor(
      () => {
        // The tooltip should contain the error message
        // Try multiple ways to find it since it might be in different formats
        const errorText =
          screen.queryByText(/Cannot save draft with different admin organization/i) ||
          screen.queryByText(/different admin organization than the previously published/i) ||
          screen.queryByText(/different admin organization/i)
        expect(errorText).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })
})
