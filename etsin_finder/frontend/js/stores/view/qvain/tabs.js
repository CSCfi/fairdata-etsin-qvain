import { observable, action, makeObservable } from 'mobx'

class Tabs {
  constructor(options, active) {
    this.options = options // tab names and label translations, e.g. { all: 'qvain.datasets.tabs.all' }
    this.active = active // current tab, e.g. 'all'
    makeObservable(this)
  }

  @observable options

  @observable active

  @action optionsActive(options) {
    this.options = options
  }

  @action setActive(val) {
    this.active = val
  }
}

export default Tabs
