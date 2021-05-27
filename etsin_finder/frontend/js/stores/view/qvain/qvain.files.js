import { observable, action, makeObservable, override } from 'mobx'
import axios from 'axios'

import { hasMetadata, dirIdentifierKey, fileIdentifierKey } from '../common.files.items'
import { PromiseManager, getAction } from '../common.files.utils'
import { itemLoaderAny, FetchType } from '../common.files.loaders'
import { AddItemsView, SelectedItemsView } from '../common.files.views'
import urls from '../../../utils/urls'

import FilesBase from '../common.files'

class Files extends FilesBase {
  // File hierarchy for files in user projects.
  // Supports file addition and deletion and metadata editing.

  constructor(Qvain) {
    super()
    makeObservable(this)
    this.Qvain = Qvain
    this.SelectedItemsView = new SelectedItemsView(this)
    this.AddItemsView = new AddItemsView(this)
    this.promiseManager = new PromiseManager()
    this.addItem = this.addItem.bind(this)
    this.reset()
  }

  @observable refreshModalDirectory = undefined

  @observable inEdit = undefined

  cancelOnReset = promise => this.promiseManager.add(promise)

  @override async loadDirectory(dir) {
    return itemLoaderAny.loadDirectory(this, dir, this.initialLoadCount)
  }

  fetchRootIdentifier = async projectIdentifier => {
    const { data } = await axios.get(urls.common.projectFiles(projectIdentifier))
    return data.identifier
  }

  @override reset() {
    super.reset.call(this)
    this.SelectedItemsView.reset()
    this.AddItemsView.reset()
    this.promiseManager.reset()
    this.refreshModalDirectory = null
    this.inEdit = undefined
  }

  @action setRefreshModalDirectory = identifier => {
    this.refreshModalDirectory = identifier
  }

  @action updateAddedChildCount(item, inc) {
    let { parent } = item
    while (parent) {
      parent.addedChildCount += inc
      parent = parent.parent
    }
  }

  @action updateRemovedChildCount(item, inc) {
    let { parent } = item
    while (parent) {
      parent.removedChildCount += inc
      parent = parent.parent
    }
  }

  @action addItem(item) {
    // All children will be implicitly added, clear their added/removed state
    if (item.type === 'directory') {
      this.clearChildActions(item)
    }

    if (item.added) {
      return
    }

    if (item.removed) {
      this.updateRemovedChildCount(item, -1)
      item.removed = false
    }

    const parentAction = getAction(item.parent)

    // If all children of a directory are added, add the directory instead
    if (item.parent.type !== 'project') {
      const fetchType = item.parent.removed ? FetchType.ANY : FetchType.NOT_EXISTING
      const count = item.parent.pagination.counts[fetchType]
      const offset = item.parent.pagination.offsets[fetchType]
      if (count !== null && offset >= count) {
        item.added = true
        const fileCond = i => i.added || (i.existing && !i.removed && !parentAction.removed)
        const dirCond = i =>
          i.added ||
          (i.existing && !i.removed && !parentAction.removed && i.existingFileCount >= i.fileCount)
        const siblingsAdded =
          item.parent.files.every(fileCond) && item.parent.directories.every(dirCond)
        item.added = false
        if (siblingsAdded) {
          this.addItem(item.parent)
          return
        }
      }
    }

    if (!parentAction.added) {
      item.added = true
      this.updateAddedChildCount(item, 1)
    }

    this.Qvain.setChanged(true)
  }

  @action removeItem(item) {
    // All children will be implicitly removed, clear their added/removed state
    if (item.type === 'directory') {
      this.clearChildActions(item)
    }

    if (item.removed) {
      return
    }
    if (item.added) {
      this.updateAddedChildCount(item, -1)
      item.added = false
    }

    const parentAction = getAction(item.parent)

    // If all children of a directory are removed, remove the directory instead
    if (item.parent.type !== 'project') {
      const fetchType = item.parent.added ? FetchType.ANY : FetchType.EXISTING
      const count = item.parent.pagination.counts[fetchType]
      const offset = item.parent.pagination.offsets[fetchType]
      if (count !== null && offset >= count) {
        item.removed = true
        const cond = i => i.removed || (!i.existing && !i.added && !parentAction.added)
        const siblingsRemoved = item.parent.files.every(cond) && item.parent.directories.every(cond)
        item.removed = false
        if (siblingsRemoved) {
          this.removeItem(item.parent)
          return
        }
      }
    }

    if (!parentAction.removed) {
      this.updateRemovedChildCount(item, 1)
      item.removed = true
    }

    this.Qvain.setChanged(true)
  }

  @action clearChildActions(dir) {
    if (dir.addedChildCount === 0 && dir.removedChildCount === 0) {
      return
    }

    const clear = action(child => {
      if (child.added) {
        this.updateAddedChildCount(child, -1)
        child.added = false
      }
      if (child.removed) {
        this.updateRemovedChildCount(child, -1)
        child.removed = false
      }
    })

    dir.files.forEach(clear)
    dir.directories.forEach(clear)
    dir.directories.forEach(d => this.clearChildActions(d))
  }

  @action undoAction(item) {
    const clear = action(child => {
      if (child.added) {
        this.updateAddedChildCount(child, -1)
        child.added = false
      }
      if (child.removed) {
        this.updateRemovedChildCount(child, -1)
        child.removed = false
      }
    })
    clear(item)
  }

  @action.bound applyInEdit(values) {
    this.inEdit.title = values.title
    this.inEdit.description = values.description
    this.inEdit.useCategory = values.useCategory

    if (this.inEdit.type === 'file') {
      this.inEdit.fileType = values.fileType
    }
    this.inEdit = undefined
    this.Qvain.setChanged(true)
  }

  @action setInEdit = selectedItem => {
    this.inEdit = selectedItem
  }

  @action toggleInEdit = selectedItem => {
    if (this.inEdit === selectedItem) {
      this.inEdit = null
    } else {
      this.inEdit = selectedItem
    }
  }

  @action clearMetadata = item => {
    item.title = item.name
    item.description = undefined
    item.useCategory = undefined
    if (item.type === 'file') {
      item.fileType = undefined
    }
    this.Qvain.setChanged(true)
  }

  @action applyPASMeta = values => {
    this.Qvain.metadataModalFile.pasMeta = values
    this.Qvain.setMetadataModalFile(null)
  }

  @action applyClearPASMeta = values => {
    this.Qvain.clearMetadataModalFile.pasMeta = values
    this.Qvain.setClearMetadataModalFile(null)
  }

  metadataToMetax = () => {
    // Returns changed Metadata

    const directoryToMetax = dir => ({
      identifier: dir.identifier,
      title: dir.title || undefined,
      description: dir.description || undefined,
      use_category:
        (dir.useCategory && {
          identifier: dir.useCategory,
        }) ||
        undefined,
    })

    const fileToMetax = file => ({
      identifier: file.identifier,
      title: file.title || undefined,
      description: file.description || undefined,
      file_type:
        (file.fileType && {
          identifier: file.fileType,
        }) ||
        undefined,
      use_category:
        (file.useCategory && {
          identifier: file.useCategory,
        }) ||
        undefined,
    })

    const metadataHasChanged = item => {
      const key =
        (item.type === 'file' && fileIdentifierKey(item)) ||
        (item.type === 'directory' && dirIdentifierKey(item))
      const original = this.originalMetadata[key]
      if (!original) {
        return true
      }

      if (
        item.description !== original.description ||
        item.useCategory !== original.useCategory ||
        item.title !== original.title
      ) {
        return true
      }

      if (item.type === 'file' && item.fileType !== original.fileType) {
        return true
      }
      return false
    }

    const files = []
    const directories = []

    // add updated selection data
    const recurse = parent => {
      parent.files.forEach(file => {
        if (file.removed) {
          return
        }
        const key = fileIdentifierKey(file)
        if (hasMetadata(file)) {
          if (metadataHasChanged(file)) {
            files.push(fileToMetax(file))
          }
        } else if (this.originalMetadata[key]) {
          files.push({ identifier: file.identifier, delete: true }) // remove metadata
        }
      })

      parent.directories.forEach(dir => {
        if (dir.removed) {
          return
        }
        const key = dirIdentifierKey(dir)
        if (hasMetadata(dir)) {
          if (metadataHasChanged(dir)) {
            directories.push(directoryToMetax(dir))
          }
        } else if (this.originalMetadata[key]) {
          directories.push({ identifier: dir.identifier, delete: true }) // remove metadata
        }
        if (dir.addedChildCount > 0 || dir.fileCount > 0) {
          recurse(dir)
        }
      })
    }
    if (this.root) {
      recurse(this.root)
    }

    return {
      files,
      directories,
    }
  }

  actionsToMetax() {
    // Returns addition/removal actions

    const actions = { directories: [], files: [] }
    const recurse = item => {
      const actionGroup = item.type === 'file' ? actions.files : actions.directories
      if (item.added) {
        actionGroup.push({ identifier: item.identifier })
      }
      if (item.removed) {
        actionGroup.push({ identifier: item.identifier, exclude: true })
      }
      if (item.type !== 'file') {
        item.files.forEach(f => recurse(f))
        item.directories.forEach(d => recurse(d))
      }
    }
    if (this.root) {
      this.root.directories.forEach(d => recurse(d))
      this.root.files.forEach(f => recurse(f))
    }
    return actions
  }
}

export default Files
