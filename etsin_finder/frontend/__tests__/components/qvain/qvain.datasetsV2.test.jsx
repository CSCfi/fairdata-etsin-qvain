import React from 'react'
import { mount } from 'enzyme'
import { when } from 'mobx'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'

import '@/../locale/translations'
import etsinTheme from '@/styles/theme'
import datasets from '../../__testdata__/qvain.datasets'
import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import DatasetsV2 from '@/components/qvain/views/datasetsV2'

jest.useFakeTimers('modern')
jest.setSystemTime(new Date('2021-05-07T10:00:00Z'))

jest.mock('axios')
axios.get = jest.fn((...args) => {
  return Promise.resolve({
    data: datasets,
  })
})

let stores, wrapper

const render = async () => {
  wrapper?.unmount?.()
  stores = buildStores()
  stores.Auth.setUser({
    name: 'teppo',
  })
  stores.Env.Flags.setFlag('UI.NEW_DATASETS_VIEW', true)
  wrapper = mount(
    <StoresProvider store={stores}>
      <BrowserRouter>
        <ThemeProvider theme={etsinTheme}>
          <DatasetsV2 />
        </ThemeProvider>
      </BrowserRouter>
    </StoresProvider>
  )

  // wait until datasets have been fetched
  await when(() => stores.QvainDatasets.datasetGroupsOnPage.length > 0)
  wrapper.update()
}

const findDatasetWithTitle = title =>
  wrapper
    .find('td.dataset-title')
    .filterWhere(e => e.text().includes(title))
    .closest('tr')

describe('DatasetsV2', () => {
  describe('show more', () => {
    it('should show more datasets', async () => {
      await render()
      const getMoreBtn = () =>
        wrapper.find('button').filterWhere(btn => btn.prop('children').includes?.('Show more'))
      stores.QvainDatasetsV2.setShowCount({ initial: 4, current: 4, increment: 2 })
      wrapper.update()
      wrapper.find('tbody').length.should.eql(4)
      getMoreBtn().simulate('click')
      wrapper.find('tbody').length.should.eql(6)
      getMoreBtn().simulate('click')
      wrapper.find('tbody').length.should.eql(7)
    })
  })

  describe('publication status', () => {
    beforeAll(async () => {
      await render()
    })

    it('should show Draft', async () => {
      const dataset = findDatasetWithTitle('Draft 5 by me')
      dataset.find('td.dataset-state').text().should.include('Draft')
    })

    it('should show Published', async () => {
      const dataset = findDatasetWithTitle('IDA dataset')
      dataset.find('td.dataset-state').text().should.include('Published')
    })

    it('should show Unpublished changes', async () => {
      const dataset = findDatasetWithTitle('Changes here')
      dataset.find('td.dataset-state').text().should.include('Unpublished changes')
    })
  })

  describe('dataset owner', () => {
    beforeAll(async () => {
      await render()
    })

    it('should show Me as owner of dataset', async () => {
      const dataset = findDatasetWithTitle('Draft 5 by me')
      dataset.find('td.dataset-owner span').prop('children').should.eql('Me')
    })

    it('should show Me as owner of dataset that also has a project', async () => {
      const dataset = findDatasetWithTitle('Draft 3 by me and project')
      dataset.find('td.dataset-owner span').prop('children').should.eql('Me')
    })

    it('should show Project as owner of project dataset', async () => {
      const dataset = findDatasetWithTitle('Draft 4 by project')
      dataset
        .find('td.dataset-owner')
        .find(FontAwesomeIcon)
        .prop('aria-label')
        .should.eql('Project')
    })
  })

  describe('date created', () => {
    beforeAll(async () => {
      await render()
    })

    it('should show "6 days ago"', async () => {
      const dataset = findDatasetWithTitle('Changes here')
      dataset.find('td.dataset-created').text().should.eql('6 days ago')
    })

    it('should show "3 months ago"', async () => {
      const dataset = findDatasetWithTitle('Draft 5 by me')
      dataset.find('td.dataset-created').text().should.eql('3 months ago')
    })
  })

  describe('actions', () => {
    beforeAll(async () => {
      await render()
    })

    // dataset rows
    const PUBLISHED = { title: 'IDA dataset', msg: 'published dataset' }
    const CHANGED = { title: 'Changes here', msg: 'changed dataset' }
    const DRAFT = { title: 'Draft 2', msg: 'draft dataset' }

    // action items
    const BUTTON = { button: true, msg: 'button', no: '' } // icon button
    const MENU = { menu: true, msg: 'dropdown item', no: '' }
    const BOTH = { button: true, menu: true, msg: 'button and dropdown item', no: '' }
    const NONE = { button: false, menu: false, msg: 'action', no: ' not' }

    test.each`
      row          | label                   | items
      ${PUBLISHED} | ${'Edit'}               | ${BUTTON}
      ${PUBLISHED} | ${'View in Etsin'}      | ${BOTH}
      ${PUBLISHED} | ${'Share'}              | ${BOTH}
      ${PUBLISHED} | ${'Use as template'}    | ${MENU}
      ${PUBLISHED} | ${'Create new version'} | ${MENU}
      ${PUBLISHED} | ${'Revert changes'}     | ${NONE}
      ${PUBLISHED} | ${'Delete'}             | ${MENU}
      ${CHANGED}   | ${'Edit draft'}         | ${BUTTON}
      ${CHANGED}   | ${'Preview in Etsin'}   | ${BOTH}
      ${CHANGED}   | ${'Share'}              | ${BOTH}
      ${CHANGED}   | ${'Use as template'}    | ${MENU}
      ${CHANGED}   | ${'Create new version'} | ${NONE}
      ${CHANGED}   | ${'Revert changes'}     | ${MENU}
      ${CHANGED}   | ${'Delete'}             | ${MENU}
      ${DRAFT}     | ${'Edit'}               | ${BUTTON}
      ${DRAFT}     | ${'Preview in Etsin'}   | ${BOTH}
      ${DRAFT}     | ${'Share'}              | ${BOTH}
      ${DRAFT}     | ${'Use as template'}    | ${MENU}
      ${DRAFT}     | ${'Create new version'} | ${NONE}
      ${DRAFT}     | ${'Revert changes'}     | ${NONE}
      ${DRAFT}     | ${'Delete'}             | ${MENU}
    `(
      '$row.msg should$items.no have "$label" $items.msg',
      async ({ row, label, items: { button, menu } }) => {
        const dataset = findDatasetWithTitle(row.title)
        dataset.exists().should.be.true
        dataset.find(`button[aria-label="${label}"]`).should.have.lengthOf(button ? 1 : 0)
        dataset.find(`[role="menu"] span[children="${label}"]`).should.have.lengthOf(menu ? 1 : 0)
      }
    )
  })
})
