import { makeObservable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import { expect } from 'chai'

import Spatials, {
  Spatial,
  Location,
  SpatialModel,
} from '../../../js/stores/view/qvain/qvain.spatials'

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

describe('Spatials store', () => {
  let spatials
  const parent = {}
  const existingSpatials = ['here lies spatials']

  beforeEach(() => {
    spatials = new Spatials(parent, existingSpatials)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('given trivial args', () => {
    test('should call super.construction with expectedArgs', () => {
      const expectedArgs = [parent, Spatial, SpatialModel, 'spatials']

      expect(spatials.constructorFunction).to.have.beenCalledWith(...expectedArgs)
    })

    test('should call makeObservable', () => {
      expect(makeObservable).to.have.beenCalledTimes(1)
    })

    test('should call fromBackendBase with existing spatials', () => {
      expect(spatials.fromBackendBase).to.have.beenCalledWith(existingSpatials, parent)
    })

    describe('when calling clone', () => {
      let returnValue
      beforeEach(() => {
        returnValue = spatials.clone()
      })

      test('should call fromBackendBase', () => {
        expect(spatials.fromBackendBase).to.have.beenCalledWith(existingSpatials, parent)
      })
    })

    describe('when calling fromBackend', () => {
      let returnValue

      const dataset = {
        spatial: [{ some: 'data' }],
      }

      const Qvain = { name: 'qvain' }

      beforeEach(() => {
        returnValue = spatials.fromBackend(dataset, Qvain)
      })

      test('should call super.fromBackendBase with args', () => {
        expect(spatials.fromBackendBase).to.have.beenCalledWith(dataset.spatial, Qvain)
      })
    })

    describe('given storage is populated with an object of full data', () => {
      beforeEach(() => {
        const spatialObj = Spatial()
        spatialObj.geometry = [{ value: 'value' }]
        spatialObj.location = {
          url: 'url',
        }

        spatials.storage = [spatialObj]
      })

      describe('when calling toBackend', () => {
        let returnValue

        beforeEach(() => {
          returnValue = spatials.toBackend()
        })

        test('should return expectedArray', () => {
          const expectedArray = [
            {
              geographic_name: '',
              alt: '',
              full_address: '',
              as_wkt: ['value'],
              place_uri: { identifier: 'url' },
            },
          ]

          returnValue.should.deep.eql(expectedArray)
        })
      })
    })

    describe('given storage is populated with an object of partial data', () => {
      const obj = {
        uiid: 'uiid',
        name: 'name',
        altitude: 'altitude',
        address: 'address',
      }
      beforeEach(() => {
        const spatial = Spatial(...Object.values(obj))
        spatials.storage = [spatial]
      })

      describe('when calling toBackend', () => {
        let returnValue

        beforeEach(() => {
          returnValue = spatials.toBackend()
        })

        test('should return expectedArray', () => {
          const expectedArray = [
            {
              geographic_name: obj.name,
              alt: obj.altitude,
              full_address: obj.address,
              as_wkt: [],
              place_uri: { identifier: undefined },
            },
          ]

          returnValue.should.deep.eql(expectedArray)
        })
      })
    })
  })
})

describe('when calling Location', () => {
  let returnValue

  beforeEach(() => {
    returnValue = Location('name', 'url')
  })

  test('should return expectedObject', () => {
    const expectedObj = {
      name: 'name',
      url: 'url',
    }

    returnValue.should.eql(expectedObj)
  })
})

describe('when calling SpatialModel with geometry and location', () => {
  let returnValue
  const spatialObj = {
    geographic_name: 'name',
    alt: 1,
    full_address: 'address',
    as_wkt: ['value'],
    place_uri: { identifier: 'url', pref_label: 'label' },
  }

  beforeEach(() => {
    uuidv4.mockReturnValue('uuid')
    returnValue = SpatialModel(spatialObj)
  })

  test('should return expectedObject', () => {
    const expectedObject = {
      uiid: 'uuid',
      name: 'name',
      altitude: 1,
      address: 'address',
      geometry: [{ value: 'value', key: 'uuid' }],
      location: { name: 'label', url: 'url' },
    }

    returnValue.should.deep.eql(expectedObject)
  })
})

describe('when calling SpatialModel without geometry and location', () => {
  let returnValue
  const spatialObj = {
    geographic_name: 'name',
    alt: 1,
    full_address: 'address',
  }

  beforeEach(() => {
    returnValue = SpatialModel(spatialObj)
  })

  test('should return expectedObject', () => {
    const expectedObject = {
      uiid: 'uuid',
      name: 'name',
      altitude: 1,
      address: 'address',
      geometry: [],
      location: undefined,
    }

    returnValue.should.deep.eql(expectedObject)
  })
})
