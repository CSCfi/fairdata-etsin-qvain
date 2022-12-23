import Title from '../../../js/stores/view/qvain/qvain.title'
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

describe('Title', () => {
  describe('when calling constructor', () => {
    let title
    const Parent = { data: 'parent' }

    beforeEach(() => {
      title = new Title(Parent)
    })

    test('should call MultiLanguageField.constructor with parent', () => {
      expect(title.constructorFunc).to.have.beenCalledWith(Parent)
    })

    test('should call makeObservbles', () => {
      expect(makeObservable).to.have.beenCalledWith(title)
    })

    describe('when calling fromBackend with dataset', () => {
      const dataset = {
        title: {
          fi: 'fi_title',
          en: 'en_title',
          sv: 'sv_title',
          sw: 'swahili_title',
        },
      }

      beforeEach(() => {
        title.fromBackend(dataset)
      })

      test('should assign value with dataset.title', () => {
        title.value.should.eql({ en: 'en_title', fi: 'fi_title', sv: 'sv_title' })
      })
    })

    describe('when calling fromBackend with empty dataset', () => {
      const dataset = {}

      beforeEach(() => {
        title.fromBackend(dataset)
      })

      test('should assign value with dataset.title', () => {
        title.value.should.eql({ fi: '', en: '', sv: '' })
      })
    })
  })
})
