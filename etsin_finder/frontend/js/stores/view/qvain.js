import { observable, action } from 'mobx'

class Qvain {
  @observable license = {}

  @action
  setLicence = (license) => {
    console.log('new license: ', license)
    this.license = license
  }
}

export default new Qvain()
