import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter, Route } from 'react-router-dom'
import { observable } from 'mobx'

import etsinTheme from '@/styles/theme'
import '@/../locale/translations'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import dataset from '../../__testdata__/dataset.ida'
import { deprecatedDataset, versionTitles } from '../../__testdata__/dataset.ida'
import Events from '@/components/dataset/events'
import axios from 'axios'

jest.mock('axios')

deprecatedDataset.preservation_dataset_origin_version = {
  preferred_identifier: 'urn:nbn:fi:origin-of-preserved-dataset',
}

const datasetsCalls = observable.array([])

const identifier = deprecatedDataset.identifier
const path = `/dataset/${identifier}/events`

const stores = buildStores()
stores.Accessibility.handleNavigation = jest.fn()

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
              <Events id="tab-events" dataset={deprecatedDataset} versionTitles={versionTitles} />
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

  it('should render provenances, deprecations and version deletions in events table', async () => {
    tableToObjects(sections['Events']).should.eql([
      {
        Event: 'Checked',
        Who: 'Aalto University',
        When: 'February 3, 2021, 02:00 AM – February 23, 2021, 02:00 AM',
        Title: 'Provenance name',
        Description: 'Provenance description',
      },
      {
        Event: 'Deprecated',
        Who: '-',
        When: 'December 22, 2021, 02:29 PM',
        Title: 'Data removed',
        Description: 'Original data removed from Fairdata IDA',
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

  it('should render other existing versions', async () => {
    tableToObjects(sections['Versions']).should.eql([
      {
        Identifier: 'http://urn.fi/urn:nbn:fi:att:12345677-4867-47f7-9874-112233445566',
        Number: '5',
        Title: 'English Title 3',
        Type: 'Latest',
      },
      {
        Identifier: 'http://urn.fi/urn:nbn:fi:att:12345688-4867-47f7-9874-112233445566',
        Number: '4',
        Title: 'English Title 4',
        Type: 'Newer',
      },
      {
        Identifier: 'http://urn.fi/urn:nbn:fi:att:12345678-4867-47f7-9874-112233445566',
        Number: '2',
        Title: 'English Title 2',
        Type: 'Older',
      },
    ])
  })
})
