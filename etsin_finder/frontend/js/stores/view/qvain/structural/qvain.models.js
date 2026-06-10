import { observable, action } from 'mobx'
import { v4 as uuidv4 } from 'uuid'

export class CommonModel {
  constructor() {
    this.itemId = uuidv4()
    this.init()
  }

  @action.bound init() {
    // use this method for initial actions of the inherited class
  }
}

export class ListModel extends CommonModel {
  constructor() {
    super()
  }

  @observable accessor storage = []
}
