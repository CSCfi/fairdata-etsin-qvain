import React from 'react'
import { ThemeProvider } from 'styled-components'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

import { MemoryRouter, Route } from 'react-router-dom'

import { screen, render, within, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import parseDateISO from 'date-fns/parseISO'

import '../../../locale/translations'
import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'

import dataset from '../../__testdata__/v3dataset.data'
import Qvain from '@/components/qvain/views/main'
import { flatten, removeMatchingKeys } from '@/utils/flatten'

// axios mocks
const mockAdapter = new MockAdapter(axios)
mockAdapter.onGet(new RegExp('/v3/reference-data/.*')).reply(200, [])
mockAdapter.onGet(`https://metaxv3:443/v3/datasets/${dataset.id}`).reply(200, dataset)
mockAdapter.onPut(`https://metaxv3:443/v3/datasets/${dataset.id}`).reply(200, dataset)
beforeEach(() => {
  mockAdapter.resetHistory()
})

// rendering helpers
const getSection = name => screen.getByRole('heading', { name }).parentElement

const renderQvain = async () => {
  const stores = buildStores()
  stores.Env.Flags.setFlag('QVAIN.METAX_V3.FRONTEND', true)
  stores.Env.setMetaxV3Host('metaxv3', 443)
  render(
    <ThemeProvider theme={etsinTheme}>
      <MemoryRouter initialEntries={[`/dataset/${dataset.id}`]}>
        <StoresProvider store={stores}>
          <Route path="/dataset/:identifier" component={Qvain} />
        </StoresProvider>
      </MemoryRouter>
    </ThemeProvider>
  )
  await waitForElementToBeRemoved(() => screen.queryByText('Loading dataset'))
}

const renderSection = async name => {
  await renderQvain()
  return getSection(name)
}

describe('Qvain with an opened IDA dataset', () => {
  it('shows IDA catalog as selected', async () => {
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
      // fields not yet supported
      /^actors\./,
      /^access_rights\.description/,
      /license\.\d+\.custom_url$/,
      /license\.\d+\.description$/,
      /spatial\.\d+\..+/,
      /temporal\.\d+\..+/,
      /provenance\.\d+\..+/,
      // special handling
      'issued', // exact value may change
    ]

    // fields missing from original that may be added to submit data
    const expectedExtra = [
      'title.sv',
      'description.sv',
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

    const flatDataset = removeMatchingKeys(flatten(dataset), expectedMissing)
    const flatSubmit = removeMatchingKeys(flatten(submitData), expectedExtra)

    expect(flatDataset).toEqual(flatSubmit)
  })
})
