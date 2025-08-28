import Description from '../../../js/stores/view/qvain/qvain.description'
import { makeObservable } from 'mobx'

vi.mock('../../../js/stores/view/qvain/qvain.multiLanguageField', () => {
  class MultiLanguageField {
    constructor(Parent) {
      this.constructorFunc(Parent)
    }

    constructorFunc = vi.fn()

    value = undefined
  }
  return { default: MultiLanguageField }
})

vi.mock('mobx', async () => {
  return {
    ...(await vi.importActual('mobx')),
    makeObservable: vi.fn(),
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
      expect(description.constructorFunc).toHaveBeenCalledWith(Parent)
    })

    test('should call makeObservable', () => {
      expect(makeObservable).toHaveBeenCalledWith(description)
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
