import 'chai/register-expect'
import { makeObservable, override } from 'mobx'
import { restrictionGroundsSchema } from '../../../js/components/qvain/utils/formValidation'
import RestrictionGrounds from '../../../js/stores/view/qvain/qvain.restrictionGrounds'

jest.mock('../../../js/stores/view/qvain/qvain.singleValueField', () => {
  class mockSingleValueField {
    constructor(...args) {
      this.constructorFunc(...args)
    }

    constructorFunc = jest.fn()

    validateFunc = jest.fn()

    setValidationError = jest.fn()

    validate() {
      this.validateFunc()
    }
  }

  return mockSingleValueField
})

jest.mock('mobx')
override.mockImplementation(func => func)

describe('RestrictionGrounds', () => {
  let restrictionGrounds
  const Parent = {
    some: 'data',
  }

  describe('when calling constructor', () => {
    beforeEach(() => {
      restrictionGrounds = new RestrictionGrounds(Parent)
    })

    test('should call super.constructor', () => {
      expect(restrictionGrounds.constructorFunc).to.have.beenCalledWith(
        Parent,
        restrictionGroundsSchema
      )
    })

    test('should call makeObservable', () => {
      expect(makeObservable).to.have.beenCalledWith(restrictionGrounds)
    })

    describe('when calling fromBackend', () => {
      const dataset = {
        access_rights: {
          restriction_grounds: [
            {
              pref_label: 'label',
              identifier: 'identifier',
            },
          ],
        },
      }

      beforeEach(() => {
        restrictionGrounds.fromBackend(dataset)
      })

      test('should return expected model', () => {
        const expected = {
          name: 'label',
          identifier: 'identifier',
        }

        restrictionGrounds.value.should.eql(expected)
      })
    })

    describe('when calling toBackend', () => {
      let returnValue
      beforeEach(() => {
        restrictionGrounds.value = { identifier: 'identifier' }
        returnValue = restrictionGrounds.toBackend()
      })

      test('should return value.identifier', () => {
        returnValue.should.eql('identifier')
      })
    })

    describe('when calling validate (without Schema)', () => {
      let returnValue

      beforeEach(() => {
        returnValue = restrictionGrounds.validate()
      })

      test('should return undefined', () => {
        expect(returnValue).to.be.undefined
      })
    })

    describe('when calling validate (with Schema)', () => {
      const Schema = {
        validate: jest.fn(() => Promise.resolve()),
      }

      beforeEach(async () => {
        restrictionGrounds.value = { identifier: 'identifier' }
        restrictionGrounds.Schema = Schema
        await restrictionGrounds.validate()
      })

      test('should call Schema.validate', () => {
        expect(Schema.validate).to.have.beenCalledWith('identifier', { strict: true })
      })

      test('should call setValidationError with null', () => {
        expect(restrictionGrounds.setValidationError).to.have.beenCalledWith(null)
      })
    })
  })
})
