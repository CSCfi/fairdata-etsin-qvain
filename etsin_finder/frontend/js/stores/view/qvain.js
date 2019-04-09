import { observable, action } from 'mobx'

class Qvain {
  @observable keywords = []

  @observable license = {}

  @observable accessType = {}

  @action
  setKeywords = (keywords) => {
    console.log('setKeywords: ', keywords)
    this.keywords = keywords
  }

  @action
  setLicence = (license) => {
    this.license = license
  }

  @action
  setAccessType = (accessType) => {
    this.accessType = accessType
  }
}

export default new Qvain()
