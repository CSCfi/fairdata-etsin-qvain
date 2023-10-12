import { observable, action, makeObservable, override, computed } from 'mobx'

import { hasMetadata } from '../common.files.items'
import { getAction, itemIsSelected } from '../common.files.utils'
import { itemLoaderAny, itemLoaderPublic, FetchType } from '../common.files.loaders'
import { AddItemsView, SelectedItemsView } from '../common.files.views'
import PromiseManager from '../../../utils/promiseManager'

import {
  directoriesSchema,
  directoryDescriptionSchema,
  directorySchema,
  directoryTitleSchema,
  directoryUseCategorySchema,
  fileDescriptionSchema,
  fileMetadataSchema,
  fileSchema,
  fileTitleSchema,
  fileUseCategorySchema,
  filesSchema,
} from './qvain.files.schemas'

const QvainFilesMixin = superclass =>
  class extends superclass {
    // File hierarchy for files in user projects.
    // Supports file addition and deletion and metadata editing.

    constructor(Qvain, Auth) {
      super(Qvain.Env)
      makeObservable(this)
      this.Qvain = Qvain
      this.Auth = Auth
      this.SelectedItemsView = new SelectedItemsView(this)
      this.AddItemsView = new AddItemsView(this)
      this.promiseManager = new PromiseManager()
      this.addItem = this.addItem.bind(this)
      this.reset()
    }

    fileMetadataSchema = fileMetadataSchema

    fileUseCategorySchema = fileUseCategorySchema

    fileTitleSchema = fileTitleSchema

    fileDescriptionSchema = fileDescriptionSchema

    fileSchema = fileSchema

    filesSchema = filesSchema

    directoryTitleSchema = directoryTitleSchema

    directoryDescriptionSchema = directoryDescriptionSchema

    directoryUseCategorySchema = directoryUseCategorySchema

    directorySchema = directorySchema

    directoriesSchema = directoriesSchema

    @observable refreshModalDirectory = undefined

    @observable inEdit = undefined

    @override reset() {
      super.reset.call(this)
      this.SelectedItemsView.reset()
      this.AddItemsView.reset()
      this.refreshModalDirectory = null
      this.inEdit = undefined
    }

    @computed get userHasRightsToEditProject() {
      if (!this.selectedProject) return true
      return this.Auth.user.idaProjects.includes(this.selectedProject)
    }

    @override async loadDirectory(dir) {
      if (this.userHasRightsToEditProject) {
        return itemLoaderAny.loadDirectory({
          Files: this,
          dir,
          totalLimit: this.initialLoadCount,
          sort: this.SelectedItemsView.getOrCreateDirectorySort(dir),
        })
      }
      return itemLoaderPublic.loadDirectory({
        Files: this,
        dir,
        totalLimit: this.initialLoadCount,
        sort: this.SelectedItemsView.getOrCreateDirectorySort(dir),
      })
    }

    @action.bound async changeProject(projectId) {
      super.reset()
      this.selectedProject = projectId
      return this.loadProjectRoot()
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
            (i.existing &&
              !i.removed &&
              !parentAction.removed &&
              i.existingFileCount >= i.fileCount)
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
          const siblingsRemoved =
            item.parent.files.every(cond) && item.parent.directories.every(cond)
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

    @action.bound async applyInEdit(values, { applyToChildren = false } = {}) {
      this.Qvain.setChanged(true)
      this.inEdit.title = values.title
      this.inEdit.description = values.description
      this.inEdit.useCategory = values.useCategory

      if (this.inEdit.type === 'file') {
        this.inEdit.fileType = values.fileType
      }

      if (applyToChildren) {
        await this.copyUseCategoryToSelectedChildren(this.inEdit)
      }
      this.setInEdit(undefined)
    }

    @action loadSelectedChildDirectories = async dir => {
      const recurse = async subDir =>
        Promise.all(
          subDir.directories
            .filter(d => d.added || d.existing)
            .map(async d => {
              await itemLoaderAny.loadDirectory({
                Files: this,
                dir: d,
                totalLimit: 1e6,
                sort: this.SelectedItemsView.getOrCreateDirectorySort(d),
              })
              return recurse(d)
            })
        )

      await itemLoaderAny.loadDirectory({
        Files: this,
        dir,
        totalLimit: 1e6,
        sort: this.SelectedItemsView.getOrCreateDirectorySort(dir),
      })
      return recurse(dir)
    }

    @action.bound async copyUseCategoryToSelectedChildren(dir) {
      if (dir?.type === 'directory') {
        await this.loadSelectedChildDirectories(dir)

        const useCategory = dir.useCategory
        const recurse = subDir => {
          const parentAction = getAction(subDir)
          subDir.files
            .filter(f => itemIsSelected(f, parentAction))
            .forEach(
              action(f => {
                f.useCategory = useCategory
                f.title = f.title || f.name
              })
            )
          subDir.directories
            .filter(d => itemIsSelected(d, parentAction))
            .forEach(
              action(subdir => {
                subdir.useCategory = useCategory
                subdir.title = subdir.title || subdir.name
                recurse(subdir)
              })
            )
        }
        recurse(dir)
        this.Qvain.setChanged(true)
      }
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

    metadataHasChanged(item) {
      const original = item.originalMetadata
      if (!original) {
        return hasMetadata(item)
      }

      if (
        item.description !== original.description ||
        item.useCategory !== (original.use_category?.identifier || original.use_category?.url) ||
        item.title !== original.title
      ) {
        return true
      }

      return (
        item.type === 'file' &&
        item.fileType !== (original.file_type?.identifier || original.file_type?.url)
      )
    }

    @computed get hasSelectedItems() {
      return !!(this.root && this.SelectedItemsView.getItems(this.root).length > 0)
    }
  }

export default QvainFilesMixin
