import React from 'react'
import { mount } from 'enzyme'
import { when } from 'mobx'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ThemeProvider } from 'styled-components'
import { MemoryRouter, Route } from 'react-router-dom'
import ReactModal from 'react-modal'

import '@/../locale/translations'
import etsinTheme from '@/styles/theme'
import datasets from '../../__testdata__/qvain.datasets'
import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import DatasetsV2 from '@/components/qvain/views/datasetsV2'

jest.useFakeTimers('modern')
jest.setSystemTime(new Date('2021-05-07T10:00:00Z'))

jest.mock('axios')

let stores, wrapper, helper, testLocation

beforeEach(() => {
  axios.get.mockReturnValue(
    Promise.resolve({
      data: datasets,
    })
  )
})

const wait = async cond => {
  let counter = 0
  while (!cond()) {
    counter += 1
    if (counter > 100) {
      throw new Error('Wait timed out')
    }
    jest.advanceTimersByTime(1000)
    await Promise.resolve()
    wrapper.update()
  }
}

const render = async () => {
  wrapper?.unmount?.()
  if (helper) {
    document.body.removeChild(helper)
    helper = null
  }
  stores = buildStores()
  stores.Env.app = 'qvain'
  stores.Auth.setUser({
    name: 'teppo',
  })
  stores.Env.Flags.setFlag('UI.NEW_DATASETS_VIEW', true)

  helper = document.createElement('div')
  document.body.appendChild(helper)
  ReactModal.setAppElement(helper)
  wrapper = mount(
    <StoresProvider store={stores}>
      <MemoryRouter>
        <Route
          path="*"
          render={({ location }) => {
            testLocation = location
            return null
          }}
        />
        <ThemeProvider theme={etsinTheme}>
          <DatasetsV2 />
        </ThemeProvider>
      </MemoryRouter>
    </StoresProvider>,
    { attachTo: helper }
  )

  // wait until datasets have been fetched
  await when(
    () => stores.QvainDatasets.datasetGroupsOnPage.length > 0 || stores.QvainDatasets.error
  )
  wrapper.update()
}

const findDatasetWithTitle = title =>
  wrapper
    .find('td.dataset-title')
    .filterWhere(e => e.text().includes(title))
    .closest('tr')

const findDatasetWithTitleExact = title => {
  const dataset = wrapper.find(`td.dataset-title span[children="${title}"]`)
  if (dataset.length === 0) {
    return dataset
  }
  return dataset.closest('tr')
}

describe('DatasetsV2', () => {
  describe('given error', () => {
    beforeEach(async () => {
      axios.get.mockReturnValueOnce(Promise.reject('this is not supposed to happen'))
      await render()
    })

    it('should show error', async () => {
      wrapper.text().should.include('this is not supposed to happen')
    })

    it('should reload datasets when button is clicked', async () => {
      wrapper.find('button[children="Reload"]').simulate('click')
      await wait(() => wrapper.find('tbody').length > 0)
      wrapper.find('tbody').length.should.eql(7)
    })
  })

  describe('create new dataset', () => {
    it('should redirect to /dataset', async () => {
      await render()
      testLocation.pathname.should.eql('/')
      const createNewBtn = wrapper.find('button[children="Create a new dataset"]')
      createNewBtn.simulate('click')
      testLocation.pathname.should.eql('/dataset')
    })
  })

  describe('given multiple dataset versions', () => {
    it('should toggle visibility of previous versions', async () => {
      await render()
      findDatasetWithTitleExact('IDA dataset').should.have.lengthOf(0)
      let dataset = findDatasetWithTitle('IDA dataset version 2')
      const showPrev = dataset.find('svg[aria-label="Show previous versions"]')

      // show previous versions
      showPrev.simulate('click')
      wrapper.find('td[children="Previous versions"]').should.have.lengthOf(1)
      const previousDataset = findDatasetWithTitleExact('IDA dataset')
      previousDataset.should.have.lengthOf(1)
      previousDataset.find('span[children="Version 1"]').should.have.lengthOf(1)

      // hide previous versions
      dataset = findDatasetWithTitle('IDA dataset version 2')
      const hidePrev = dataset.find('svg[aria-label="Hide previous versions"]')
      hidePrev.simulate('click')
      wrapper.find('td[children="Previous versions"]').should.have.lengthOf(0)
      findDatasetWithTitleExact('IDA dataset').should.have.lengthOf(0)
    })
  })

  describe('show more', () => {
    it('should show more datasets', async () => {
      await render()
      const getMoreBtn = () => wrapper.find('span[children*="Show more"]').closest('button')
      stores.QvainDatasetsV2.setShowCount({ initial: 4, current: 4, increment: 2 })
      wrapper.update()
      wrapper.find('tbody').length.should.eql(4)
      getMoreBtn().simulate('click')
      wrapper.find('tbody').length.should.eql(6)
      getMoreBtn().simulate('click')
      wrapper.find('tbody').length.should.eql(7)
    })
  })

  describe('PublishSuccess', () => {
    it('should hide when close button is clicked', async () => {
      await render()
      stores.QvainDatasets.setPublishedDataset('someDatasetIdentifier')
      wrapper.update()
      wrapper.find('span[children="Dataset published!"]').length.should.eql(1)
      wrapper.find('span[children="hide notice"]').simulate('click')
      wrapper.find('span[children="Dataset published!"]').length.should.eql(0)
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

  describe('Share button', () => {
    it('should open modal', async () => {
      await render()
      const dataset = findDatasetWithTitle('IDA dataset')
      const shareButton = dataset.find(`button[aria-label="Share"]`)
      wrapper.find('[aria-label="shareDatasetModal"]').should.have.lengthOf(0)
      shareButton.simulate('click')
      wrapper.find('[aria-label="shareDatasetModal"]').should.have.lengthOf(1)
    })
  })
})
