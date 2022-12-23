import { expect } from 'chai'
import { makeObservable } from 'mobx'

import Infrastructures from '../../../js/stores/view/qvain/qvain.infrastructure'

jest.mock('../../../js/stores/view/qvain/qvain.referenceField', () => {
  class mockReferenceField {
    constructor(...args) {
      this.constructorFunc(...args)
    }

    constructorFunc = jest.fn()

    reset = jest.fn()
  }

  return mockReferenceField
})

jest.mock('mobx', () => {
  return {
    ...jest.requireActual('mobx'),
    makeObservable: jest.fn(),
  }
})

describe('given any args', () => {
  const someArgs = ['probably Parent', 'maybe some other stuff']

  describe('Infrastructures', () => {
    let infrastructures
    beforeEach(() => {
      infrastructures = new Infrastructures(...someArgs)
    })

    describe('when calling constructor', () => {
      test('should call super.constructor with given args', () => {
        expect(infrastructures.constructorFunc).to.have.beenCalledWith(...someArgs)
      })

      test('should call makeObservable', () => {
        expect(makeObservable).to.have.beenCalledWith(infrastructures)
      })

      describe('when calling fromBackend with dataset', () => {
        const dataset = {
          infrastructure: [
            {
              pref_label: 'label',
              identifier: 'identifier',
            },
          ],
        }
        beforeEach(() => {
          infrastructures.fromBackend(dataset)
        })

        test('should populate storage with expected object', () => {
          const expectedObject = {
            name: 'label',
            url: 'identifier',
          }

          infrastructures.storage.should.deep.eql([expectedObject])
        })
      })
    })
  })
})
