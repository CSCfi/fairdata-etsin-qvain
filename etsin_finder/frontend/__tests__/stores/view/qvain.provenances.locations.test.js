import Locations from '@/stores/view/qvain/qvain.provenances.locations'
import 'chai/register-expect'
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

  test('should have translationsRoot matched to V1', () => {
    expect(locations.translationsRoot).to.equal('qvain.history.provenance.modal.locationInput')
  })

  describe('given QVAIN.EDITOR_V2 flag is enabled', () => {
    beforeAll(() => {
      Parent.Env.Flags.setFlag('QVAIN.EDITOR_V2', true)
    })

    test('should have translationsRoot matched with V2', () => {
      expect(locations.translationsRoot).to.equal('qvain.history.location')
    })
  })
})
