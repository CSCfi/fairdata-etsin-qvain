import Locations from '@/stores/view/qvain/qvain.provenances.locations'
import 'chai/register-expect'

const Parent = {
  test: 'test',
}

const existingLocations = ['some locations']

jest.mock('@/stores/view/qvain/qvain.spatials', () => {
  class MockSpatials {
    constructor(...args) {
      this.mockConstructor(...args)
    }

    mockConstructor = jest.fn()
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

  test('should have translationsRoot property', () => {
    locations.translationsRoot.should.eql('qvain.history.provenance.modal.locationInput')
  })
})
