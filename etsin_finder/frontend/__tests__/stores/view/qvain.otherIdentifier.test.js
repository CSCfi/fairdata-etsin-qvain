import { makeObservable } from 'mobx'

import OtherIdentifiers from '@/stores/view/qvain/qvain.otherIdentifier'

vi.mock('@/stores/view/qvain/qvain.referenceField', () => {
  class mockReferenceField {
    constructor(...args) {
      this.constructorFunc(...args)
    }

    constructorFunc = vi.fn()

    reset = vi.fn()

    addItemStr = vi.fn()

    setValidationError = vi.fn()

    validate = vi.fn()

    validateStr = vi.fn()
  }

  return { default: mockReferenceField }
})

vi.mock('mobx', async () => {
  return {
    ...(await vi.importActual('mobx')),
    makeObservable: vi.fn(),
  }
})

vi.mock('@/stores/view/qvain/qvain.submit.schemas')

describe('OtherIdentifiers', () => {
  let otherIdentifiers
  const args = ['some', 'data']

  beforeEach(() => {
    otherIdentifiers = new OtherIdentifiers(...args)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('when calling costructor with any args', () => {
    test('should call super.constructor with args', () => {
      expect(otherIdentifiers.constructorFunc).toHaveBeenCalledWith(...args)
    })

    test('should call makeObservable', () => {
      expect(makeObservable).toHaveBeenCalledWith(otherIdentifiers)
    })
  })

  describe('when calling fromBackend with dataset', () => {
    const dataset = {
      other_identifier: [{ notation: 'first' }, { notation: 'second' }],
    }

    beforeEach(() => {
      otherIdentifiers.fromBackend(dataset)
    })

    test('should populate storage with mapped otherIdentifier.notation', () => {
      otherIdentifiers.storage.should.eql(['first', 'second'])
    })

    test('should call super.reset', () => {
      expect(otherIdentifiers.reset).toHaveBeenCalled()
    })
  })

  describe('given itemStr that is not in storage', () => {
    const storage = ['first']
    const itemStr = 'second'

    beforeEach(() => {
      otherIdentifiers.storage = storage
      otherIdentifiers.itemStr = itemStr
    })

    describe('when validation passes', () => {
      beforeEach(() => {
        otherIdentifiers.validateStr.mockReturnValue(true)
      })

      describe('when calling cleanupBeforeBackend', () => {
        let returnValue

        beforeEach(() => {
          returnValue = otherIdentifiers.cleanupBeforeBackend()
        })

        test('should call super.addItemStr', () => {
          expect(otherIdentifiers.addItemStr).toHaveBeenCalled()
        })

        test('should return true', () => {
          returnValue.should.be.true
        })
      })
    })

    describe('when validation fails', () => {
      beforeEach(() => {
        otherIdentifiers.validateStr.mockReturnValue(false)
      })

      describe('when calling cleanupBeforeBackend', () => {
        let returnValue

        beforeEach(() => {
          returnValue = otherIdentifiers.cleanupBeforeBackend()
        })

        test('should return false', () => {
          returnValue.should.be.false
        })
      })
    })
  })
})
