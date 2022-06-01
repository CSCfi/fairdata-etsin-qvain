import { cloneDeep } from 'lodash'
import Spatials from './qvain.spatials'

class Locations extends Spatials {
  constructor(Parent, locations = [], Env = Parent.Env) {
    super(Parent, locations)
    this.Env = Env

    this.translationsRoot = this.Env?.Flags?.flagEnabled?.('QVAIN.EDITOR_V2')
      ? 'qvain.history.location'
      : 'qvain.history.provenance.modal.locationInput'
  }

  clone = () => {
    const newLocations = new Locations(this.Parent)

    newLocations.storage = this.storage.map(loc => cloneDeep(loc))
    return newLocations
  }
}

export default Locations
