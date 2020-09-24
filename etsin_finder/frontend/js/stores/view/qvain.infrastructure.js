import { observable, action } from 'mobx'

class Infrastructures {
  constructor(Parent) {
    this.Parent = Parent
  }

  @observable infrastructures = []

  @action reset = () => {
    this.infrastructures = []
  }

  @action
  set = array => {
    this.infrastructures = array
    this.Parent.setChanged = true
  }

  @action
  remove = infrastructureToRemove => {
    this.infrastructures = this.infrastructures.filter(
      infra => infra.url !== infrastructureToRemove.url
    )
    this.changed = true
  }

  @action
  fromBackend = dataset => {
    // infrastructures
    this.reset()
    if (dataset.infrastructure !== undefined) {
      this.infrastructures = dataset.infrastructure.map(element =>
        InfrastructureModel(element.pref_label, element.identifier)
      )
    }
  }
}

export const InfrastructureModel = (name, url) => ({
  name,
  url,
})

export default Infrastructures
