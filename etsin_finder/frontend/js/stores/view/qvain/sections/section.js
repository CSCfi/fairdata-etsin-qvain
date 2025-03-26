import { makeObservable, observable, action, override, runInAction } from 'mobx'

class Section {
  constructor({ parent, translationsRoot = '', fields = {} }) {
    makeObservable(this)
    runInAction(() => {
      this.translationsRoot = translationsRoot
      this.translations = {
        title: `${this.translationsRoot}.title`,
        tooltip: `${this.translationsRoot}.tooltip`,
      }
      this.fields = fields
      this.parent = parent
    })
  }

  @observable translations

  @observable translationsRoot

  @observable isExpanded = false

  @action.bound toggleExpanded = () => {
    this.isExpanded = !this.isExpanded
  }

  @action.bound setExpanded(v) {
    this.isExpanded = !!v
  }

  @action.bound getField(fieldName) {
    return this.fields[fieldName]
  }

  @action.bound expandIfPopulated() {
    return false
  }
}

export default Section

export class SectionWithList extends Section {
  constructor({ parent, translationsRoot, fields, listName }) {
    super({ parent, translationsRoot, fields })
    this.listName = listName
  }

  @override getField(fieldName) {
    if (!fieldName) {
      return this[this.listName]
    }
    return this[this.listName].getField(fieldName)
  }
}
