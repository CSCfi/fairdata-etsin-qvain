import 'chai/register-expect'
import Harness from '../componentTestHarness'
import React from 'react'

import { DatasetTable } from '../../../js/components/qvain/views/datasets/table'
import DatasetGroup from '../../../js/components/qvain/views/datasets/datasetGroup'
import DatasetPagination from '../../../js/components/qvain/views/datasets/pagination'
import RemoveModal from '../../../js/components/qvain/views/datasets/removeModal'
import { HeaderCell, TableNote } from '../../../js/components/qvain/general/card/table'
import { TableButton } from '../../../js/components/qvain/general/buttons'

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

describe('given mockStores', () => {
  const mockStores = {
    Qvain: {
      resetQvainStore: jest.fn(),
      resetWithTemplate: jest.fn(),
      editDataset: jest.fn(),
    },
    QvainDatasets: {
      publishedDataset: 'publishedDataset',
      setPublishedDataset: jest.fn(),
      datasetsPerPage: 10,
      minDatasetsForSearchTool: 0,
    },
    Env: {
      getQvainUrl: jest.fn(path => path),
      metaxApiV2: true,
    },
    Matomo: {
      recordEvent: jest.fn(),
    },
    Auth: {
      user: {
        name: 'name',
      },
    },
  }

  const history = {
    push: jest.fn(),
  }

  const location = {}

  const harness = new Harness(DatasetTable, { Stores: mockStores, history, location })

  afterEach(() => {
    harness.restoreWrapper('root')
    jest.clearAllMocks()
  })

  describe('DatasetTable', () => {
    const testGroups = [[{ identifier: 'identifier' }]]

    const datasets = [{ identifier: 'identifier' }]

    const searchTerm = ''

    const currentTimestamp = 'currentTimestamp'

    const page = 1

    const count = 1

    const removeModalDataset = {}

    const removeModalOnlyChanges = {}

    beforeAll(() => {
      axios.get.mockReturnValue(Promise.resolve({ data: datasets }))
      harness.shallow()
      harness.setState({
        datasetGroups: testGroups,
        datasets,
        onPage: testGroups,
        currentTimestamp,
        removeModalDataset,
        removeModalOnlyChanges,
      })
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected properties', () => {
      const children = [
        //search bar
        {
          label: 'SearchLabel',
          findType: 'prop',
          findArgs: ['content', 'qvain.datasets.search.searchTitle'],
        },
        {
          label: 'InputLabel',
          findType: 'prop',
          findArgs: ['content', 'qvain.datasets.search.hidden'],
        },
        {
          label: 'SearchInput',
          findType: 'prop',
          findArgs: ['id', 'datasetSearchInput'],
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
        SearchInput: {
          attributes: {
            placeholder: 'qvain.datasets.search.placeholder',
          },
          value: searchTerm,
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
        RemoveModal: {
          dataset: removeModalDataset,
          onlyChanges: removeModalOnlyChanges,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })

    describe('given state.loading: true', () => {
      beforeEach(() => {
        harness.setState({ loading: true })
        harness.update()
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
      const errorMessage = 'errorMessage'

      beforeEach(() => {
        harness.setState({ error, errorMessage })
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
            text: errorMessage,
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
        harness.setState({ loading: false, error: false, datasets: [] })
        harness.update()
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

    describe('SearchInput', () => {
      beforeEach(() => {
        harness.restoreWrapper('SearchInput')
      })

      describe('when triggering onChange', () => {
        const searchTerm = 'title'

        const datasetGroups = [
          [
            {
              identifier: 'identifier',
              research_dataset: {
                title: { en: 'title' },
              },
            },
          ],
        ]

        beforeEach(() => {
          harness.setState({ datasetGroups })
          harness.trigger('change', { target: { value: searchTerm } })
        })

        test('should set state: {searchTerm, filteredGroups, count, onPage}', () => {
          harness.state.should.deep.include({
            searchTerm,
            filteredGroups: datasetGroups,
            onPage: datasetGroups,
            count: 1,
          })
        })
      })
    })

    describe('DatasetGroup', () => {
      beforeEach(() => {
        harness.restoreWrapper('DatasetGroup')
      })

      describe("when calling handleEnterEdit with dataset.next_draft and it's generated function", () => {
        const dataset = {
          next_draft: {
            identifier: 'identifier',
          },
        }

        beforeEach(() => {
          harness.props.handleEnterEdit(dataset)()
        })

        test('should call recordEvent', () => {
          expect(mockStores.Matomo.recordEvent).to.have.beenCalledWith('EDIT / identifier')
        })

        test('should call history.push with getQvainUrl("/dataset") return value', () => {
          expect(mockStores.Env.getQvainUrl).to.have.beenCalledWith('/dataset/identifier')
          expect(history.push).to.have.beenCalledWith('/dataset/identifier')
        })
      })

      describe("when calling handleEnterEdit with dataset.next_draft and it's generated function", () => {
        const dataset = {
          identifier: 'identifier',
        }

        beforeEach(() => {
          harness.props.handleEnterEdit(dataset)()
        })

        test('should call recordEvent', () => {
          expect(mockStores.Matomo.recordEvent).to.have.beenCalledWith('EDIT / identifier')
        })

        test('should call editDataset', () => {
          expect(mockStores.Qvain.editDataset).to.have.beenCalledWith(dataset)
        })

        test('should call history.push with getQvainUrl("/dataset") return value', () => {
          expect(mockStores.Env.getQvainUrl).to.have.beenCalledWith('/dataset/identifier')
          expect(history.push).to.have.beenCalledWith('/dataset/identifier')
        })
      })

      describe('when calling handleUseAsTemplate without next_draft prop', () => {
        const dataset = {
          identifier: 'identifier',
        }
        beforeEach(() => {
          harness.props.handleUseAsTemplate(dataset)
        })

        test('should call recordEvent', () => {
          expect(mockStores.Matomo.recordEvent).to.have.beenCalledWith('TEMPLATE / identifier')
        })

        test('should call history.push with getQvainUrl("/dataset") return value', () => {
          expect(mockStores.Env.getQvainUrl).to.have.beenCalledWith('/dataset')
          expect(history.push).to.have.beenCalledWith('/dataset')
        })

        test('should call resetWithTemplate with dataset', () => {
          expect(mockStores.Qvain.resetWithTemplate).to.have.beenCalledWith(dataset)
        })
      })

      describe('when calling handleUseAsTemplate with {next_draft: {identifier: "identifier"}}', () => {
        const dataset = {
          next_draft: {
            identifier: 'identifier',
          },
        }
        beforeEach(() => {
          harness.props.handleUseAsTemplate(dataset)
        })

        test('should call resetWithTemplate with dataset.next_draft', () => {
          expect(mockStores.Qvain.resetWithTemplate).to.have.beenCalledWith(dataset.next_draft)
        })
      })

      describe('when calling handleCreateNewVersion', () => {
        const identifier = 'identifier'

        beforeEach(async () => {
          axios.post.mockReturnValue(Promise.resolve({ data: { identifier: 'identifier2' } }))
          await harness.props.handleCreateNewVersion(identifier)
        })

        test('should call recordEvent', () => {
          expect(mockStores.Matomo.recordEvent).to.have.beenCalledWith('NEW_VERSION / identifier')
        })

        test('should call axios.post with expected props', () => {
          expect(axios.post).to.have.beenCalledWith(
            '/api/v2/rpc/datasets/create_new_version',
            null,
            { params: { identifier: 'identifier' } }
          )
        })

        test('should call history.push with getQvainUrl("/dataset") return value', () => {
          expect(mockStores.Env.getQvainUrl).to.have.beenCalledWith('/dataset/identifier2')
          expect(history.push).to.have.beenCalledWith('/dataset/identifier2')
        })
      })

      describe('when calling openRemoveModal', () => {
        const dataset = { data: 'set' }
        const onlyChanges = { only: 'changes' }

        beforeEach(() => {
          harness.props.openRemoveModal(dataset, onlyChanges)()
        })

        test('should set state {removeModalDataset, removeModalOnlyChanges}', () => {
          harness.state.should.deep.include({
            removeModalDataset: dataset,
            removeModalOnlyChanges: onlyChanges,
          })
        })
      })
    })

    describe('DatasetPagination', () => {
      beforeEach(() => {
        harness.setState({ page: 30, onPage: [[{ identifier: 'identifier', glutter: 'data' }]] })
        harness.restoreWrapper('DatasetPagination')
      })

      describe('when triggering changePage and calling generated anonymous function', () => {
        beforeEach(() => {
          harness.props.onChangePage(1)()
        })

        test('should set state: onPage, page', () => {
          harness.state.should.deep.include({
            page: 1,
            onPage: [
              [
                {
                  identifier: 'identifier',
                  research_dataset: {
                    title: {
                      en: 'title',
                    },
                  },
                },
              ],
            ],
          })
        })
      })
    })

    describe('RemoveModal', () => {
      beforeEach(() => {
        harness.restoreWrapper('RemoveModal')
      })

      describe('when triggering close', () => {
        beforeEach(() => {
          harness.trigger('close')
        })

        test('should set state: removeModalDataset, removeModalOnlyChanges to null', () => {
          harness.state.should.deep.include({
            removeModalDataset: null,
            removeModalOnlyChanges: null,
          })
        })
      })

      describe('when calling postRemoveUpdate with onlyChanges: false', () => {
        const dataset = { identifier: 'identifier' }
        const onlyChanges = null
        beforeEach(() => {
          harness.setState({ datasets: [dataset], page: 50, onPage: [[dataset]] })
          harness.props.postRemoveUpdate(dataset, onlyChanges)
        })

        test('should call recordEvent', () => {
          expect(mockStores.Matomo.recordEvent).to.have.beenCalledWith('DELETE / identifier')
        })

        test('should set state: datasets, datasetGroups, filteredGroups', () => {
          harness.state.should.deep.include({ datasets: [], datasetGroups: [], filteredGroups: [] })
        })

        test('should set state: onPage, page', () => {
          harness.state.should.deep.include({ page: 50, onPage: [] })
        })
      })

      describe('when calling postRemoveUpdate with onlyChanges: {identifier}', () => {
        const dataset = {
          identifier: 'identifier',
          research_dataset: {
            title: { en: 'title' },
          },
        }

        const onlyChanges = { identifier: 'identifier' }

        beforeEach(() => {
          harness.setState({ datasets: [dataset], page: 50, onPage: [[dataset]] })
          harness.props.postRemoveUpdate(dataset, onlyChanges)
        })

        test('should call recordEvent with REVERT', () => {
          expect(mockStores.Matomo.recordEvent).to.have.beenCalledWith('REVERT / identifier')
        })

        test('shoud revert dataset to original version', () => {
          harness.state.should.deep.include({ datasets: [dataset], onPage: [] })
        })
      })
    })
  })
})
