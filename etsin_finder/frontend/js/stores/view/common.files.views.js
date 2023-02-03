import { observable, action, runInAction, makeObservable, override } from 'mobx'
import {
  itemLoaderNew,
  itemLoaderExisting,
  itemLoaderAny,
  itemLoaderPublic,
} from './common.files.loaders'
import Sort from './common.files.sort'
import { getAction } from './common.files.utils'

export class DirectoryView {
  // Responsible for providing lists of items (files or directories) for display.
  // - Handles per-view state of the directory hierarchy.
  // - Responsible for calling correct loader when user requests items.

  constructor(Files) {
    this.Files = Files
    if (typeof this.filterItem !== 'function') {
      throw new TypeError('Must override filterItem')
    }
    if (typeof this.getItemLoader !== 'function') {
      throw new TypeError('Must override getItemLoader')
    }
    makeObservable(this)
  }

  @action reset() {
    this.openState = {}
    this.showLimitState = {}
    this.checkedState = {}
    this.clearShowLimits()
  }

  // Opening/closing directories

  @observable openState = {}

  @observable directoryFilters = {}

  @observable directorySort = {}

  isOpen = dir => !!(this.openState[dir.key] || dir.type === 'project')

  @action.bound setDirectoryFilter(dir, filter) {
    this.directoryFilters[dir.identifier] = filter.toLowerCase()
  }

  getDirectoryFilter(dir) {
    return this.directoryFilters[dir.identifier] || ''
  }

  @action.bound setDirectorySort(dir, sort) {
    this.directorySort[dir.identifier] = sort
  }

  getDirectorySort(dir) {
    return this.directorySort[dir.identifier]
  }

  @action.bound getOrCreateDirectorySort(dir) {
    if (!this.directorySort[dir.identifier]) this.setDirectorySort(dir, new Sort())
    return this.directorySort[dir.identifier]
  }

  @action open = async dir => {
    if (!this.openState[dir.key] && !dir.loaded) {
      const getCurrentCount = () => this.getItems(dir).length
      if (!dir.loaded || getCurrentCount() < this.defaultShowLimit) {
        if (
          !(await this.getItemLoader(dir).loadDirectory({
            Files: this.Files,
            dir,
            totalLimit: this.defaultShowLimit,
            sort: this.getOrCreateDirectorySort(dir),
            getCurrentCount,
            filter: this.getDirectoryFilter(dir),
          }))
        ) {
          return false
        }
      }
    }
    runInAction(() => {
      this.openState[dir.key] = true
    })
    return true
  }

  @action close = dir => {
    this.openState[dir.key] = false
  }

  @action toggleOpen = async dir => {
    if (!this.openState[dir.key]) {
      await this.open(dir)
    } else {
      this.close(dir)
    }
  }

  @action openPaths = async (paths, onlyParents) => {
    // get items from paths
    const promises = paths.map(path => this.Files.getItemByPath(path))
    const items = await Promise.all(promises)

    // open parent items of items
    const dirsToOpen = []
    for (const item of items.filter(d => d)) {
      if (!onlyParents && item.type === 'directory') {
        dirsToOpen.push(item)
      }
      let parent = item.parent
      while (parent && parent.type === 'directory') {
        dirsToOpen.push(parent)
        parent = parent.parent
      }
    }
    await Promise.all(dirsToOpen.map(dir => this.open(dir)))
  }

  @action setAllOpen = async newState => {
    const setChildrenOpen = async dir =>
      Promise.all(
        dir.directories.map(async d => {
          if (d.type === 'directory') {
            if (newState) {
              if (!(await this.open(d))) {
                return false
              }
            } else {
              this.close(d)
            }
          }
          return setChildrenOpen(d)
        })
      )
    await setChildrenOpen(this.Files.root)
  }

  @observable defaultShowLimit = 100 // how many items to show

  @observable showLimitIncrement = 200 // how many additional items to show when "show more" is clicked

  @observable showLimitState = {}

  clearShowLimits() {
    this.showLimitState = {}
  }

  getShowLimit(dir) {
    return this.showLimitState[dir.key] || this.defaultShowLimit
  }

  @action showMore = async dir => {
    const newLimit = this.getShowLimit(dir) + this.showLimitIncrement
    const getCurrentCount = () => this.getItems(dir).length
    const success = await this.getItemLoader(dir).loadDirectory({
      Files: this.Files,
      dir,
      totalLimit: newLimit,
      sort: this.getOrCreateDirectorySort(dir),
      getCurrentCount,
      filter: this.getDirectoryFilter(dir),
    })

    runInAction(() => {
      this.showLimitState[dir.key] = Math.max(
        this.showLimitState[dir.key] || this.defaultShowLimit,
        newLimit
      )
    })
    return success
  }

  @action filter = async (dir, filter = '') => {
    // Load directory using filter, apply filter to directory after load is complete
    const getCurrentCount = () => this.getItems(dir, { filter }).length
    const success = await this.getItemLoader(dir).loadDirectory({
      Files: this.Files,
      dir,
      totalLimit: this.getShowLimit(dir),
      sort: this.getOrCreateDirectorySort(dir),
      getCurrentCount,
      filter,
    })
    this.setDirectoryFilter(dir, filter)

    return success
  }

  hasMore(dir) {
    const filter = this.getDirectoryFilter(dir)
    const showLimit = this.getShowLimit(dir)
    const loader = this.getItemLoader(dir)
    const totalCount = this.getItems(dir, { ignoreLimit: true }).length
    const sort = this.getOrCreateDirectorySort(dir)
    const paginationKey = loader.getPaginationKey(filter, sort)
    const count = dir.pagination.counts[paginationKey]
    if (count == null && !dir.pagination.fullyLoaded) {
      return true
    }

    if (showLimit < totalCount) {
      return true
    }

    return loader.hasMore({ dir, sort, filter })
  }

  @action setDefaultShowLimit = async (limit, increment) => {
    this.defaultShowLimit = limit
    this.showLimitIncrement = increment
  }

  // Selecting items

  @observable checkedState = {}

  isChecked(item) {
    return !!this.checkedState[item.key]
  }

  getTopmostChecked = () => {
    // Recurse through file hierarchy and return checked items.
    // Recursion stops when a checked item is encountered.
    // All children (including checked ones) of a checked directory are ignored.
    const checked = []
    const recurse = parent => {
      if (parent.files) {
        parent.files.forEach(file => {
          if (this.isChecked(file)) {
            checked.push(file)
          }
        })
      }

      if (parent.directories) {
        parent.directories.forEach(dir => {
          if (this.isChecked(dir)) {
            checked.push(dir)
          } else {
            recurse(dir)
          }
        })
      }
    }
    recurse(this.Files.root)
    return checked
  }

  @action toggleChecked = item => {
    this.checkedState[item.key] = !this.checkedState[item.key]
  }

  @action clearChecked = () => {
    this.checkedState = {}
  }

  getItems(dir, { ignoreLimit = false, filter = '' } = {}) {
    // Return up to directory showLimit items for directory.
    //
    // Even though more items may be loaded, only show items up to the point where there are
    // no non-loaded items that might be missing. This way items from "Show more" always show up
    // after the previously shown.
    //
    // As an example, when pagination offset is 5, it means at least the first 5 items relevant to
    // loader have been loaded from Metax. After those first 5 items, a gap in indexes between items
    // may contain items that need to be loaded before more items can be shown.
    const loader = this.getItemLoader(dir)
    const sort = this.getOrCreateDirectorySort(dir)
    const items = sort.getSortedItems(dir)
    const showLimit = this.getShowLimit(dir)
    const filterText = filter || this.getDirectoryFilter(dir)
    const paginationKey = loader.getPaginationKey(filterText, sort)
    const loaderHasMore = loader.hasMore({ dir, sort, filter: filterText })
    const offset = dir.pagination.offsets[paginationKey] || 0
    const dirAction = getAction(dir)

    let counter = 0
    let prevIndex = -1

    const filtered = items.filter(item => {
      const index = item.index[sort.paginationKey]
      if (index - prevIndex > 1 && counter >= offset && loaderHasMore) {
        return false // missing item, keep remaining ones hidden
      }
      prevIndex = index
      if (filterText && !item.name.toLowerCase().includes(filterText)) {
        return false
      }

      const itemAction = {
        added: item.added || (!item.removed && dirAction.added),
        removed: item.removed || (!item.added && dirAction.removed),
      }

      if (loader.filterItem(item)) {
        counter += 1 // item counts towards pagination offset
      }
      return this.filterItem(item, itemAction) // view-specific filtering
    })

    if (!ignoreLimit && showLimit > 0 && filtered.length > showLimit) {
      filtered.length = showLimit
    }
    return filtered
  }
}

export class AddItemsView extends DirectoryView {
  getItemLoader(dir) {
    const dirAction = getAction(dir)
    if (dir.existing && dirAction.removed) {
      return itemLoaderAny
    }
    return itemLoaderNew
  }

  filterItem(item, itemAction) {
    if (itemAction.removed || (item.type === 'directory' && item.removedChildCount > 0)) {
      return true
    }

    if (item.type === 'directory' && item.existing && item.existingFileCount >= item.fileCount) {
      return false
    }

    if (item.type === 'file' && item.existing) {
      return false
    }

    if (itemAction.added) {
      return false
    }

    return true
  }
}

export class SelectedItemsView extends DirectoryView {
  constructor(props) {
    super(props)
    makeObservable(this)
  }

  @observable hideRemoved

  @action toggleHideRemoved = () => {
    this.hideRemoved = !this.hideRemoved
  }

  @action setHideRemoved = val => {
    this.hideRemoved = val
  }

  @override reset() {
    super.reset()
    this.hideRemoved = false
  }

  getItemLoader(dir) {
    const dirAction = getAction(dir)
    if (dirAction.added) {
      if (dir.existing) {
        return itemLoaderAny
      }
      return itemLoaderNew
    }
    return itemLoaderExisting
  }

  filterItem(item, itemAction) {
    if (itemAction.added || (item.type === 'directory' && item.addedChildCount > 0)) {
      return true
    }

    if (this.hideRemoved && itemAction.removed) {
      return false
    }

    if (!this.hideRemoved && item.existing && itemAction.removed) {
      return true
    }

    if (item.existing) {
      if (item.type === 'directory' && item.addedChildCount === 0 && item.existingFileCount === 0) {
        return false
      }

      return true
    }
    return false
  }
}

export class PublicItemsView extends DirectoryView {
  getItemLoader() {
    return itemLoaderPublic
  }

  filterItem(item) {
    return item.existing
  }
}
