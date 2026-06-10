import { observable, action, computed } from 'mobx'

class Tabs {
  constructor(options = {}, active = undefined) {
    this.setOptions(options) // tab id -> tab value
    this.setActive(active) // id of current tab
  }

  @observable accessor options = {}
  // options is an object with the following structure:
  // {
  //   'tab-id': translation key,
  // }

  // active is the id of the current tab, e.g. 'own' or 'admin'
  @observable accessor active

  @action.bound setOptions(options) {
    this.options = options
  }

  @action.bound addOption(id, value) {
    this.options[id] = value
  }

  @action.bound setActive(val) {
    this.active = val
  }

  @computed get activeValue() {
    return this.options?.[this.active] // return value of active option
  }
}

export default Tabs
