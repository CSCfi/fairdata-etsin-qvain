import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter, Route } from 'react-router-dom'
import { axe } from 'jest-axe'
import ReactModal from 'react-modal'
import { observable, when } from 'mobx'

import etsinTheme from '@/styles/theme'
import '@/../locale/translations'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import dataset from '../../__testdata__/dataset.ida'
import Dataset from '@/components/dataset'
import Description from '@/components/dataset/description'
import Maps from '@/components/dataset/maps'
import Events from '@/components/dataset/events'
import ExternalResources from '@/components/dataset/data/externalResources'
import axios from 'axios'

jest.mock('axios')

dataset.preservation_dataset_origin_version = {
  preferred_identifier: 'urn:nbn:fi:origin-of-preserved-dataset',
}

const datasetsCalls = observable.array([])

const identifier = dataset.identifier
const path = `/dataset/${identifier}/events`

const stores = buildStores()
stores.Accessibility.handleNavigation = jest.fn()

const flushPromises = () => new Promise(setImmediate)

const mockGet = () => {
  axios.get = jest.fn((...args) => {
    datasetsCalls.push(JSON.parse(JSON.stringify(args)))
    return Promise.resolve({
      data: {
        catalog_record: dataset,
        email_info: {
          CONTRIBUTOR: false,
          CREATOR: false,
          CURATOR: false,
          PUBLISHER: false,
          RIGHTS_HOLDER: false,
        },
      },
    })
  })
}

const tableToObjects = tableWrapper => {
  // convert table rows into objects, use table headers as keys
  const table = tableWrapper.find('table').first()
  const labels = table.find('th').map(th => th.text().trim())
  const rowWrappers = table.find('tbody tr')
  const rows = []
  rowWrappers.map(rowWrapper => {
    const row = {}
    rowWrapper.find('td').map((tdWrapper, index) => {
      row[labels[index]] = tdWrapper.text().trim()
    })
    rows.push(row)
  })
  return rows
}

describe('Events page', () => {
  let wrapper, sections

  beforeAll(async () => {
    jest.resetAllMocks()

    wrapper = mount(
      <StoresProvider store={stores}>
        <MemoryRouter initialEntries={[path]}>
          <ThemeProvider theme={etsinTheme}>
            <Route path="/dataset/:identifier/events">
              <Events id="tab-events" dataset={dataset} />
            </Route>
          </ThemeProvider>
        </MemoryRouter>
      </StoresProvider>
    )

    // get wrappers for sections by title
    sections = wrapper.find('section#tab-events section').reduce((map, section) => {
      const title = section.children().filter('h2').text()
      const content = section.children().filter(':not(h2)')
      map[title] = content
      return map
    }, {})
  })

  it('should render provenances and version deletions in events table', async () => {
    tableToObjects(sections['Events']).should.eql([
      {
        Event: 'Checked',
        Who: 'Aalto University',
        When: 'February 3, 2021, 02:00 AM – February 23, 2021, 02:00 AM',
        Title: 'Provenance name',
        Description: 'Provenance description',
      },
      {
        Event: 'Dataset deletion',
        Who: '-',
        When: 'December 20, 2021, 02:28 PM',
        Title: 'Deleted dataset version: 1',
        Description: '/dataset/1af9f528-e7a7-43e4-9051-b5d07e889cde',
      },
    ])
  })

  it('should render other identifiers', async () => {
    sections['Other identifiers']
      .find('li')
      .map(li => li.text())
      .should.eql(['https://doi.org/identifier', 'https://doi.org/another_identifier'])
  })

  it('should render relations', async () => {
    tableToObjects(sections['Relations']).should.eql([
      {
        Identifier: 'Identifier:1234-aaaaa-tunniste',
        Title: 'Resource in English',
        Type: 'Cites',
      },
    ])
  })

  it('should render origin dataset identifier', async () => {
    sections['Origin dataset identifier']
      .find('li')
      .map(li => li.text())
      .should.eql(['urn:nbn:fi:origin-of-preserved-dataset'])
  })

  it('should render deleted versions', async () => {
    tableToObjects(sections['Deleted versions']).should.eql([
      {
        Version: '1',
        'Delete date': '2021-12-20',
        'Link to dataset': '/dataset/1af9f528-e7a7-43e4-9051-b5d07e889cde',
      },
    ])
  })
})
