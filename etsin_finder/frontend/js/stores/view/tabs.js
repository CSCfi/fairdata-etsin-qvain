import { observable, action, makeObservable, computed } from 'mobx'

class Tabs {
  constructor(options = {}, active = undefined) {
    this.options = options // tab id -> tab value
    this.active = active // id of current tab
    makeObservable(this)
  }

  @observable options = {}

  @observable active

  @action.bound setOptions(options) {
    this.options = options
  }

  @action.bound setActive(val) {
    this.active = val
  }

  @computed get activeValue() {
    return this.options?.[this.active] // return value of active option
  }
}

export default Tabs
