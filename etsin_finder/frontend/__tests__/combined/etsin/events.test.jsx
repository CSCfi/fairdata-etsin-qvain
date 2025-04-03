import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter, Route } from 'react-router-dom'
import { configure } from 'mobx'

import etsinTheme from '@/styles/theme'
import '@/../locale/translations'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import { versionTitles } from '../../__testdata__/dataset.ida'
import deprecatedDataset from '../../__testdata__/metaxv3/datasets/dataset_ida_c_deprecated'
import pasUseCopy from '../../__testdata__/metaxv3/datasets/dataset_ida_c_pasUseCopy'
import pasPreservationCopy from '../../__testdata__/metaxv3/datasets/dataset_ida_c_preservationCopy'
import Events from '@/components/etsin/Dataset/events'

deprecatedDataset.preservation_dataset_origin_version = {
  preferred_identifier: 'urn:nbn:fi:origin-of-preserved-dataset',
}

const identifier = deprecatedDataset.identifier
const path = `/dataset/${identifier}/events`

configure({ safeDescriptors: false })
const stores = buildStores()

const { dateFormat } = stores.Locale

configure({ safeDescriptors: true })
stores.Accessibility.handleNavigation = jest.fn()

const versionsToStores = () => {
  const versions = deprecatedDataset.dataset_versions
  for (const version in versions) {
    stores.Etsin.EtsinDataset.set('versions', versions[version])
  }
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

  const render = async (dataset = deprecatedDataset) => {
    jest.resetAllMocks()
    stores.Etsin.EtsinDataset.set('dataset', dataset)
    versionsToStores()

    wrapper = mount(
      <StoresProvider store={stores}>
        <MemoryRouter initialEntries={[path]}>
          <ThemeProvider theme={etsinTheme}>
            <Route path="/dataset/:identifier/events">
              <Events id="tab-events" dataset={dataset} versionTitles={versionTitles} />
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
  }

  it('should render provenances, deprecations and version deletions in events table', async () => {
    await render()
    tableToObjects(sections['Events']).should.eql([
      {
        'Event type': 'Checked (Unknown)',
        Who: 'Aalto University',
        When: `${dateFormat('2021-02-03')} – ${dateFormat('2021-02-23')}`,
        'Title and Description': 'Provenance nameProvenance description',
        Where: 'Bytom (Provenanssipaikka)',
      },
      {
        'Event type': 'Checked',
        Who: 'Aalto University',
        When: `– ${dateFormat('2021-02-23')}`,
        'Title and Description': 'Provenance name2Provenance description2',
        Where: 'Provenanssipaikka2',
      },
      {
        'Event type': 'Deprecated',
        Who: '-',
        When: dateFormat('2021-12-22T14:29:15+02:00'),
        'Title and Description': 'Data removedOriginal data removed from Fairdata IDA',
        Where: '-',
      },
      {
        'Event type': 'Deleted',
        Who: '-',
        When: dateFormat('2021-12-20T14:28:54+02:00'),
        'Title and Description':
          'Dataset deletionDeleted dataset version: 1Identifier of deleted dataset: 1af9f528-e7a7-43e4-9051-b5d07e889cde',
        Where: '-',
      },
    ])
  })

  it('should render other identifiers', async () => {
    await render()
    sections['Other identifiers']
      .find('li')
      .map(li => li.text())
      .should.eql(['https://doi.org/identifier', 'https://doi.org/another_identifier'])
  })

  it('should render relations', async () => {
    await render()
    tableToObjects(sections['Relations']).should.eql([
      {
        Identifier: 'Identifier:1234-aaaaa-tunniste',
        'Title and Description': 'Resource in EnglishShow Description',
        Type: 'Cites (Collection)',
      },
    ])
  })

  it('should render origin dataset identifier', async () => {
    await render()
    sections['Origin dataset identifier']
      .find('li')
      .map(li => li.text())
      .should.eql(['urn:nbn:fi:origin-of-preserved-dataset'])
  })

  it('should render deleted versions', async () => {
    await render()
    tableToObjects(sections['Deleted versions']).should.eql([
      {
        Version: '1',
        'Delete date': '2021-12-20',
        'Link to dataset': '1af9f528-e7a7-43e4-9051-b5d07e889cde',
      },
    ])
  })

  it('should render other existing versions', async () => {
    await render()
    tableToObjects(sections['Versions']).should.eql([
      {
        Identifier: 'http://urn.fi/urn:nbn:fi:att:12345688-4867-47f7-9874-112233445566',
        Number: '5',
        Title: 'English Title 4',
        Type: 'Older',
      },
      {
        Identifier: 'http://urn.fi/urn:nbn:fi:att:12345677-4867-47f7-9874-112233445566',
        Number: '4',
        Title: 'English Title 3',
        Type: 'Older',
      },
      {
        Identifier: 'http://urn.fi/urn:nbn:fi:att:12345678-4867-47f7-9874-112233445566',
        Number: '3',
        Title: 'English Title 2',
        Type: 'Older',
      },
      {
        Identifier: 'http://urn.fi/urn:nbn:fi:att:162e04c5-857b-477c-a452-cd063ee3c44d',
        Number: '2',
        Title: 'English Title',
        Type: 'Older',
      },
    ])
  })

  describe('digital preservation datasets', () => {
    it('should render copy creation event for original version', async () => {
      await render(pasUseCopy)
      tableToObjects(sections['Events']).should.eql([
        {
          'Title and Description':
            'Copy created into Digital PreservationClick here to open the Digital Preservation Service version',
          'Event type': '-',
          When: 'December 22, 2021',
          Who: '-',
          Where: '-',
        },
      ])
    })

    it('should render creation event for preservation version', async () => {
      await render(pasPreservationCopy)
      tableToObjects(sections['Events']).should.eql([
        {
          'Title and Description': 'Created in Digital PreservationClick here to open the use copy',
          'Event type': '-',
          When: 'October 13, 2022',
          Who: '-',
          Where: '-',
        },
      ])
    })
  })
})
