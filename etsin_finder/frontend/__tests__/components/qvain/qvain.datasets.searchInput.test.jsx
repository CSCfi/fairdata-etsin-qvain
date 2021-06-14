import Harness from '../componentTestHarness'

import { useStores } from '../../../js/stores/stores'
import SearchInput from '../../../js/components/qvain/views/datasets/searchInput'
import { expect } from 'chai'

jest.mock('../../../js/stores/stores')

describe('given mockStores', () => {
  const harness = new Harness(SearchInput)

  const getMockStores = () => ({
    QvainDatasets: {
      datasetGroups: [],
      minDatasetsForSearchTool: 0,
      searchTerm: 'some-search-term',
      setSearchTerm: jest.fn(),
    },
  })

  let mockStores

  beforeEach(() => {
    mockStores = getMockStores()
    useStores.mockReturnValue(mockStores)
    harness.shallow()
  })

  afterEach(() => {
    harness.restoreWrapper('root')
    jest.clearAllMocks()
  })

  describe('SearchInput', () => {
    test('should contain searchTerm', () => {
      harness.shouldIncludeChild({ searchType: 'props', findArgs: { value: 'some-search-term' } })
    })

    describe('when triggering onChange', () => {
      beforeEach(() => {
        harness.find('#datasetSearchInput').trigger('change', { target: { value: 'another term' } })
      })

      test('should call setSearchTerm', () => {
        expect(mockStores.QvainDatasets.setSearchTerm).to.have.beenCalledWith('another term')
      })
    })

    describe('when number of datasets is less than minDatasetsForSearchTool', () => {
      beforeEach(() => {
        mockStores.QvainDatasets.datasetGroups = [{}, {}]
        mockStores.QvainDatasets.minDatasetsForSearchTool = 3
        harness.shallow()
      })

      test('should call setSearchTerm', () => {
        expect(harness.wrapper.isEmptyRender()).to.be.true
      })
    })
  })
})
