import { ThemeProvider } from 'styled-components'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import ReactModal from 'react-modal'

import { MemoryRouter, Route, useLocation } from 'react-router-dom'

import { waitFor, screen, render, within, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { parseISO } from 'date-fns'

import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import EnvClass from '@/stores/domain/env'
import { StoresProvider } from '@/stores/stores'
import Qvain from '@/components/qvain/views/main'
import { flatten, removeMatchingKeys } from '@/utils/flatten'
import { failTestsWhenTranslationIsMissing } from '@helpers'

const registerMissingTranslationHandler = failTestsWhenTranslationIsMissing()

// Replace debounce milliseconds with 0
jest.mock('lodash.debounce', () => f => jest.requireActual('lodash.debounce')(f, 0))
jest.setTimeout(25000)
import {
  access_rights_embargo,
  access_type_permit,
  restriction_grounds_research,
} from '../../__testdata__/metaxv3/refs/access_rights.data'
import dataset from '../../__testdata__/metaxv3/datasets/dataset_ida_a.data'

const mockAdapter = new MockAdapter(axios)

// axios mocks
beforeEach(() => {
  mockAdapter.reset()
  mockAdapter.onGet(new RegExp('/v3/reference-data/.*')).reply(200, [])
  mockAdapter.onGet(new RegExp('/v3/organizations')).reply(200, [])
  mockAdapter.resetHistory()
})

// rendering helpers
const getSection = name => screen.getByRole('heading', { name }).parentElement

let routerLocation

const Location = () => {
  // Helper component to keep track of router location
  const loc = useLocation()
  routerLocation = loc
  return null
}

const renderQvain = async (overrides = {}, { initialPath } = {}) => {
  const metaxDataset = { ...dataset, ...overrides }
  const publishedDataset = { ...dataset, ...overrides, state: 'published' }
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

  document.cookie = 'etsin_app=qvain' // sets etsin_app
  const Env = new EnvClass()
  Env.Flags.setFlag('QVAIN.METAX_V3.FRONTEND', true)
  Env.Flags.setFlag('QVAIN.REMS', true)
  Env.setMetaxV3Host('metaxv3', 443)
  const stores = buildStores({ Env })
  registerMissingTranslationHandler(stores.Locale)

  render(
    <ThemeProvider theme={etsinTheme}>
      <MemoryRouter initialEntries={[initialPath || `/dataset/${metaxDataset.id}`]}>
        <StoresProvider store={stores}>
          <Location />
          <Route path="/dataset/:identifier" component={Qvain} />
        </StoresProvider>
      </MemoryRouter>
    </ThemeProvider>
  )
  ReactModal.setAppElement(document.createElement('div'))
  await waitForElementToBeRemoved(() => screen.queryByText('Loading dataset'))
}

const renderSection = async (name, overrides) => {
  await renderQvain(overrides)
  return getSection(name)
}

describe('Qvain with an opened dataset', () => {
  it('shows IDA catalog as selected for IDA dataset', async () => {
    await renderQvain()
    const idaButton = screen.getByText('Choose "IDA"', { exact: false }).closest('button')
    expect(idaButton).toHaveClass('selected')
  })

  it('shows option for show/hide file metadata', async () => {
    await renderQvain({ access_rights: access_rights_embargo })
    const showFileMetadataCheckbox = screen.getByRole('radio', {
      name: 'Show data details in Etsin',
    })
    expect(showFileMetadataCheckbox).toBeInTheDocument()
    expect(showFileMetadataCheckbox).toBeChecked()

    const hideFileMetadataCheckbox = screen.getByRole('radio', {
      name: 'Hide data details in Etsin',
    })
    expect(hideFileMetadataCheckbox).toBeInTheDocument()
    expect(hideFileMetadataCheckbox).not.toBeChecked()
  })

  it('shows correct option checked for show/hide file metadata', async () => {
    await renderQvain({
      access_rights: {
        ...access_rights_embargo,
        show_file_metadata: null,
      },
    })
    const showFileMetadataCheckbox = screen.getByRole('radio', {
      name: 'Show data details in Etsin',
    })
    expect(showFileMetadataCheckbox).toBeInTheDocument()
    expect(showFileMetadataCheckbox).not.toBeChecked()

    const hideFileMetadataCheckbox = screen.getByRole('radio', {
      name: 'Hide data details in Etsin',
    })
    expect(hideFileMetadataCheckbox).toBeInTheDocument()
    expect(hideFileMetadataCheckbox).toBeChecked()
  })

  it('shows title and description in both languages', async () => {
    const section = await renderSection('Description')
    expect(within(section).getByDisplayValue('All Fields Test Dataset')).toBeInTheDocument()
    expect(
      within(section).getByText('This dataset is used for testing', {
        exact: false,
      })
    ).toBeInTheDocument()

    const finnishTab = within(section).getByRole('button', { name: 'Finnish' })
    await userEvent.click(finnishTab)
    expect(
      within(section).getByText('Tällä aineistolla testataan', {
        exact: false,
      })
    ).toBeInTheDocument()
  })

  it('shows issued date', async () => {
    const section = await renderSection('Description')
    expect(within(section).getByDisplayValue('06/28/2023')).toBeInTheDocument()
  })

  it('adds actor in modal', async () => {
    const section = await renderSection('Actors *')
    const getActorLabels = elem =>
      Array.from(elem.getElementsByClassName('actor-label')).map(v => v.textContent)
    expect(getActorLabels(section)).toEqual([
      'Kone Foundation / Creator / Curator',
      'Kuvitteellinen Henkilö / Creator',
      'Test org, Test dept / Publisher',
    ])

    // const actor = within(section).getByText('Kuvitteellinen Henkilö / Creator').parentElement
    // const editButton = within(actor).getByLabelText('Edit')
    await userEvent.click(within(section).getByText('Add new actor')) // should open modal

    const modal = screen.getByRole('dialog')
    expect(within(modal).getByRole('heading', { name: 'Edit actor' })).toBeInTheDocument()
    await userEvent.click(within(modal).getByLabelText('Rights holder'))
    await userEvent.type(within(modal).getByLabelText('Name', { exact: false }), 'Teppo Testaaja')
    await userEvent.click(modal.querySelector('#orgField'))
    await userEvent.click(within(modal).getByText('Test org, Test dept'))
    await userEvent.click(within(modal).getByText('Apply changes'))

    expect(getActorLabels(section)).toEqual([
      'Kone Foundation / Creator / Curator',
      'Kuvitteellinen Henkilö / Creator',
      'Test org, Test dept / Publisher',
      'Teppo Testaaja / Rights holder',
    ])
  })

  it('adds provenance in modal', async () => {
    const section = await renderSection('History and events (provenance)')
    const getLabels = elem =>
      Array.from(elem.getElementsByClassName('item-label')).map(v => v.textContent)
    expect(getLabels(section)).toEqual(['This thing happened'])

    await userEvent.click(within(section).getByText('Add Provenance')) // should open modal

    const modal = screen.getByRole('dialog')
    expect(within(modal).getByRole('heading', { name: 'Add Provenance' })).toBeInTheDocument()
    await userEvent.type(within(modal).getByLabelText('Name', { exact: false }), 'New event')
    await userEvent.type(within(modal).getByLabelText('Description'), 'Description of event')

    // const section = await renderSection('Geographical area')
    await userEvent.click(within(modal).getByRole('button', { name: 'Add location' })) // should open location modal

    // open nested location modal, add location
    const location = screen.getByRole('dialog', { name: 'Add location' })
    await userEvent.type(
      within(location).getByLabelText('Name', { exact: false }),
      'Great location'
    )
    await userEvent.click(within(location).getByRole('button', { name: 'Add location to event' }))
    expect(within(modal).getByText('Great location')).toBeInTheDocument()

    // add person that already exists in the dataset
    await userEvent.click(document.getElementById('actors-select'))
    await userEvent.click(within(modal).getByText('Kuvitteellinen Henkilö / Creator'))
    expect(within(modal).getByText('Kuvitteellinen Henkilö / Creator')).toBeInTheDocument()

    await userEvent.click(within(modal).getByRole('button', { name: 'Add Provenance' }))
    expect(getLabels(section)).toEqual(['This thing happened', 'New event'])
  })

  it('shows time period', async () => {
    const section = await renderSection('Time period')
    expect(within(section).getByText('2023-09-20 – 2023-11-25')).toBeInTheDocument()
  })

  it.each([
    ['Keywords', dataset.keyword],
    ['Subject Headings', ['software development']],
    ['Field of science', ['Computer and information sciences'], false],
    ['Language', ['Finnish']],
    ['Other identifiers', ['https://www.example.com']],
  ])('lists %s values', async (label, values, exact = true) => {
    const section = await renderSection('Description')
    const multivalue = within(section)
      .getByLabelText(label, { exact: false })
      .closest('[class*=control]')
    for (const value of values) {
      expect(within(multivalue).getByText(value, { exact })).toBeInTheDocument()
    }
  })

  it.each([
    ['History and events (provenance)'],
    ['Time period'],
    ['Related publications and other material'],
    ['Geographical area'],
    ['Project and funding'],
  ])('expands optional sections', async sectionName => {
    const section = await renderSection(sectionName)
    expect(within(section).getByRole('button', { name: 'Show less' })).toBeInTheDocument()
  })

  it('when submit is clicked, submits all supported fields from dataset', async () => {
    // fields not expected to be present in the submitted data
    const expectedMissing = [
      // non-writable fields
      'created',
      'modified',
      'first',
      'last',
      'replaces',
      'next',
      'previous',
      'is_deprecated',
      'is_removed',
      'removal_date',
      'cumulation_started',
      'state',
      /^metadata_owner\..+/,
      'persistent_identifier',
      // id not supported outside actors
      /^(?!actors\.).*.id$/,
      // redundant reference data
      /\.in_scheme$/,
      /\.pref_label\..+/,
      /\.reference\.as_wkt$/,
      // fields not yet supported
      /^access_rights\.description/,
      /license\.\d+\.description$/,
      // special handling
      /remote_resources\.\d+\..+/, // not supported for ida dataset
      'issued', // exact value may change
      /license\.0.custom_url$/, // license-0 has no custom url
      /license\.1.url$/, // license-1 has custom url so url is hidden
    ]

    // fields missing from original that may be added to submit data
    const expectedExtra = [
      'generate_pid_on_publish',
      'title.sv',
      'description.sv',
      /\.und$/,
      // actor related
      /\.pref_label\..+/,
      /\.person\.id$/,
      /\.person\.external_id$/,
      // special handling
      'issued', // exact value may change
      'actors.0.organization.email',
      'actors.0.organization.external_identifier',
      'actors.0.organization.homepage',
    ]

    await renderQvain()
    const submitButton = screen.getByRole('button', { name: 'Save as draft' })
    await userEvent.click(submitButton) // should submit data to metax
    const submitData = JSON.parse(mockAdapter.history.patch[0].data)

    // issued date might not have same timezone but should represent same date
    const datasetIssued = parseISO(dataset.issued).getTime()
    const submitIssued = parseISO(submitData.issued).getTime()
    expect(datasetIssued).toEqual(submitIssued)

    const flatDataset = removeMatchingKeys(
      flatten(dataset, { normalizeDates: true }),
      expectedMissing
    )
    const flatSubmit = removeMatchingKeys(
      flatten(submitData, { normalizeDates: true }),
      expectedExtra
    )
    expect(flatSubmit).toEqual(flatDataset)
  })

  it('when submit is clicked, submits remote resources for ATT dataset', async () => {
    // fields not expected to be present in the submitted data
    const expectedMissing = [
      // id not supported
      /\.id$/,
      // redundant reference data
      /\.in_scheme$/,
      /\.pref_label\..+/,
      /\.reference\.as_wkt$/,
      // remote resource fields unsupported in qvain
      /^\d+\.description\.\w+$/,
      /^\d+\.checksum$/,
      /^\d+\.mediatype$/,
    ]

    // fields missing from original that may be added to submit data
    const expectedExtra = []

    await renderQvain({ data_catalog: 'urn:nbn:fi:att:data-catalog-att' })
    const submitButton = screen.getByRole('button', { name: 'Save as draft' })
    await userEvent.click(submitButton) // should submit data to metax
    const submitResources = JSON.parse(mockAdapter.history.patch[0].data).remote_resources
    const flatResources = removeMatchingKeys(flatten(dataset.remote_resources), expectedMissing)
    const flatSubmitResources = removeMatchingKeys(flatten(submitResources), expectedExtra)
    expect(flatSubmitResources).toEqual(flatResources)
  })

  describe('updating cumulative state', () => {
    it('updates cumulative state for draft', async () => {
      await renderQvain({ cumulative_state: 0 })
      const cumulativeSelection = screen.getByText('Cumulative dataset').closest('div')
      const cumulativeButton = within(cumulativeSelection).getByLabelText('Yes.', { exact: false })
      await userEvent.click(cumulativeButton)
      const submitButton = screen.getByRole('button', { name: 'Save as draft' })
      await userEvent.click(submitButton)
      const submittedState = JSON.parse(mockAdapter.history.patch[0].data).cumulative_state
      expect(submittedState).toBe(1)
    })

    it('closes published cumulative dataset', async () => {
      await renderQvain({ cumulative_state: 1, state: 'published' })
      const cumulativeSelection = screen.getByText('Cumulative dataset').closest('div')
      const nonCumulativeButton = within(cumulativeSelection).getByRole('button', {
        name: 'Turn non-cumulative',
      })
      await userEvent.click(nonCumulativeButton)
      const submitButton = screen.getByRole('button', { name: 'Save and Publish' })
      await userEvent.click(submitButton)
      const submittedState = JSON.parse(mockAdapter.history.patch[0].data).cumulative_state
      expect(submittedState).toBe(2)
    })

    it('keeps closed cumulative dataset closed', async () => {
      await renderQvain({ cumulative_state: 2, state: 'published' })
      const submitButton = screen.getByRole('button', { name: 'Save and Publish' })
      await userEvent.click(submitButton)
      const submittedState = JSON.parse(mockAdapter.history.patch[0].data).cumulative_state
      expect(submittedState).toBe(2)
    })
  })

  describe('when saving draft', () => {
    const saveDraft = async (overrides = {}) => {
      await renderQvain(overrides)
      const submitButton = screen.getByRole('button', { name: 'Save as draft' })
      await userEvent.click(submitButton)
    }

    it('given draft, should update dataset directly', async () => {
      await saveDraft({ state: 'draft' })
      await waitFor(() => expect(routerLocation.pathname).toBe(`/dataset/${dataset.id}`))
      expect(mockAdapter.history.patch[0].url).toBe(`https://metaxv3:443/v3/datasets/${dataset.id}`)
      expect(mockAdapter.history.post.length).toBe(0)
    })

    it('given published, should create linked draft', async () => {
      await saveDraft({ state: 'published' })
      // qvain should be redirected to linked draft
      await waitFor(() => expect(routerLocation.pathname).toBe(`/dataset/linked-draft-id`))
      expect(mockAdapter.history.post.length).toBe(1)
      expect(mockAdapter.history.post[0].url).toBe(
        `https://metaxv3:443/v3/datasets/${dataset.id}/create-draft`
      )
      expect(mockAdapter.history.patch[0].url).toBe(
        `https://metaxv3:443/v3/datasets/linked-draft-id`
      )
    })
  })

  describe('when publishing', () => {
    const publish = async (overrides = {}, options = {}) => {
      await renderQvain(overrides, options)
      const submitButton = screen.getByRole('button', { name: 'Save and Publish' })
      await userEvent.click(submitButton)
    }

    it('given new draft, should update and publish dataset', async () => {
      await publish({ state: 'draft' })
      await waitFor(() => expect(routerLocation.pathname).toBe(`/`))
      expect(mockAdapter.history.patch[0].url).toBe(`https://metaxv3:443/v3/datasets/${dataset.id}`)
      expect(mockAdapter.history.post[0].url).toBe(
        `https://metaxv3:443/v3/datasets/${dataset.id}/publish`
      )
    })

    it('given linked draft, should update and publish dataset', async () => {
      await publish({ state: 'draft' }, { initialPath: '/dataset/linked-draft-id' })
      await waitFor(() => expect(routerLocation.pathname).toBe(`/`))
      expect(mockAdapter.history.patch[0].url).toBe(
        `https://metaxv3:443/v3/datasets/linked-draft-id`
      )
      expect(mockAdapter.history.post[0].url).toBe(
        `https://metaxv3:443/v3/datasets/linked-draft-id/publish`
      )
    })

    it('given published, should update dataset directly', async () => {
      await publish({ state: 'published' })
      await waitFor(() => expect(routerLocation.pathname).toBe(`/`))
      expect(mockAdapter.history.post.length).toBe(0)
      expect(mockAdapter.history.patch[0].url).toBe(`https://metaxv3:443/v3/datasets/${dataset.id}`)
    })
  })

  it('shows spatial in modal', async () => {
    // check spatials are present
    const section = await renderSection('Geographical area')
    expect(within(section).getByText('Random Address in Helsinki')).toBeInTheDocument()

    const espooAddress = within(section).getByText('Another Random Address in Espoo')
    expect(espooAddress).toBeInTheDocument()

    // open modal
    const editButton = within(espooAddress.closest('div')).getByRole('button', { name: 'Edit' })
    await userEvent.click(editButton)
    const modal = screen.getByRole('dialog')
    expect(
      within(modal).getByRole('heading', { name: 'Edit Geographical area' })
    ).toBeInTheDocument()

    // check input values are present
    expect(within(modal).getByLabelText('Name*').value).toEqual('Another Random Address in Espoo')
    expect(within(modal).getByLabelText('Address').value).toEqual('Itätuulenkuja 3, Espoo')
    expect(within(modal).getByLabelText('Altitude').value).toEqual('1337')

    expect(
      within(document.getElementById('location-input')).getByText('Tapiola')
    ).toBeInTheDocument()

    const customGeometry = within(modal)
      .getByText('Add geometry using WKT format in WGS84 coordinate system')
      .closest('div')
    expect(within(customGeometry).getByDisplayValue('POINT(22 61)')).toBeInTheDocument()
  })

  it('shows relation in modal', async () => {
    // check that relations are present
    const section = await renderSection('Related publications and other material')

    const relationItem = within(section).getByText('Related dataset')
    expect(relationItem).toBeInTheDocument()

    // open modal
    const editButton = within(relationItem.closest('div')).getByRole('button', { name: 'Edit' })
    await userEvent.click(editButton)
    const modal = screen.getByRole('dialog')
    expect(
      within(modal).getByRole('heading', { name: 'Edit reference to other material' })
    ).toBeInTheDocument()

    // check that input values are present
    expect(
      within(document.getElementById('entityType-input')).getByText('Dataset')
    ).toBeInTheDocument()
    expect(
      within(document.getElementById('relationType-input')).getByText('Cites')
    ).toBeInTheDocument()

    expect(within(modal).getByLabelText('Name', { exact: false }).value).toEqual('Related dataset')
    expect(within(modal).getByLabelText('Description').value).toEqual(
      'This is the description of a dataset.'
    )
    expect(within(modal).getByLabelText('Identifier').value).toEqual('doi:some_dataset')
  })

  it('shows remote resources in modal', async () => {
    const section = await renderSection('Data Origin *', {
      data_catalog: 'urn:nbn:fi:att:data-catalog-att',
    })

    // "Remote Resources" should be selected
    const attButton = within(section)
      .getByText('Choose "Remote Resources"', { exact: false })
      .closest('button')
    expect(attButton).toHaveClass('selected')

    // open modal
    const remoteResource = within(section).getByText('Dataset Remote Resource')
    const editButton = within(remoteResource.closest('div')).getByRole('button', { name: 'Edit' })
    await userEvent.click(editButton)
    const modal = screen.getByRole('dialog')
    expect(within(modal).getByRole('heading', { name: 'Edit remote resource' })).toBeInTheDocument()

    // check input values are present
    expect(within(modal).getByLabelText('Title', { exact: false }).value).toEqual(
      'Dataset Remote Resource'
    )
    expect(within(modal).getByLabelText('Access URL').value).toEqual('https://access.url')
    expect(within(modal).getByLabelText('Download URL').value).toEqual('https://download.url')

    expect(
      within(within(modal).getByText('Use Category').closest('div')).getByText('Source material')
    ).toBeInTheDocument()
    expect(
      within(within(modal).getByText('File Type').closest('div')).getByText('Audiovisual')
    ).toBeInTheDocument()
  })

  it('shows embargo date and restriction grounds', async () => {
    const section = await renderSection('Data Origin *', {
      access_rights: access_rights_embargo,
    })

    expect(within(section).getByLabelText('Embargo expiration date').value).toEqual('12/24/2023')

    expect(
      within(within(section).getByText('Restriction Grounds').closest('div')).getByText(
        'Restriced access for research based on contract'
      )
    ).toBeInTheDocument()
  })

  it('when submit draft is clicked, submits restriction grounds and embargo date', async () => {
    // fields not expected to be present in the submitted data
    const expectedMissing = [
      // id not supported
      /id$/,
      // redundant reference data
      /\.in_scheme$/,
      /\.pref_label\..+/,
      /\.reference\.as_wkt$/,
      // not supported yet
      'description',
      /license\.\d+\.description$/,
      /license\.0.custom_url$/, // license-0 has no custom url
      /license\.1.url$/, // license-1 has custom url so url is hidden
    ]

    // fields missing from original that may be added to submit data
    const expectedExtra = []

    await renderQvain({
      access_rights: access_rights_embargo,
    })
    const submitButton = screen.getByRole('button', { name: 'Save as draft' })
    await userEvent.click(submitButton) // should submit data to metax
    const submitRights = JSON.parse(mockAdapter.history.patch[0].data).access_rights
    const flatRights = removeMatchingKeys(flatten(access_rights_embargo), expectedMissing)
    const flatSubmitResources = removeMatchingKeys(flatten(submitRights), expectedExtra)
    expect(flatSubmitResources).toEqual(flatRights)
  })

  describe('when dataset is in preservation', () => {
    it('renders dataset in read-only mode when PAS process is running', async () => {
      await renderQvain({ preservation: { pas_process_running: true } })
      expect(
        screen.getByText(
          'The dataset is being processed by the Digital Preservation Service.' +
            ' You can view metadata but cannot make any changes.'
        )
      ).toBeInTheDocument()
      const input = document.getElementById('titleInput')
      expect(input.hasAttribute('disabled')).toBe(true)
    })

    it('shows notification when PAS package has been created', async () => {
      await renderQvain({ preservation: { pas_package_created: true } })
      expect(
        screen.getByText(
          'NOTE! Changes made to the metadata do NOT affect the version in Digital Preservation but are only visible in Etsin.'
        )
      ).toBeInTheDocument()
      const input = document.getElementById('titleInput')
      expect(input.hasAttribute('disabled')).toBe(false)
    })
  })

  it('shows data access fields for "permit" access type', async () => {
    await renderQvain({
      access_rights: {
        ...dataset.access_rights,
        access_type: access_type_permit,
        restriction_grounds: [restriction_grounds_research],
      },
    })
    const collapseButton = screen.getByTestId('toggle-data-access')
    await userEvent.click(collapseButton) // should open data access fields

    // Test text input for data access fields
    const fields = screen.getByTestId('data-access-fields')
    const applicationInput = within(fields).getByLabelText('how to apply for permission', {
      exact: false,
    })
    await userEvent.type(applicationInput, 'how to apply')
    const reviewerInput = within(fields).getByLabelText('instructions for approvers', {
      exact: false,
    })
    await userEvent.type(reviewerInput, 'instructions')
    const termsInput = within(fields).getByLabelText('terms for data access', { exact: false })
    await userEvent.type(termsInput, 'terms')

    // Test changing language tab
    const finnishTab = within(fields).getByRole('tab', {
      name: 'Finnish',
    })
    await userEvent.click(finnishTab)
    const applicationInputFi = within(fields).getByLabelText('how to apply for permission', {
      exact: false,
    })
    await userEvent.type(applicationInputFi, 'näin haet')

    // Select approval type
    const approvalGroup = screen.getByRole('group', { name: /approval type/i })
    await userEvent.click(within(approvalGroup).getByLabelText('Automatic'))

    // Check values get submitted
    const submitButton = screen.getByRole('button', { name: 'Save as draft' })
    await userEvent.click(submitButton) // should submit data to metax
    const submitRights = JSON.parse(mockAdapter.history.patch[0].data).access_rights
    expect(submitRights).toEqual(
      expect.objectContaining({
        rems_approval_type: 'automatic',
        data_access_application_instructions: { en: 'how to apply', fi: 'näin haet' },
        data_access_terms: { en: 'terms' },
        data_access_reviewer_instructions: { en: 'instructions' },
      })
    )
  })
})
