import 'chai/register-expect'
import Harness from '../componentTestHarness'
import React from 'react'
import { configure } from 'mobx'

import { DatasetTable } from '../../../js/components/qvain/views/datasets/table'
import DatasetGroup from '../../../js/components/qvain/views/datasets/datasetGroup'
import DatasetPagination from '../../../js/components/qvain/views/datasets/pagination'
import RemoveModal from '../../../js/components/qvain/views/datasets/removeModal'
import { HeaderCell, TableNote } from '../../../js/components/qvain/general/card/table'
import { TableButton } from '../../../js/components/qvain/general/buttons'
import { buildStores } from '../../../js/stores'
import SearchInput from '../../../js/components/qvain/views/datasets/searchInput'

import axios from 'axios'
jest.mock('axios')

jest.mock('../../../js/stores/stores', () => {
  return {
    withStores: jest.fn(() => () => <>null</>),
    useStores: jest.fn(),
  }
})

jest.mock('mobx-react', () => {
  return {
    observer: jest.fn(() => () => <>null</>),
  }
})
jest.mock('react-router-dom', () => {
  return {
    withRouter: jest.fn(() => () => <>null</>),
  }
})

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useEffect: jest.fn(),
  }
})

const getStores = () => {
  configure({ safeDescriptors: false })
  const stores = buildStores()
  configure({ safeDescriptors: true })
  return stores
}

describe('given mockStores', () => {
  let mockStores

  const history = {
    push: jest.fn(),
  }

  const location = {}

  const harness = new Harness(DatasetTable, { history, location })

  beforeEach(() => {
    mockStores = getStores()
    mockStores.Auth.user.name = 'name'
  })

  afterEach(() => {
    harness.restoreWrapper('root')
    jest.clearAllMocks()
  })

  describe('DatasetTable', () => {
    const testGroups = [[{ identifier: 'identifier' }]]

    const datasets = [{ identifier: 'identifier' }]

    const currentTimestamp = 'currentTimestamp'

    const page = 1

    const count = 1

    beforeEach(async () => {
      axios.get.mockReturnValue(Promise.resolve({ data: datasets }))
      mockStores.QvainDatasets.setDatasets(datasets)

      harness.shallow({ Stores: mockStores })
      harness.setState({
        currentTimestamp,
      })
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected properties', () => {
      const children = [
        //search bar
        {
          label: 'SearchInput',
          findArgs: SearchInput,
        },
        // table
        {
          label: 'Title',
          findType: 'prop',
          findArgs: ['content', 'qvain.datasets.tableRows.title'],
        },
        {
          label: 'Status',
          findType: 'prop',
          findArgs: ['content', 'qvain.datasets.tableRows.state'],
        },
        {
          label: 'Created',
          findType: 'prop',
          findArgs: ['content', 'qvain.datasets.tableRows.created'],
        },
        {
          label: 'Actions',
          findType: 'prop',
          findArgs: ['content', 'qvain.datasets.tableRows.actions'],
        },
        {
          label: 'DatasetGroup',
          findArgs: DatasetGroup,
        },
        {
          label: 'DatasetPagination',
          findArgs: DatasetPagination,
        },
        {
          label: 'RemoveModal',
          findArgs: RemoveModal,
        },
      ]

      const props = {
        InputLabel: {
          className: 'visuallyhidden',
          htmlFor: 'datasetSearchInput',
        },
        Title: {
          component: HeaderCell,
        },
        Status: {
          component: HeaderCell,
        },
        Created: {
          component: HeaderCell,
        },
        Actions: {
          component: HeaderCell,
        },
        DatasetGroup: {
          datasets: testGroups[0],
          currentTimestamp,
        },
        DatasetPagination: {
          id: 'pagination-bottom',
          page,
          count,
          limit: mockStores.QvainDatasets.datasetsPerPage,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })

    describe('given isLoadingDatasets', () => {
      beforeEach(async () => {
        // isLoadingDatasets is enabled when there's a 'datasets' promise
        mockStores.QvainDatasets.promiseManager.add(new Promise(jest.fn()), 'datasets')
        harness.shallow({ Stores: mockStores })
      })

      test('should have child TableNote', () => {
        const child = {
          label: 'LoadingNote',
          findType: 'prop',
          findArgs: ['content', 'qvain.datasets.loading'],
          props: {
            component: TableNote,
          },
        }

        harness.shouldIncludeChild(child)
      })
    })

    describe('given state.error', () => {
      const error = 'error'

      beforeEach(() => {
        mockStores.QvainDatasets.setError(error)
        harness.shallow({ Stores: mockStores })
      })

      test('should have children with expected properties', () => {
        const children = [
          {
            label: 'ErrorTitle',
            findType: 'prop',
            findArgs: ['content', 'qvain.datasets.errorOccurred'],
          },
          {
            label: 'ErrorMessage',
            findType: 'name',
            findArgs: 'table__ErrorMessage',
            text: error,
          },
          {
            label: 'ReloadButton',
            findType: 'prop',
            findArgs: ['component', TableButton],
          },
        ]

        const props = {
          TableButton: {
            content: 'qvain.datasets.reload',
          },
        }

        harness.shouldIncludeChildren(children, props)
      })

      test('should not have DatasetGroup', () => {
        harness.find(DatasetGroup)
        harness.wrapper.exists().should.be.false
      })
    })

    describe('when datasets.length === 0', () => {
      beforeEach(() => {
        mockStores.QvainDatasets.setDatasets([])
        mockStores.QvainDatasets.promiseManager.reset()
        harness.shallow({ Stores: mockStores })
      })

      test('should have child noDatasets', () => {
        const child = {
          label: 'NoDatasetsInfo',
          findType: 'prop',
          findArgs: ['content', 'qvain.datasets.noDatasets'],
        }

        harness.shouldIncludeChild(child)
      })
    })
  })
})
