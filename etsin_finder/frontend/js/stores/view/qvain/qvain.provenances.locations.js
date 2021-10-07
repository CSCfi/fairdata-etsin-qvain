import { cloneDeep } from 'lodash'
import Spatials from './qvain.spatials'

class Locations extends Spatials {
  constructor(Parent, locations = []) {
    super(Parent, locations)
  }

  clone = () => {
    const newLocations = new Locations(this.Parent)

    newLocations.storage = this.storage.map(loc => cloneDeep(loc))
    return newLocations
  }

  translationsRoot = 'qvain.history.provenance.modal.locationInput'
}

export default Locations
