import React from 'react'
import { ThemeProvider } from 'styled-components'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import ReactModal from 'react-modal'

import { MemoryRouter, Route } from 'react-router-dom'

import { screen, render, within, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import parseDateISO from 'date-fns/parseISO'

import '../../../locale/translations'
import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'

import dataset, { accessRightsEmbargo } from '../../__testdata__/v3dataset.data'
import Qvain from '@/components/qvain/views/main'
import { flatten, removeMatchingKeys } from '@/utils/flatten'

// axios mocks
const mockAdapter = new MockAdapter(axios)
mockAdapter.onGet(new RegExp('/v3/reference-data/.*')).reply(200, [])
beforeEach(() => {
  mockAdapter.resetHistory()
})

// rendering helpers
const getSection = name => screen.getByRole('heading', { name }).parentElement

const renderQvain = async (overrides = {}) => {
  const metaxDataset = { ...dataset, ...overrides }
  mockAdapter.onGet(`https://metaxv3:443/v3/datasets/${metaxDataset.id}`).reply(200, metaxDataset)
  mockAdapter.onPut(`https://metaxv3:443/v3/datasets/${metaxDataset.id}`).reply(200, metaxDataset)

  const stores = buildStores()
  stores.Env.Flags.setFlag('QVAIN.METAX_V3.FRONTEND', true)
  stores.Env.setMetaxV3Host('metaxv3', 443)

  render(
    <ThemeProvider theme={etsinTheme}>
      <MemoryRouter initialEntries={[`/dataset/${metaxDataset.id}`]}>
        <StoresProvider store={stores}>
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
      .closest('[class*=ValueContainer]')
    for (const value of values) {
      expect(within(multivalue).getByText(value, { exact })).toBeInTheDocument()
    }
  })

  it('when submit draft is clicked, submits all supported fields from dataset', async () => {
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
      'persistent_identifier',
      'cumulation_started',
      /^metadata_owner\..+/,
      // id not supported
      /\.id$/,
      // redundant reference data
      /\.in_scheme$/,
      /\.pref_label\..+/,
      /\.reference\.as_wkt$/,
      // fields not yet supported
      /^actors\./,
      /^access_rights\.description/,
      /license\.\d+\.custom_url$/,
      /license\.\d+\.description$/,
      /provenance\.\d+\..+/,
      // special handling
      /remote_resources\.\d+\..+/, // not supported for ida dataset
      'issued', // exact value may change
    ]

    // fields missing from original that may be added to submit data
    const expectedExtra = [
      'title.sv',
      'description.sv',
      /\.und$/,
      // special handling
      'issued', // exact value may change
    ]

    await renderQvain()
    const submitButton = screen.getByRole('button', { name: 'Save as draft' })
    await userEvent.click(submitButton) // should submit data to metax
    const submitData = JSON.parse(mockAdapter.history.put[0].data)

    // issued date might not have same timezone but should represent same date
    const datasetIssued = parseDateISO(dataset.issued).getTime()
    const submitIssued = parseDateISO(submitData.issued).getTime()
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

  it('when submit draft is clicked, submits remote resources for ATT dataset', async () => {
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
    const submitResources = JSON.parse(mockAdapter.history.put[0].data).remote_resources
    const flatResources = removeMatchingKeys(flatten(dataset.remote_resources), expectedMissing)
    const flatSubmitResources = removeMatchingKeys(flatten(submitResources), expectedExtra)
    expect(flatSubmitResources).toEqual(flatResources)
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
    const section = await renderSection('Data Origin', {
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
    const section = await renderSection('Data Origin', {
      access_rights: accessRightsEmbargo,
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
      "description",
      /license\.\d+\.custom_url$/,
      /license\.\d+\.description$/,
    ]

    // fields missing from original that may be added to submit data
    const expectedExtra = []

    await renderQvain({
      access_rights: accessRightsEmbargo,
    })
    const submitButton = screen.getByRole('button', { name: 'Save as draft' })
    await userEvent.click(submitButton) // should submit data to metax
    const submitRights = JSON.parse(mockAdapter.history.put[0].data).access_rights
    const flatRights = removeMatchingKeys(flatten(accessRightsEmbargo), expectedMissing)
    const flatSubmitResources = removeMatchingKeys(flatten(submitRights), expectedExtra)
    expect(flatSubmitResources).toEqual(flatRights)
  })
})