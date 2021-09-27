import { observable, action, makeObservable } from 'mobx'

class Tabs {
  constructor() {
    makeObservable(this)
  }

  @observable options = { all: 'qvain.datasets.tabs.all' }

  @observable active = 'all'

  @action setActive(val) {
    this.active = val
  }
}

export default Tabs
