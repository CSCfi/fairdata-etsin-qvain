import { observable, action, computed } from 'mobx'

class Tabs {
  constructor(options: Record<string, any> = {}, active: string | undefined = undefined) {
    this.setOptions(options) // tab id -> tab value
    this.setActive(active) // id of current tab
  }

  @observable accessor options: Record<string, any> = {}
  // options is an object with the following structure:
  // {
  //   'tab-id': translation key,
  // }

  // active is the id of the current tab, e.g. 'own' or 'admin'
  @observable accessor active: string | undefined

  @action.bound setOptions(options: Record<string, any>) {
    this.options = options
  }

  @action.bound addOption(id: string, value: any) {
    this.options[id] = value
  }

  @action.bound setActive(val: string | undefined) {
    this.active = val
  }

  @computed get activeValue() {
    if (this.active == null) {
      return undefined
    }
    return this.options?.[this.active] // return value of active option
  }
}

export default Tabs
