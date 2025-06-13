import { waitFor, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { when } from 'mobx'

import ReactModal from 'react-modal'
import { MemoryRouter, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import DatasetsV2 from '@/components/qvain/views/datasetsV2'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import etsinTheme from '@/styles/theme'
import datasets from '../../__testdata__/qvain.datasets'

jest.useFakeTimers('modern')
jest.setSystemTime(new Date('2021-05-07T10:00:00Z'))

global.autoCleanup = false // Allow tests to share render results

const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

const mockAdapter = new MockAdapter(axios)

let stores, testLocation

beforeEach(() => {
  mockAdapter.reset()
  mockAdapter.onGet().reply(200, datasets)
})
const helper = document.createElement('div')
ReactModal.setAppElement(helper)

const renderDatasets = async () => {
  cleanup()

  stores = buildStores()
  stores.Locale.setLang('en')
  stores.Env.app = 'qvain'
  stores.Auth.setUser({
    name: 'teppo',
  })
  stores.Env.Flags.setFlag('UI.NEW_DATASETS_VIEW', true)

  render(
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
    </StoresProvider>
  )

  // wait until datasets have been fetched
  await when(() => stores.QvainDatasets.datasetGroups.length > 0 || stores.QvainDatasets.error)
}

const findDatasetWithTitle = title => {
  const titles = Array.from(document.querySelectorAll('td.dataset-title'))
  for (const dataset of titles) {
    if (dataset.textContent.includes(title)) {
      return dataset.closest('tr')
    }
  }
  return null
}
const findDatasetWithTitleExact = title => {
  const titles = Array.from(document.querySelectorAll('td.dataset-title'))
  for (const dataset of titles) {
    if (title === dataset.textContent) {
      return dataset.closest('tr')
    }
  }
  return null
}

describe('DatasetsV2', () => {
  describe('given error', () => {
    let spy
    beforeEach(async () => {
      spy = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockAdapter.onGet().reply(500, 'this is not supposed to happen')
    })

    afterEach(() => {
      spy.mockRestore?.()
    })

    it('should show error', async () => {
      await renderDatasets()
      expect(document.body.textContent).toContain('this is not supposed to happen')

      // should reload datasets when button is clicked'
      mockAdapter.onGet().reply(200, datasets)
      await user.click(screen.getByRole('button', { name: 'Reload' }))
      await waitFor(() => expect(document.querySelectorAll('tbody')).toHaveLength(7))
    })
  })

  describe('create new dataset', () => {
    it('should redirect to /dataset', async () => {
      await renderDatasets()
      testLocation.pathname.should.eql('/')
      const createNewBtn = screen.getByRole('button', { name: 'Describe a dataset' })
      await user.click(createNewBtn)
      testLocation.pathname.should.eql('/dataset')
    })
  })

  describe('given multiple dataset versions', () => {
    it('should toggle visibility of previous versions', async () => {
      await renderDatasets()
      expect(findDatasetWithTitleExact('IDA dataset')).toBe(null)
      let dataset = findDatasetWithTitle('IDA dataset version 2')
      const showPrev = dataset.querySelector('svg[aria-label="Show previous versions"]')

      // show previous versions
      await user.click(showPrev)

      expect(screen.getByRole('cell', { name: 'Previous versions' })).toBeInTheDocument()
      const previousDataset = findDatasetWithTitleExact('Version 1IDA dataset')
      expect(previousDataset).toBeInTheDocument()

      // hide previous versions
      dataset = findDatasetWithTitle('IDA dataset version 2')
      const hidePrev = dataset.querySelector('svg[aria-label="Hide previous versions"]')
      await user.click(hidePrev)

      expect(screen.queryByRole('cell', { name: 'Previous versions' })).not.toBeInTheDocument()
    })
  })

  describe('show more', () => {
    it('should show more datasets', async () => {
      await renderDatasets()
      stores.QvainDatasets.setShowCount({ initial: 4, current: 4, increment: 2 })
      await waitFor(() => document.querySelectorAll('tbody').length.should.eql(4))

      await user.click(screen.getByRole('button', { name: 'Show more >' }))
      await waitFor(() => document.querySelectorAll('tbody').length.should.eql(6))

      await user.click(screen.getByRole('button', { name: 'Show more >' }))
      await waitFor(() => document.querySelectorAll('tbody').length.should.eql(7))
    })
  })

  describe('PublishSuccess', () => {
    it('should hide when close button is clicked', async () => {
      await renderDatasets()
      stores.QvainDatasets.setPublishedDataset({
        identifier: 'someDatasetIdentifier',
        isNew: true,
      })
      expect(await screen.findByText('Dataset published!')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'hide notice' }))
      expect(screen.queryByText('Dataset published!')).not.toBeInTheDocument()
    })
  })

  describe('EditMetadataSuccess', () => {
    it('should show when dataset is updated', async () => {
      await renderDatasets()
      stores.QvainDatasets.setPublishedDataset({
        identifier: 'someDatasetIdentifier',
        isNew: false,
      })
      expect(await screen.findByText('Dataset successfully updated!')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'hide notice' }))
      expect(screen.queryByText('Dataset successfully updated!')).not.toBeInTheDocument()
    })
  })

  describe('publication status', () => {
    it('should publication status', async () => {
      await renderDatasets()

      // draft
      let dataset = findDatasetWithTitle('Draft 5 by me')
      dataset.querySelector('td.dataset-state').textContent.should.include('Draft')

      // published
      dataset = findDatasetWithTitle('IDA dataset')
      dataset.querySelector('td.dataset-state').textContent.should.include('Published')

      // unpublished changes
      dataset = findDatasetWithTitle('Changes here')
      dataset.querySelector('td.dataset-state').textContent.should.include('Unpublished changes')
    })
  })

  describe('dataset owner', () => {
    it('should show dataset owner', async () => {
      await renderDatasets()

      // Me (created)
      let dataset = findDatasetWithTitle('Draft 5 by me')
      dataset.querySelector('td.dataset-owner').textContent.should.eql('Me')

      // Me (created + project)
      dataset = findDatasetWithTitle('Draft 3 by me and project')
      dataset.querySelector('td.dataset-owner').textContent.should.eql('Me')

      // Project
      dataset = findDatasetWithTitle('Draft 4 by project')
      expect(dataset.querySelector('td.dataset-owner svg').getAttribute('aria-label')).toBe(
        'Project'
      )
    })
  })

  describe('date created', () => {
    it('should show creation date"', async () => {
      await renderDatasets()
      let dataset = findDatasetWithTitle('Changes here')
      dataset.querySelector('td.dataset-created').textContent.should.eql('6 days ago')

      dataset = findDatasetWithTitle('Draft 5 by me')
      dataset.querySelector('td.dataset-created').textContent.should.eql('3 months ago')
    })
  })

  describe('actions', () => {
    beforeAll(async () => {
      mockAdapter.reset()
      mockAdapter.onGet().reply(200, datasets)
      // eslint-disable-next-line testing-library/no-render-in-lifecycle
      await renderDatasets()
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
      ${PUBLISHED} | ${'Add editors'}        | ${BOTH}
      ${PUBLISHED} | ${'Use as template'}    | ${MENU}
      ${PUBLISHED} | ${'Create new version'} | ${MENU}
      ${PUBLISHED} | ${'Revert changes'}     | ${NONE}
      ${PUBLISHED} | ${'Delete'}             | ${MENU}
      ${CHANGED}   | ${'Edit draft'}         | ${BUTTON}
      ${CHANGED}   | ${'Preview in Etsin'}   | ${BOTH}
      ${CHANGED}   | ${'Add editors'}        | ${BOTH}
      ${CHANGED}   | ${'Use as template'}    | ${MENU}
      ${CHANGED}   | ${'Create new version'} | ${NONE}
      ${CHANGED}   | ${'Revert changes'}     | ${MENU}
      ${CHANGED}   | ${'Delete'}             | ${MENU}
      ${DRAFT}     | ${'Edit'}               | ${BUTTON}
      ${DRAFT}     | ${'Preview in Etsin'}   | ${BOTH}
      ${DRAFT}     | ${'Add editors'}        | ${BOTH}
      ${DRAFT}     | ${'Use as template'}    | ${MENU}
      ${DRAFT}     | ${'Create new version'} | ${NONE}
      ${DRAFT}     | ${'Revert changes'}     | ${NONE}
      ${DRAFT}     | ${'Delete'}             | ${MENU}
    `(
      '$row.msg should$items.no have "$label" $items.msg',
      async ({ row, label, items: { button, menu } }) => {
        const dataset = findDatasetWithTitle(row.title)
        expect(dataset).toBeInTheDocument()
        expect(!!dataset.querySelector(`button[aria-label="${label}"]`)).toBe(!!button)
        expect(dataset.querySelector('[role="menu"]').textContent.includes(label)).toBe(!!menu)
      }
    )
  })

  describe('Add editors button', () => {
    it('should open modal', async () => {
      await renderDatasets()
      const dataset = findDatasetWithTitle('IDA dataset')
      expect(document.querySelectorAll('[aria-label="shareDatasetModal"]')).toHaveLength(0)
      const shareButton = within(dataset).getByLabelText('Add editors')
      await user.click(shareButton)
      expect(document.querySelectorAll('[aria-label="shareDatasetModal"]')).toHaveLength(1)
    })
  })

  describe('sorting', () => {
    beforeEach(async () => {})

    const sortBy = async type => {
      const input = document.querySelector('input#sort-datasets-input')
      await user.click(input)
      await user.click(screen.getByRole('option', { name: type }))
    }

    const getColumns = (...classes) => {
      let values
      for (const c of classes) {
        const row = Array.from(document.querySelectorAll(c)).map(
          v => v.textContent || v.querySelector('[aria-label]').getAttribute('aria-label')
        )
        if (!values) {
          values = row.map(v => [v])
        } else {
          values = values.map((v, i) => [...v, row[i]])
        }
      }
      return values
    }

    it('should sort datasets by title', async () => {
      await renderDatasets()
      await sortBy('Title')
      stores.QvainDatasets.sort.type.should.eql('title')
      getColumns('.dataset-title').should.eql([
        ['Changes here'],
        ['Draft 2'],
        ['Draft 3 by me and project'],
        ['Draft 4 by project'],
        ['Draft 5 by me'],
        ['Draft dataset'],
        ['IDA dataset version 2'],
      ])
    })

    it('should reverse sort order', async () => {
      await renderDatasets()
      await sortBy('Title')
      await user.click(screen.getByRole('button', { name: 'Ascending' }))

      stores.QvainDatasets.sort.type.should.eql('title')
      getColumns('.dataset-title').should.eql([
        ['IDA dataset version 2'],
        ['Draft dataset'],
        ['Draft 5 by me'],
        ['Draft 4 by project'],
        ['Draft 3 by me and project'],
        ['Draft 2'],
        ['Changes here'],
      ])
    })

    it('should sort datasets by creation date', async () => {
      await renderDatasets()
      await sortBy('Date')
      stores.QvainDatasets.sort.type.should.eql('dateCreated')
      getColumns('.dataset-title', '.dataset-created').should.eql([
        ['Draft 3 by me and project', '5 days ago'],
        ['Changes here', '6 days ago'],
        ['Draft 2', '1 month ago'],
        ['IDA dataset version 2', '1 month ago'],
        ['Draft 5 by me', '3 months ago'],
        ['Draft 4 by project', '3 months ago'],
        ['Draft dataset', '4 months ago'],
      ])
    })

    it('should sort datasets by owner', async () => {
      await renderDatasets()
      await sortBy('Owner')
      stores.QvainDatasets.sort.type.should.eql('owner')
      getColumns('.dataset-title', '.dataset-owner').should.eql([
        ['Changes here', 'Me'],
        ['Draft 3 by me and project', 'Me'],
        ['Draft 5 by me', 'Me'],
        ['Draft dataset', 'Me'],
        ['IDA dataset version 2', 'Me'],
        ['Draft 2', 'Project'],
        ['Draft 4 by project', 'Project'],
      ])
    })

    it('should sort datasets by status', async () => {
      await renderDatasets()
      await sortBy('Status')
      stores.QvainDatasets.sort.type.should.eql('status')
      getColumns('.dataset-title', '.dataset-state').should.eql([
        ['IDA dataset version 2', 'Published'],
        ['Changes here', 'Unpublished changes'],
        ['Draft 2', 'Draft'],
        ['Draft 3 by me and project', 'Draft'],
        ['Draft 4 by project', 'Draft'],
        ['Draft 5 by me', 'Draft'],
        ['Draft dataset', 'Draft'],
      ])
    })
  })

  describe('filtering', () => {
    const filterBy = async str => {
      const input = document.querySelector('input#search-datasets-input')
      await user.clear(input)
      await user.type(input, str)
    }

    const getTitles = () => {
      const titles = Array.from(document.querySelectorAll('.dataset-title')).map(v => v.textContent)
      return titles
    }

    it('should filter datasets by title', async () => {
      await renderDatasets()
      await filterBy('Draft')
      getTitles().should.eql([
        'Draft 3 by me and project',
        'Draft 2',
        'Draft 5 by me',
        'Draft 4 by project',
        'Draft dataset',
      ])
    })

    it('should not clear filter when resetting datasets list', async () => {
      await renderDatasets()
      await filterBy('search string')
      stores.QvainDatasets.reset()
      const input = document.querySelector('input#search-datasets-input')
      input.value.should.eql('search string')
    })

    it('should not clear filter when input loses focus', async () => {
      await renderDatasets()
      await filterBy('search string')
      const input = document.querySelector('input#search-datasets-input')
      await user.click(input)
      await user.click(document.body)
      input.value.should.eql('search string')
    })

    it('should filter datasets by other translations', async () => {
      await renderDatasets()
      await filterBy('suom')
      getTitles().should.eql(['Draft 2', 'IDA dataset version 2'])
    })

    it('should show message when no matches are found', async () => {
      await renderDatasets()
      await filterBy('no such dataset')
      getTitles().should.eql([])
      expect(screen.getByText('No matching datasets found.')).toBeInTheDocument()
    })

    it('should not show "Show more" when no more matches are available', async () => {
      await renderDatasets()
      await filterBy('Draft')
      stores.QvainDatasets.setShowCount({ initial: 5, current: 5, increment: 2 })

      document.querySelectorAll('tbody').length.should.eql(5)
      expect(screen.queryByText('Show more', { exact: false })).not.toBeInTheDocument()
    })
  })
})
