import Locations from '@/stores/view/qvain/qvain.provenances.locations'
import { expect } from 'chai'
import EnvClass from '@/stores/domain/env'

const Parent = {
  Env: new EnvClass(),
  test: 'test',
}

const existingLocations = ['some locations']

jest.mock('@/stores/view/qvain/qvain.spatials', () => {
  class MockSpatials {
    constructor(...args) {
      this.mockConstructor(...args)
    }

    mockConstructor = jest.fn(Parent => {
      this.Parent = Parent
    })
  }
  return MockSpatials
})

describe('Locations', () => {
  let locations
  beforeEach(() => {
    locations = new Locations(Parent, existingLocations)
  })

  test('should call Spatials costructor when calling Location constructor', () => {
    expect(locations.mockConstructor).to.have.beenCalledWith(Parent, existingLocations)
  })

  test('should have translationsRoot matched with V2', () => {
    expect(locations.translationsRoot).to.equal('qvain.historyV2.location')
  })
})
