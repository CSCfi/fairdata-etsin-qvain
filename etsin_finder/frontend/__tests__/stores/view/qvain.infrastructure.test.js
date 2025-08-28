import { makeObservable } from 'mobx'

import Infrastructures from '@/stores/view/qvain/qvain.infrastructure'

vi.mock('@/stores/view/qvain/qvain.referenceField', () => {
  class mockReferenceField {
    constructor(...args) {
      this.constructorFunc(...args)
    }

    constructorFunc = vi.fn()

    reset = vi.fn()
  }

  return { default: mockReferenceField }
})

vi.mock('mobx', async () => {
  return {
    ...(await vi.importActual('mobx')),
    makeObservable: vi.fn(),
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
        expect(infrastructures.constructorFunc).toHaveBeenCalledWith(...someArgs)
      })

      test('should call makeObservable', () => {
        expect(makeObservable).toHaveBeenCalledWith(infrastructures)
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
