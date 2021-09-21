import Spatials from './qvain.spatials'

class Locations extends Spatials {
  constructor(Parent, locations = []) {
    super(Parent, locations)
  }

  clone = () => new Locations(this.Parent, this.toBackend())

  translationsRoot = 'qvain.history.provenance.modal.locationInput'
}

export default Locations
