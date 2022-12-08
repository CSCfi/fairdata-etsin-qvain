import { cloneDeep } from 'lodash'
import Spatials from './qvain.spatials'

class Locations extends Spatials {
  constructor(Parent, locations = [], Env = Parent.Env) {
    super(Parent, locations)
    this.Env = Env

    this.translationsRoot = 'qvain.historyV2.location'
  }

  clone = () => {
    const newLocations = new Locations(this.Parent)

    newLocations.storage = this.storage.map(loc => cloneDeep(loc))
    return newLocations
  }
}

export default Locations
