import { observable, makeObservable, action, computed } from 'mobx'

export const DIRECTORY_NAME = 'directory_path'
export const FILE_NAME = 'file_path'
export const DIRECTORY_DATE = 'date_created'
export const FILE_DATE = 'file_frozen'

const nameOption = { value: { file: FILE_NAME, directory: DIRECTORY_NAME }, option: 'name' }
const dateOption = { value: { file: FILE_DATE, directory: DIRECTORY_DATE }, option: 'date' }

class Sort {
  constructor() {
    makeObservable(this)
  }

  @action.bound reset() {
    this.currentOption = nameOption
    this.reverse = false
  }

  @observable currentOption = nameOption

  @observable options = [nameOption, dateOption]

  @observable reverse = false

  @observable hasChanged = false

  @action.bound
  setOption(value) {
    this.currentOption = value
    this.hasChanged = true
  }

  @action.bound
  toggleReverse() {
    this.reverse = !this.reverse
    this.hasChanged = true
  }

  @action.bound
  getSortedItems(dir) {
    const items = [...dir.directories, ...dir.files]
    const sorted = items.sort((a, b) => a.index[this.paginationKey] - b.index[this.paginationKey])
    return sorted
  }

  @computed get fileOrdering() {
    return this.sortReverse + this.currentOption.value.file
  }

  @computed get directoryOrdering() {
    return this.sortReverse + this.currentOption.value.directory
  }

  @computed get sortReverse() {
    return this.reverse ? '-' : ''
  }

  @computed get paginationKey() {
    return `${this.currentOption.option}${this.reverse ? '-reverse' : ''}`
  }
}

export default Sort
