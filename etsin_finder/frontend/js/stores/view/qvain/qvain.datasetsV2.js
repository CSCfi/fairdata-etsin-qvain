import { makeObservable } from 'mobx'

import Tabs from './qvain.datasetsV2.tabs'

class QvainDatasets {
  constructor() {
    makeObservable(this, {})
    this.tabs = new Tabs()
  }
}

export default QvainDatasets
