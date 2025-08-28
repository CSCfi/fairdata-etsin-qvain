import Locations from '@/stores/view/qvain/qvain.provenances.locations'
import EnvClass from '@/stores/domain/env'

const Parent = {
  Env: new EnvClass(),
  test: 'test',
}

const existingLocations = ['some locations']

vi.mock('@/stores/view/qvain/qvain.spatials', () => {
  class MockSpatials {
    constructor(...args) {
      this.mockConstructor(...args)
    }

    mockConstructor = vi.fn(Parent => {
      this.Parent = Parent
    })
  }
  return { default: MockSpatials }
})

describe('Locations', () => {
  let locations
  beforeEach(() => {
    locations = new Locations(Parent, existingLocations)
  })

  test('should call Spatials costructor when calling Location constructor', () => {
    expect(locations.mockConstructor).toHaveBeenCalledWith(Parent, existingLocations)
  })

  test('should have translationsRoot matched with V2', () => {
    expect(locations.translationsRoot).to.equal('qvain.historyV2.location')
  })
})
