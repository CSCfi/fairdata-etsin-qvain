import DatasetLanguage from '../../../js/stores/view/qvain/qvain.datasetLanguage'

describe('DatasetLanguage', () => {
  let datasetLanguage

  beforeEach(() => {
    datasetLanguage = new DatasetLanguage()
  })

  describe('when calling fromBackend with dataset.language: [item]', () => {
    const item = {
      pref_label: 'title',
      identifier: 'identifier',
    }

    const expectedItems = [
      {
        name: 'title',
        url: 'identifier',
      },
    ]

    const dataset = {
      language: [item],
    }

    beforeEach(() => {
      datasetLanguage.fromBackend(dataset)
    })

    test('should set storage using Model', () => {
      datasetLanguage.storage.should.eql(expectedItems)
    })

    describe('when fromBackend called again with language: undefined', () => {
      beforeEach(() => {
        datasetLanguage.fromBackend({ langugage: undefined })
      })

      test('should keep existing values', () => {
        datasetLanguage.storage.should.eql(expectedItems)
      })
    })
  })
})
