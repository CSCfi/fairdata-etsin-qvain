import Description from '../../../js/stores/view/qvain/qvain.description'
import { expect } from 'chai'
import { makeObservable } from 'mobx'

jest.mock('../../../js/stores/view/qvain/qvain.multiLanguageField', () => {
  class MultiLanguageField {
    constructor(Parent) {
      this.constructorFunc(Parent)
    }

    constructorFunc = jest.fn()

    value = undefined
  }
  return MultiLanguageField
})

jest.mock('mobx', () => {
  return {
    ...jest.requireActual('mobx'),
    makeObservable: jest.fn(),
  }
})

describe('Description', () => {
  describe('when calling constructor', () => {
    let description
    const Parent = { data: 'parent' }

    beforeEach(() => {
      description = new Description(Parent)
    })

    test('should call MultiLanguageField.constructor with parent', () => {
      expect(description.constructorFunc).to.have.beenCalledWith(Parent)
    })

    test('should call makeObservable', () => {
      expect(makeObservable).to.have.beenCalledWith(description)
    })

    describe('when calling fromBackend with dataset', () => {
      const dataset = {
        description: {
          fi: 'fi_desc',
          en: 'en_desc',
          sv: 'sv_desc',
          sw: 'swahili_desc',
        },
      }

      beforeEach(() => {
        description.fromBackend(dataset)
      })

      test('should assign value with dataset.description', () => {
        description.value.should.eql({ en: 'en_desc', fi: 'fi_desc', sv: 'sv_desc' })
      })
    })

    describe('when calling fromBackend with empty dataset', () => {
      const dataset = {}

      beforeEach(() => {
        description.fromBackend(dataset)
      })

      test('should assign value with dataset.description', () => {
        description.value.should.eql({ fi: '', en: '', sv: '' })
      })
    })
  })
})
