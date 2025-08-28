import { override } from 'mobx'
import Temporals, { TemporalModel, TemporalTemplate } from '@/stores/view/qvain/qvain.temporals'

vi.mock('mobx')
override.mockImplementation(func => func)

vi.mock('@/stores/view/qvain/qvain.field', () => {
  class Field {
    constructor(...args) {
      this.constructorFunc(...args)
    }

    storage = []

    constructorFunc = vi.fn()

    resetFunc = vi.fn()

    createFunc = vi.fn()

    save = vi.fn()

    reset() {
      this.resetFunc()
    }

    create() {
      this.createFunc()
    }

    fromBackendBase = vi.fn()
  }

  return { default: Field }
})

describe('Temporals with Parent as arg', () => {
  let temporals
  const parent = {
    setChanged: vi.fn(),
  }

  beforeEach(() => {
    temporals = new Temporals(parent)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('when constructor is called', () => {
    test("should call super with Parent, TemporalTemplate, TemporalModel, 'temporals'", () => {
      expect(temporals.constructorFunc).toHaveBeenCalledWith(
        parent,
        TemporalTemplate,
        TemporalModel,
        'temporals'
      )
    })

    test('should assign Parent', () => {
      temporals.Parent.should.eql(parent)
    })
  })

  describe('given storage populated with temporal object', () => {
    const temporalObj = {
      startDate: new Date(1).toISOString(),
      endDate: new Date(2).toISOString(),
      uiid: 1,
    }

    beforeEach(() => {
      temporals.storage = [temporalObj]
    })

    describe('when accessing getter renderable', () => {
      test('should return renderable version of temporals', () => {
        const renderableObj = {
          start: temporalObj.startDate,
          end: temporalObj.endDate,
          uiid: temporalObj.uiid,
        }

        temporals.renderable.should.eql([renderableObj])
      })
    })
  })

  describe('given storage partial populated with temporal object', () => {
    const temporalObj = {
      startDate: undefined,
      endDate: new Date(2).toISOString(),
      uiid: 1,
    }

    beforeEach(() => {
      temporals.storage = [temporalObj]
    })

    describe('when accessing getter renderable', () => {
      test('should return renderable version of temporals', () => {
        const renderableObj = {
          start: undefined,
          end: temporalObj.endDate,
          uiid: temporalObj.uiid,
        }

        temporals.renderable.should.eql([renderableObj])
      })
    })
  })

  describe('when calling reset', () => {
    beforeEach(() => {
      temporals.reset()
    })

    test('should call super.reset and super.create', () => {
      expect(temporals.resetFunc).toHaveBeenCalledTimes(1)
      expect(temporals.createFunc).toHaveBeenCalledTimes(1)
    })
  })

  describe('given inEdit: {data}', () => {
    const inEditObj = { startDate: 1, endDate: 2, uiid: 2 }
    beforeEach(() => {
      temporals.storage = []
      temporals.inEdit = inEditObj
    })

    describe('when calling toBackend', () => {
      let returnValue

      beforeEach(() => {
        temporals.save.mockImplementation(() => {
          temporals.storage = [...temporals.storage, temporals.inEdit]
          temporals.Parent.setChanged(true)
        })
        returnValue = temporals.toBackend()
      })

      test('should call super.save', () => {
        expect(temporals.save).toHaveBeenCalledTimes(1)
      })

      test(
        'should return an array of objects where startDate and endDate are transformed ' +
          'to ISO-date and mapped to start_date and end_date (only one object in this case)',
        () => {
          const expectedReturn = [
            {
              start_date: new Date(inEditObj.startDate).toISOString(),
              end_date: new Date(inEditObj.endDate).toISOString(),
            },
          ]

          returnValue.should.eql(expectedReturn)
        }
      )
    })
  })

  describe('given object in storage', () => {
    const storageObj = { data: 'some data', uiid: 2 }

    beforeEach(() => {
      temporals.storage = [storageObj]
    })

    describe('when calling removeTemporal with uiid', () => {
      beforeEach(() => {
        temporals.removeTemporal(storageObj.uiid)
      })

      test('should remove object with uiid from storage', () => {
        temporals.storage.should.eql([])
      })
    })
  })

  describe('when calling fromBackend', () => {
    const dataset = {
      temporal: {
        some: 'data',
      },
    }

    const Qvain = {
      some: 'other data',
    }

    beforeEach(() => {
      temporals.fromBackend(dataset, Qvain)
    })

    test('should call super.fromBackendBase with dataset.temporal, Qvain', () => {
      expect(temporals.fromBackendBase).toHaveBeenCalledWith(dataset.temporal, Qvain)
    })
  })
})
