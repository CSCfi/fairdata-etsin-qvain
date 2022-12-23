import { expect } from 'chai'
import { makeObservable } from 'mobx'

import Datasets from '../../../js/stores/view/qvain/qvain.datasets'

jest.mock('mobx')

describe('Datasets', () => {
  const datasets = new Datasets()
  describe('when calling constructor', () => {
    test('should call makeObservable', () => {
      expect(makeObservable).to.have.beenCalledWith(datasets)
    })

    test('should have default values', () => {
      datasets.should.include({
        datasetsPerPage: 20,
        minDatasetsForSearchTool: 5,
        publishedDataset: null,
      })
    })
  })

  describe('when calling setDatasetsPerPage', () => {
    beforeEach(() => {
      datasets.setDatasetsPerPage(4)
    })
    test('should set datasetsPerPage', () => {
      datasets.datasetsPerPage.should.eql(4)
    })
  })

  describe('when calling setPublishedDataset', () => {
    const dataset = {
      some: 'data',
    }

    beforeEach(() => {
      datasets.setPublishedDataset(dataset)
    })

    test('should set publishedDataset', () => {
      datasets.publishedDataset.should.eql(dataset)
    })
  })
})
