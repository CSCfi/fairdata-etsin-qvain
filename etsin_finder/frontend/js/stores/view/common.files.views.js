import { observable, action, runInAction, makeObservable, override } from 'mobx'
import {
  itemLoaderNew,
  itemLoaderExisting,
  itemLoaderAny,
  itemLoaderPublic,
} from './common.files.loaders'
import { getAction } from './common.files.utils'

export class DirectoryView {
  // Responsible for providing lists of items (files or directories) for display.
  // - Handles per-view state of the directory hierarchy.
  // - Responsible for calling correct loader when user requests items.

  constructor(Files) {
    this.Files = Files
    if (typeof this.getItems !== 'function') {
      throw new TypeError('Must override getItems')
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

  isOpen = dir => !!(this.openState[dir.key] || dir.type === 'project')

  @action open = async dir => {
    if (!this.openState[dir.key] && !dir.loaded) {
      const getCurrentCount = () => this.getItems(dir).length
      if (!dir.loaded || getCurrentCount() < this.defaultShowLimit) {
        if (
          !(await this.getItemLoader(dir).loadDirectory(
            this.Files,
            dir,
            this.defaultShowLimit,
            getCurrentCount
          ))
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
    const success = await this.getItemLoader(dir).loadDirectory(
      this.Files,
      dir,
      newLimit,
      getCurrentCount
    )

    runInAction(() => {
      this.showLimitState[dir.key] = Math.max(
        this.showLimitState[dir.key] || this.defaultShowLimit,
        newLimit
      )
    })
    return success
  }

  hasMore(dir) {
    const showLimit = this.getShowLimit(dir)
    const loader = this.getItemLoader(dir)
    const totalCount = this.getItems(dir, true).length
    const paginationKey = loader.getPaginationKey('')
    const count = dir.pagination.counts[paginationKey]

    if (count == null) {
      return true
    }

    if (showLimit < totalCount) {
      return true
    }

    return loader.hasMore(dir, '')
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
}

export class AddItemsView extends DirectoryView {
  getItemLoader(dir) {
    const dirAction = getAction(dir)
    if (dir.existing && dirAction.removed) {
      return itemLoaderAny
    }
    return itemLoaderNew
  }

  getItems(dir, ignoreLimit) {
    const items = [...dir.directories, ...dir.files]
    const showLimit = this.getShowLimit(dir)
    const paginationKey = this.getItemLoader(dir).getPaginationKey()
    const offset = dir.pagination.offsets[paginationKey] || 0
    const dirAction = getAction(dir)

    let counter = 0
    let prevIndex = -1
    const filtered = items.filter(item => {
      const { index } = item
      if (index - prevIndex > 1 && counter >= offset) {
        return false // missing item, keep remaining ones hidden
      }
      prevIndex = index

      const itemAction = {
        added: item.added || (!item.removed && dirAction.added),
        removed: item.removed || (!item.added && dirAction.removed),
      }

      if (itemAction.removed || (item.type === 'directory' && item.removedChildCount > 0)) {
        counter += 1
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

      counter += 1
      return true
    })

    if (!ignoreLimit && showLimit > 0 && filtered.length > showLimit) {
      filtered.length = showLimit
    }
    return filtered
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

  getItems(dir, ignoreLimit = false) {
    const items = [...dir.directories, ...dir.files]
    const showLimit = this.getShowLimit(dir)

    const dirAction = getAction(dir)

    const paginationKey = this.getItemLoader(dir).getPaginationKey()
    const offset = dir.pagination.offsets[paginationKey] || 0
    let counter = 0

    let prevIndex = -1
    const filtered = items.filter(item => {
      const { index } = item
      if (index - prevIndex > 1 && counter >= offset) {
        return false // missing item, keep remaining ones hidden
      }
      prevIndex = index

      const itemAction = {
        added: item.added || (!item.removed && dirAction.added),
        removed: item.removed || (!item.added && dirAction.removed),
      }

      if (itemAction.added || (item.type === 'directory' && item.addedChildCount > 0)) {
        counter += 1
        return true
      }

      if (this.hideRemoved && itemAction.removed) {
        return false
      }

      if (!this.hideRemoved && item.existing && itemAction.removed) {
        counter += 1
        return true
      }

      if (item.existing) {
        if (
          item.type === 'directory' &&
          item.addedChildCount === 0 &&
          item.existingFileCount === 0
        ) {
          return false
        }

        counter += 1
        return true
      }
      return false
    })

    if (!ignoreLimit && showLimit > 0 && filtered.length > showLimit) {
      filtered.length = showLimit
    }
    return filtered
  }
}

export class PublicItemsView extends DirectoryView {
  getItemLoader() {
    return itemLoaderPublic
  }

  getItems(dir, ignoreLimit = false) {
    const items = [...dir.directories, ...dir.files]
    const showLimit = this.getShowLimit(dir)

    const paginationKey = this.getItemLoader(dir).getPaginationKey()
    const offset = dir.pagination.offsets[paginationKey] || 0
    let counter = 0

    let prevIndex = -1
    const filtered = items.filter(item => {
      const { index } = item
      if (index - prevIndex > 1 && counter >= offset) {
        return false // missing item, keep remaining ones hidden
      }
      prevIndex = index
      if (item.existing) {
        counter += 1
        return true
      }
      return false
    })

    if (!ignoreLimit && showLimit > 0 && filtered.length > showLimit) {
      filtered.length = showLimit
    }
    return filtered
  }
}
