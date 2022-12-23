import { expect } from 'chai'
import { makeObservable } from 'mobx'

import FieldOfSciences from '../../../js/stores/view/qvain/qvain.fieldOfScience'

jest.mock('../../../js/stores/view/qvain/qvain.referenceField', () => {
  const actual = jest.requireActual('../../../js/stores/view/qvain/qvain.referenceField')
  const { referenceObjectSchema } = actual

  class mockReferenceField {
    constructor(...args) {
      this.constructorFunc(...args)
    }

    constructorFunc = jest.fn()

    reset = jest.fn()
  }

  return { __esModule: true, default: mockReferenceField, referenceObjectSchema }
})

jest.mock('mobx', () => {
  return {
    ...jest.requireActual('mobx'),
    makeObservable: jest.fn(),
  }
})

describe('given any args', () => {
  const someArgs = ['probably Parent', 'maybe some other stuff']

  describe('FieldOfSciences', () => {
    let fieldOfSciences
    beforeEach(() => {
      fieldOfSciences = new FieldOfSciences(...someArgs)
    })

    describe('when calling constructor', () => {
      test('should call super.constructor with given args', () => {
        expect(fieldOfSciences.constructorFunc).to.have.beenCalledWith(...someArgs)
      })

      test('should call makeObservable', () => {
        expect(makeObservable).to.have.beenCalledWith(fieldOfSciences)
      })

      describe('when calling fromBackend with dataset', () => {
        const dataset = {
          field_of_science: [
            {
              pref_label: 'label',
              identifier: 'identifier',
            },
          ],
        }
        beforeEach(() => {
          fieldOfSciences.fromBackend(dataset)
        })

        test('should populate storage with expected object', () => {
          const expectedObject = {
            name: 'label',
            url: 'identifier',
          }

          fieldOfSciences.storage.should.deep.eql([expectedObject])
        })
      })
    })
  })
})
