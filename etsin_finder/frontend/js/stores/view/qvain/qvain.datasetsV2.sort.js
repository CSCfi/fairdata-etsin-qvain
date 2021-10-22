import { action, computed, makeObservable, observable } from 'mobx'
import moment from 'moment'

const stateToNumber = dataset => {
  if (dataset.next_draft) {
    return 1
  }
  if (dataset.state === 'published') {
    return 2
  }
  return 0
}

class QvainDatasetsV2 {
  constructor(Locale) {
    makeObservable(this)
    this.Locale = Locale
    this.reset()
  }

  @action.bound reset() {
    this.type = 'dateCreated'
    this.reverse = false
  }

  @observable type

  @observable reverse

  @action.bound toggleReverse() {
    this.reverse = !this.reverse
  }

  options = [{ value: 'title' }, { value: 'status' }, { value: 'owner' }, { value: 'dateCreated' }]

  @computed get currentOption() {
    return this.options.find(opt => opt.value === this.type)
  }

  @action.bound setOption(option) {
    if (this.type !== option.value) {
      this.type = option.value
      this.reverse = false
    }
  }

  getTitle(dataset) {
    const ds = dataset.next_draft || dataset
    return this.Locale.getValueTranslation(ds?.research_dataset?.title) || ''
  }

  sortFuncs = {
    dateCreated: (a, b) => moment(b.date_created) - moment(a.date_created), // newest first
    owner: (a, b) => {
      const isOwnA = a.sources?.includes('creator') ? 1 : 0
      const isOwnB = b.sources?.includes('creator') ? 1 : 0
      return isOwnB - isOwnA // own datasets first
    },
    title: (a, b) =>
      this.getTitle(a).localeCompare(this.getTitle(b), undefined, {
        numeric: true,
        sensitivity: 'base',
      }),
    status: (a, b) => stateToNumber(b) - stateToNumber(a),
  }

  sorted(originalGroups) {
    const groups = [...originalGroups]
    const func = this.sortFuncs[this.type]
    groups.sort((a, b) => this.sortFuncs.title(a[0], b[0]))
    groups.sort((a, b) => func(a[0], b[0]))
    if (this.reverse) {
      groups.reverse()
    }
    return groups
  }
}

export default QvainDatasetsV2
