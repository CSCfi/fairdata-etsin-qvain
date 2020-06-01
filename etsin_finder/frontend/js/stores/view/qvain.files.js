import axios from 'axios'
import { observable, action, runInAction, computed } from 'mobx'

import { FileAPIURLs } from '../../components/qvain/utils/constants'
import { Project, hasMetadata, dirIdentifierKey, fileIdentifierKey } from './qvain.files.items'
import { PromiseManager, ChildItemCounter, getAction } from './qvain.files.utils'
import { itemLoaderAny, FetchType } from './qvain.files.loaders'
import { AddItemsView, SelectedItemsView } from './qvain.files.views'

class Files {
  constructor(Qvain) {
    this.Qvain = Qvain
    this.SelectedItemsView = new SelectedItemsView(this)
    this.AddItemsView = new AddItemsView(this)
    this.promiseManager = new PromiseManager()
    this.reset()
  }

  @observable initialPagination = 10

  @observable root = null

  @observable selectedProject = undefined

  @observable projectLocked = false // prevent changing saved project

  @observable selectedExistingMetadata = {}

  @observable selectedExistingCounter = null

  @observable refreshModalDirectory = undefined

  @observable loadingProjectInfo = null

  @observable loadingProjectRoot = null

  @observable loadingMetadata = null

  @observable inEdit = undefined

  cache = {} // used for storing data for items that haven't been fully loaded yet

  @observable originalMetadata = {}

  cancelOnReset = (promise) => (this.promiseManager.add(promise))

  @action reset = () => {
    this.root = null
    this.selectedProject = undefined
    this.selectedExistingMetadata = {}
    this.selectedExistingCounter = new ChildItemCounter()
    this.SelectedItemsView.reset()
    this.AddItemsView.reset()
    this.refreshModalDirectory = null
    this.inEdit = undefined
    this.cache = {}
    this.originalMetadata = {}
    this.projectLocked = false

    if (this.loadingProjectInfo && this.loadingProjectInfo.promise) {
      this.loadingProjectInfo.promise.cancel()
    }
    this.loadingProjectInfo = null

    if (this.loadingMetadata && this.loadingMetadata.promise) {
      this.loadingMetadata.promise.cancel()
    }
    this.loadingMetadata = null

    if (this.loadingProjectRoot && this.loadingProjectRoot.promise) {
      this.loadingProjectRoot.promise.cancel()
    }
    this.loadingProjectRoot = null
    this.promiseManager.reset()
  }

  @action setRefreshModalDirectory = (identifier) => {
    this.refreshModalDirectory = identifier
  }

  @action loadProjectInfo = async (dataset) => {
    const identifier = dataset.identifier

    const alreadyLoading = this.loadingProjectInfo && this.loadingProjectInfo.identifier === this.identifier
    if (alreadyLoading) {
      return
    }

    if (this.loadingProjectInfo && this.loadingProjectInfo.promise && !this.loadingProjectInfo.error) {
      this.loadingProjectInfo.promise.cancel()
    }

    const load = async () => {
      const { data } = await axios.get(FileAPIURLs.V2_DATASET_PROJECTS + identifier)
      runInAction(() => {
        if (data.length > 0) {
          this.selectedProject = data[0]
          this.projectLocked = true
        } else {
          this.selectedProject = undefined
        }
      })
    }

    try {
      this.loadingProjectInfo = {
        identifier,
        promise: load(this.selectedProject),
        error: null,
        done: false,
      }
      await this.loadingProjectInfo.promise
    } catch (error) {
      runInAction(() => {
        this.selectedProject = undefined
        this.loadingProjectInfo.error = error
      })
    } finally {
      runInAction(() => {
        if (this.loadingProjectInfo) {
          this.loadingProjectInfo.done = true
        }
      })
    }
  }

  @action loadMetadata = async (dataset) => {
    const identifier = dataset.identifier

    const alreadyLoading = this.loadingMetadata && this.loadingMetadata.identifier === this.identifier
    if (alreadyLoading) {
      return
    }

    if (this.loadingMetadata && this.loadingMetadata.promise && !this.loadingMetadata.error) {
      this.loadingMetadata.promise.cancel()
    }

    const load = async () => {
      const { data } = await axios.get(FileAPIURLs.V2_DATASET_USER_METADATA + identifier)
      runInAction(() => {
        // Load metadata for files and directories selected in the dataset.
        const dsFiles = data.files || []
        const dsDirectories = data.directories || []
        if (dsFiles.length > 0 || dsDirectories.length > 0) {
          const items = [...dsFiles, ...dsDirectories]
          items.forEach((v, i) => { v.details = { id: i } })

          dsFiles.forEach(file => {
            file.id = file.details.id
            const key = fileIdentifierKey(file)
            this.originalMetadata[key] = {
              identifier: file.identifier,
              title: file.title,
              description: file.description,
              useCategory: file.use_category && file.use_category.identifier,
              fileType: file.file_type && file.file_type.identifier,
              existing: true,
              type: 'file',
            }
            this.cache[key] = {
              ...this.originalMetadata[key],
            }
          })

          dsDirectories.forEach(dir => {
            dir.id = dir.details.id
            const key = dirIdentifierKey(dir)
            this.originalMetadata[key] = {
              identifier: dir.identifier,
              title: dir.title,
              description: dir.description,
              useCategory: dir.use_category && dir.use_category.identifier,
              existing: true,
              type: 'directory',
            }
            this.cache[key] = {
              ...this.originalMetadata[key],
            }
          })
        }
      })
    }

    try {
      this.loadingMetadata = {
        identifier,
        promise: load(this.selectedProject),
        error: null,
        done: false,
      }
      await this.loadingMetadata.promise
    } catch (error) {
      runInAction(() => {
        this.loadingMetadata.error = error
      })
    } finally {
      runInAction(() => {
        if (this.loadingMetadata) {
          this.loadingMetadata.done = true
        }
      })
    }
  }

  @action editDataset = async (dataset) => {
    this.reset()
    await Promise.all([this.loadProjectInfo(dataset), this.loadMetadata(dataset)])
    return this.loadProjectRoot()
  }

  @action loadAllDirectories = async () => {
    const loadChildren = async (dir) => (
      Promise.all(dir.directories.map(async d => {
        await this.loadDirectory(d)
        return loadChildren(d)
      }))
    )
    await loadChildren(this.root)
  }

  @action loadDirectory = async (dir) => itemLoaderAny.loadDirectory(this, dir, 100)

  @action changeProject = projectId => {
    this.selectedProject = projectId
    this.AddItemsView.reset()
    this.SelectedItemsView.reset()
    this.promiseManager.reset()
    return this.loadProjectRoot()
  }

  @action loadProjectRoot = async () => {
    const alreadyLoading = this.loadingProjectRoot && this.loadingProjectRoot.identifier === this.selectedProject
    if (alreadyLoading || (this.root && this.root.projectIdentifier === this.selectedProject)) {
      return
    }
    this.root = null
    if (!this.selectedProject) {
      return
    }
    if (this.loadingProjectRoot && !this.loadingProjectRoot.error) {
      this.loadingProjectRoot.promise.cancel()
    }

    const fetchRootIdentifier = async (projectIdentifier) => {
      const { data } = await axios.get(FileAPIURLs.V2_PROJECT_DIR_URL + projectIdentifier)
      return data.identifier
    }

    const loadRoot = async (projectIdentifier) => {
      const rootIdentifier = await fetchRootIdentifier(projectIdentifier)
      const root = observable(Project(projectIdentifier, rootIdentifier))
      await this.loadDirectory(root)
      runInAction(() => {
        this.root = root
      })
    }

    try {
      this.loadingProjectRoot = {
        identifier: this.selectedProject,
        promise: loadRoot(this.selectedProject),
        error: null,
        done: false,
      }
      await this.loadingProjectRoot.promise
    } catch (error) {
      runInAction(() => {
        this.root = null
        this.loadingProjectRoot.error = error
      })
    } finally {
      runInAction(() => {
        if (this.loadingProjectInfo) {
          this.loadingProjectInfo.done = true
        }
      })
    }
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

  getItemByPath = async (path, skipFinalLoad) => {
    // Get file or directory by path. Loads all parent directories in the path
    // automatically if needed. Useful for tests.
    const parts = path.split('/')
    if (parts.length === 1) {
      return undefined
    }
    if (path === '/') {
      return this.root
    }
    let dir = this.root
    let prevDir = dir
    for (let i = 1; i < parts.length; i += 1) {
      const part = parts[i]
      dir = dir.directories.find(d => d.name === part)
      if (dir && !dir.loaded) {
        if (i < parts.length - 1 || !skipFinalLoad) {
          // eslint-disable-next-line no-await-in-loop
          await this.loadDirectory(dir)
        }
      }
      if (!dir) {
        const file = prevDir.files.find(f => f.name === part)
        return file
      }
      prevDir = dir
    }
    return dir
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
        const fileCond = (i) => i.added || (i.existing && !i.removed && !parentAction.removed)
        const dirCond = (i) => i.added || (i.existing && !i.removed && !parentAction.removed && i.existingFileCount >= i.fileCount)
        const siblingsAdded = item.parent.files.every(fileCond) && item.parent.directories.every(dirCond)
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
        const cond = (i) => i.removed || (!i.existing && !i.added && !parentAction.added)
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

    const clear = action((child) => {
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
    const clear = action((child) => {
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

  @action applyInEdit = values => {
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

  @action applyPASMeta = values => {
    Object.assign(this.Qvain.metadataModalFile.pasMeta, values)
    this.Qvain.setMetadataModalFile(null)
  }

  metadataToMetax = () => {
    // Returns changed Metadata

    const directoryToMetax = (dir) => ({
      identifier: dir.identifier,
      title: dir.title || undefined,
      description: dir.description || undefined,
      use_category: (dir.useCategory && {
        identifier: dir.useCategory
      }) || undefined,
    })

    const fileToMetax = (file) => ({
      identifier: file.identifier,
      title: file.title || undefined,
      description: file.description || undefined,
      file_type: (file.fileType && {
        identifier: file.fileType,
      }) || undefined,
      use_category: (file.useCategory && {
        identifier: file.useCategory
      }) || undefined,
    })

    const metadataHasChanged = (item) => {
      const key = (item.type === 'file' && fileIdentifierKey(item)) || (item.type === 'directory' && dirIdentifierKey(item))
      const original = this.originalMetadata[key]
      if (!original) {
        return true
      }

      if (item.description !== original.description ||
        (item.useCategory && item.useCategory.identifier) !== (original.useCategory && original.useCategory.identifier) ||
        item.title !== original.title) {
        return true
      }
      if (item.type === 'file' && (item.fileType && item.fileType.identifier) !== (original.fileType && original.fileType.identifier)) {
        return true
      }
      return false
    }

    const files = []
    const directories = []

    // add updated selection data
    const recurse = (parent) => {
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
      directories
    }
  }

  @computed get isLoadingProject() {
    if (this.loadingProjectInfo && !this.loadingProjectInfo.done) {
      return true
    }
    if (this.loadingProjectRoot && !this.loadingProjectRoot.done) {
      return true
    }
    if (this.loadingMetadata && !this.loadingMetadata.done) {
      return true
    }
    return false
  }

  @computed get loadingProjectError() {
    if (this.loadingProjectInfo && this.loadingProjectInfo.error) {
      return this.loadingProjectInfo.error
    }
    if (this.loadingProjectRoot && this.loadingProjectRoot.error) {
      return this.loadingProjectRoot.error
    }
    if (this.loadingMetadata && this.loadingMetadata.error) {
      return this.loadingMetadata.error
    }
    return null
  }

  @action
  retry = async () => {
    if (this.loadingProjectInfo && this.loadingProjectInfo.error) {
      this.loadingProjectInfo = null
    }
    if (this.loadingProjectRoot && this.loadingProjectRoot.error) {
      this.loadingProjectRoot = null
    }
    if (this.loadingMetadata && this.loadingMetadata.error) {
      this.loadingMetadata = null
    }

    const { original } = this.Qvain
    if (original) {
      await Promise.all([this.loadProjectInfo(original), this.loadMetadata(original)])
    }
    return this.loadProjectRoot()
  }

  actionsToMetax() {
    // Return addition/removal actions

    const actions = { directories: [], files: [] }
    const recurse = (item) => {
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
