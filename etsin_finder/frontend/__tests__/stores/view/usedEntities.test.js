import UsedEntities, {
  UsedEntityTemplate,
  UsedEntityModel,
} from '../../../js/stores/view/qvain/qvain.usedEntities'
import 'chai/register-expect'
import { makeObservable } from 'mobx'

jest.mock('../../../js/stores/view/qvain/qvain.field', () => {
  class mockField {
    constructor(...args) {
      this.constructorFunction(...args)
    }
    storage = []
    fromBackendBase = jest.fn()
    constructorFunction = jest.fn()
  }

  return mockField
})

jest.mock('uuid')
jest.mock('mobx')

describe('UsedEntities', () => {
  let usedEntities

  const Qvain = {}

  beforeEach(() => {
    usedEntities = new UsedEntities(Qvain)
  })

  describe('when calling constructor', () => {
    test("should call super.constructor with Qvain, UsedEntityTemplate, UsedEntityModel and 'usedEntities'", () => {
      expect(usedEntities.constructorFunction).to.have.beenCalledWith(
        Qvain,
        UsedEntityTemplate,
        UsedEntityModel,
        'usedEntities'
      )
    })

    test('should call makeObservable', () => {
      expect(makeObservable).to.have.beenCalledWith(usedEntities)
    })
  })

  describe('when calling fromBackend with dataset and Qvain', () => {
    const dataset = {}

    beforeEach(() => {
      usedEntities.fromBackend(dataset, Qvain)
    })

    test('should call super.fromBackendBase with args', () => {
      expect(usedEntities.fromBackendBase).to.have.beenCalledWith(dataset, Qvain)
    })
  })

  describe('given usedEntity item in storage', () => {
    const storage = [
      {
        name: 'name',
        description: 'description',
        identifier: 'identifier',
        entityType: { url: 'entityTypeUrl' },
      },
    ]

    beforeEach(() => {
      usedEntities.storage = storage
    })

    describe('when calling toBackend', () => {
      let returnValue

      beforeEach(() => {
        returnValue = usedEntities.toBackend()
      })

      test('should return expected object', () => {
        const expectedObject = {
          title: 'name',
          description: 'description',
          identifier: 'identifier',
          type: { identifier: 'entityTypeUrl' },
        }
        returnValue.should.eql([expectedObject])
      })
    })
  })
})
