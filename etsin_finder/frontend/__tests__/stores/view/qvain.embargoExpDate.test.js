import EmbargoExpDate, {
  embargoExpDateSchema,
} from '../../../js/stores/view/qvain/qvain.embargoExpDate'
import { makeObservable } from 'mobx'

vi.mock('../../../js/stores/view/qvain/qvain.singleValueField', () => {
  class mockSingleValueField {
    constructor(...args) {
      this.constructorFunc(...args)
    }

    constructorFunc = vi.fn()
  }

  return {default: mockSingleValueField}
})

vi.mock('mobx', async () => {
  return {
    ...(await vi.importActual('mobx')),
    makeObservable: vi.fn(),
  }
})

describe('given Parent object', () => {
  const Parent = {
    some: 'data',
  }

  describe('EmbargoExpDate', () => {
    let embargoExpDate
    beforeEach(() => {
      embargoExpDate = new EmbargoExpDate(Parent)
    })

    describe('when constructor is called', () => {
      test('should call super.constructor with Parent and schema', () => {
        expect(embargoExpDate.constructorFunc).toHaveBeenCalledWith(Parent, embargoExpDateSchema)
      })

      test('should call makeObservable', () => {
        expect(makeObservable).toHaveBeenCalledWith(embargoExpDate)
      })
    })

    describe('when fromBackend is called with access_rights_available: true', () => {
      const dataset = {
        access_rights: {
          available: true,
        },
      }

      beforeEach(() => {
        embargoExpDate.fromBackend(dataset)
      })

      test('should set value to true', () => {
        embargoExpDate.value.should.be.true
      })
    })

    describe('when fromBackend is called with access_rights_available: false', () => {
      const dataset = {
        access_rights: {
          available: false,
        },
      }

      beforeEach(() => {
        embargoExpDate.fromBackend(dataset)
      })

      test('should set value to undefined', () => {
        expect(embargoExpDate.value).toBeUndefined()
      })
    })
  })
})
