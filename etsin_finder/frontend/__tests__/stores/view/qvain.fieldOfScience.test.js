import { makeObservable } from 'mobx'

import FieldOfSciences from '@/stores/view/qvain/qvain.fieldOfScience'

vi.mock('@/stores/view/qvain/qvain.referenceField', async () => {
  const actual = await vi.importActual('@/stores/view/qvain/qvain.referenceField')
  const { referenceObjectSchema } = actual

  class mockReferenceField {
    constructor(...args) {
      this.constructorFunc(...args)
    }

    constructorFunc = vi.fn()

    reset = vi.fn()
  }

  return { __esModule: true, default: mockReferenceField, referenceObjectSchema }
})

vi.mock('mobx', async () => {
  return {
    ...(await vi.importActual('mobx')),
    makeObservable: vi.fn(),
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
        expect(fieldOfSciences.constructorFunc).toHaveBeenCalledWith(...someArgs)
      })

      test('should call makeObservable', () => {
        expect(makeObservable).toHaveBeenCalledWith(fieldOfSciences)
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
