import axios from 'axios'
import { observable, action, runInAction, when } from 'mobx'

import { FileAPIURLs, UseCategoryURLs } from '../../components/qvain/utils/constants'

// Create prefixed keys from file/directory identifiers. Makes it possible to have
// files and directories in the same array without risk of key conflicts.
const dirKey = (dir) => `dir:${dir.identifier}`
const fileKey = (file) => `file:${file.identifier}`
const dirKeyRegExp = new RegExp('^dir:')
const fileKeyRegExp = new RegExp('^file:')
const isDirKey = (key) => dirKeyRegExp.test(key)
const isFileKey = (key) => fileKeyRegExp.test(key)

// Sorting helper for natural sorting of file/directory names.
const sortOpts = { numeric: true, sensitivity: 'base' }
const sortFunc = (a, b) => a.localeCompare(b, undefined, sortOpts)

// properties common to directories and files
const Item = (metaxItem) => ({
  identifier: metaxItem.identifier,
  key: null,
  projectIdentifier: metaxItem.project_identifier,
  title: metaxItem.title,
  description: metaxItem.description,
  useCategory: metaxItem.use_category && metaxItem.use_category.identifier,
  parent: null,
  path: null,

  added: false,
  selected: false,
  removed: false,
  existing: false,
  error: false,
})

export const Directory = (metaxDir, args) => ({
  ...Item(metaxDir),
  key: dirKey(metaxDir),
  title: metaxDir.directory_name,
  directoryName: metaxDir.directory_name,
  path: metaxDir.directory_path,
  fileCount: metaxDir.file_count,
  existingFileCount: 0,
  addedChildCount: 0,
  removedChildCount: 0,
  selectedChildCount: 0,
  loaded: false,
  loading: false,
  type: 'directory',
  directories: [],
  files: [],
  ...args,
})

// PAS metadata is updated separately using an RPC call.
export const getPASMeta = (metaxFile) => {
  const characteristics = metaxFile.file_characteristics || {}
  // PAS metadata
  return Object.fromEntries(Object.entries({
    fileFormat: characteristics.file_format,
    formatVersion: characteristics.format_version,
    encoding: characteristics.encoding,
    csvDelimiter: characteristics.csv_delimiter,
    csvRecordSeparator: characteristics.csv_record_separator,
    csvQuotingChar: characteristics.csv_quoting_char,
    csvHasHeader: characteristics.csv_has_header,
  }).filter((([, value]) => value !== undefined)))
}

export const File = (metaxFile, args) => ({
  ...Item(metaxFile),
  key: fileKey(metaxFile),
  title: metaxFile.file_name,
  fileName: metaxFile.file_name,
  path: metaxFile.file_path,
  type: 'file',
  pasMeta: getPASMeta(metaxFile),
  ...args
})

// Project root, similar to a directory but cannot be added/removed or opened/closed.
export const Project = (projectIdentifier, identifier, args) => ({
  projectIdentifier,
  identifier,
  directories: [],
  files: [],
  loading: false,
  type: 'project',
  addedChildCount: 0,
  removedChildCount: 0,
  selectedChildCount: 0,
  ...args
})

class DirectoryView {
  // Handles per-view state of the directory hierarchy. Responsible for state:
  // - Is a directory open?
  // - Has an item been checked (=selected in the view)?
  // - Are all items in directory shown, or only items up to showLimit?

  constructor(Files) {
    this.Files = Files
  }

  @action reset() {
    this.openState = {}
    this.showAllState = {}
    this.checkedState = {}
    this.showLimit = 20
    this.showLimitMargin = 1
  }

  // Opening/closing directories

  @observable openState = {}

  isOpen = (dir) => (
    !!(this.openState[dir.key] || dir.type === 'project')
  )

  @action open = async (dir) => {
    if (!this.openState[dir.key] && !dir.loaded) {
      if (!await this.Files.loadDirectory(dir)) {
        return false
      }
    }
    runInAction(() => {
      this.openState[dir.key] = true
    })
    return true
  }

  @action close = (dir) => {
    this.openState[dir.key] = false
  }

  @action toggleOpen = async (dir) => {
    if (!this.openState[dir.key]) {
      await this.open(dir)
    } else {
      this.close(dir)
    }
  }

  @action setAllOpen = async (newState) => {
    const setChildrenOpen = async (dir) => (
      Promise.all(dir.directories.map(async d => {
        if (d.type === 'directory') {
          if (newState) {
            if (!await this.open(d)) {
              return false
            }
          } else {
            this.close(d)
          }
        }
        return setChildrenOpen(d)
      }))
    )
    await setChildrenOpen(this.Files.root)
  }

  // Show only up to showLimit items, or all items?

  @observable showAllState = {}

  @observable showLimit = 20 // how many items to show

  @observable showLimitMargin = 1

  isShowAll(dir) {
    return !!this.showAllState[dir.key]
  }

  @action toggleShowAll = async (dir) => {
    this.showAllState[dir.key] = !this.showAllState[dir.key]
  }

  @action setShowLimit = async (limit, margin) => {
    this.showLimit = limit
    this.showLimitMargin = margin || 0
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
    const recurse = (parent) => {
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

  @action toggleChecked = (item) => {
    this.checkedState[item.key] = !this.checkedState[item.key]
  }

  @action clearChecked = () => {
    this.checkedState = {}
  }
}

const ignoreNotFound = async (func, defaultResponse) => {
  // Return defaultResponse instead of throwing a 404 error.
  try {
    return await func()
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return defaultResponse
    }
    throw err
  }
}

class ChildItemCounter {
  // Helper class for counting child items based on paths without
  // having to load the entire directory hierarchy.
  @observable root = { directories: {}, count: 0 }

  @action inc(path) {
    // add child
    const parts = path.split('/')
    let dir = this.root
    dir.count += 1
    for (let i = 1; i < parts.length - 1; i += 1) {
      const part = parts[i]
      if (!dir.directories[part]) {
        dir.directories[part] = { directories: {}, count: 0 }
      }
      dir = dir.directories[part]
      dir.count += 1
    }
  }

  count(path) {
    // count children
    const parts = path.split('/')
    let dir = this.root
    for (let i = 1; i < parts.length; i += 1) {
      const part = parts[i]
      dir = dir.directories[part]
      if (!dir) {
        return 0
      }
    }
    return dir.count
  }
}

class Files {
  constructor(Qvain) {
    this.Qvain = Qvain
    this.SelectedItemsView = new DirectoryView(this)
    this.AddItemsView = new DirectoryView(this)
    this.reset()
  }

  @observable root = null

  @observable selectedProject = undefined

  @observable selectedExistingMetadata = {}

  @observable selectedExistingCounter = null

  @observable refreshModalDirectory = undefined

  @observable loadingProject = null

  @observable inEdit = undefined

  @action reset = () => {
    this.root = null
    this.selectedProject = undefined
    this.selectedExistingMetadata = {}
    this.selectedExistingCounter = new ChildItemCounter()
    this.SelectedItemsView.reset()
    this.AddItemsView.reset()
    this.refreshModalDirectory = null
    this.inEdit = undefined
  }

  @action setRefreshModalDirectory = (identifier) => {
    this.refreshModalDirectory = identifier
  }

  @action editDataset = dataset => {
    this.reset()
    const researchDataset = dataset.research_dataset

    // Load metadata for files and directories selected in the dataset.
    const dsFiles = researchDataset.files || []
    const dsDirectories = researchDataset.directories || []
    if (dsFiles.length > 0 || dsDirectories.length > 0) {
      const items = [...dsFiles, ...dsDirectories]
      this.selectedProject = items.length > 0 ? items[0].details.project_identifier : undefined

      dsFiles.forEach(file => {
        this.selectedExistingMetadata[fileKey(file)] = {
          identifier: file.identifier,
          title: file.title,
          description: file.description,
          useCategory: file.use_category && file.use_category.identifier,
          fileType: file.file_type && file.file_type.identifier,
        }
        if (file.details) {
          this.selectedExistingCounter.inc(file.details.file_path)
          this.selectedExistingMetadata[fileKey(file)].projectIdentifier = file.details.project_identifier
        }
      })

      dsDirectories.forEach(dir => {
        this.selectedExistingMetadata[dirKey(dir)] = {
          identifier: dir.identifier,
          title: dir.title,
          description: dir.description,
          useCategory: dir.use_category && dir.use_category.identifier
        }
        if (dir.details) {
          this.selectedExistingCounter.inc(dir.details.directory_path)
          this.selectedExistingMetadata[dirKey(dir)].projectIdentifier = dir.details.project_identifier
        }
      })
    }
    return this.loadProject()
  }

  @action joinChildItems = (parent, metaxData, existingMap) => {
    // Join data for files/directories from multiple sources:
    // - metaxData: Files/directories contained by a directory.
    // - existingMap: Files/directories that exist in the dataset.
    // - this.selectedExistingMetadata: Selected files/directories and their metadata saved with a dataset.

    // sort items by name using natural ordering
    const dirs = metaxData.directories.sort((a, b) => sortFunc(a.directory_name, b.directory_name))
    const files = metaxData.files.sort((a, b) => sortFunc(a.file_name, b.file_name))

    // add dirs
    parent.directories.splice(0, 0, ...dirs.map(newDir => {
      const key = dirKey(newDir)
      return observable(Directory(newDir, {
        parent,
        selected: !!this.selectedExistingMetadata[key],
        existing: !!existingMap[key],
        existingFileCount: (existingMap[key] || {}).file_count || 0,
        selectedChildCount: this.selectedExistingCounter.count(newDir.directory_path),
        ...this.selectedExistingMetadata[key]
      }))
    }))

    // add files
    parent.files.splice(0, 0, ...files.map(newFile => {
      const key = fileKey(newFile)
      return observable(File(newFile, {
        parent,
        selected: !!this.selectedExistingMetadata[key],
        existing: !!existingMap[key],
        ...this.selectedExistingMetadata[key]
      }))
    }))
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

  @action loadDirectory = async (dir) => {
    // Get directory data from Metax.
    // - data contains items in the directory { files: [...], directories: [...] }
    // - existingMap contains items in the published dataset { [identifier]: item }
    // For optimization, uses parallel requests.
    if (dir.loading || dir.loaded) {
      await when(() => !dir.loading)
      return dir.loaded
    }
    dir.loading = true
    const identifier = dir.identifier
    const resp = axios.get(FileAPIURLs.DIR_URL + identifier)
    const existingMap = ignoreNotFound(() => this.getExisting(dir, identifier), {})
    this.joinChildItems(dir, (await resp).data, await existingMap)

    runInAction(() => {
      dir.loading = false
      dir.loaded = true
    })
    return true
  }

  @action changeProject = projectId => {
    this.selectedProject = projectId
    this.AddItemsView.reset()
    this.SelectedItemsView.reset()
    return this.loadProject()
  }

  getExisting = async (dir, directoryIdentifier) => {
    const { original } = this.Qvain

    // If the parent directory doesn't exist in the published dataset, the children won't exist either
    if (dir && dir.type === 'directory' && !dir.existing) {
      return {}
    }

    const existingMap = {}
    if (original && Object.values(this.selectedExistingMetadata).length > 0) {
      const { data: existing } = await axios.get(`${FileAPIURLs.DATASET_DIR_URL}${original.identifier}?dir_id=${directoryIdentifier}`)
      existing.files.forEach(item => { existingMap[fileKey(item)] = item })
      existing.directories.forEach(item => { existingMap[dirKey(item)] = item })
    }
    return existingMap
  }

  @action loadProject = async () => {
    const alreadyLoading = this.loadingProject && this.loadingProject.identifier === this.selectedProject
    if (alreadyLoading || (this.root && this.root.projectIdentifier === this.selectedProject)) {
      return
    }

    this.root = null
    if (!this.selectedProject) {
      return
    }
    if (this.loadingProject && !this.loadingProject.error) {
      this.loadingProject.promise.cancel()
    }

    const fetchRoot = async (projectIdentifier) => {
      const { data } = await axios.get(FileAPIURLs.PROJECT_DIR_URL + projectIdentifier)
      const firstItem = [].concat(data.directories, data.files)[0]
      if (!firstItem) {
        return null // Project has no files or directories
      }

      const rootIdentifier = firstItem.parent_directory.identifier
      const root = observable(Project(projectIdentifier, rootIdentifier, {
        selectedChildCount: this.selectedExistingCounter.count('')
      }))
      const existingMap = await this.getExisting(null, rootIdentifier)
      this.joinChildItems(root, data, existingMap)

      return root
    }

    try {
      this.loadingProject = {
        identifier: this.selectedProject,
        promise: fetchRoot(this.selectedProject),
        error: null,
      }
      const root = await this.loadingProject.promise
      runInAction(() => {
        this.root = root
        this.loadingProject = null
      })
    } catch (error) {
      runInAction(() => {
        this.loadingProject.error = error
      })
    }
  }

  @action updateSelectedChildCount(item, inc) {
    let { parent } = item
    while (parent) {
      parent.selectedChildCount += inc
      parent = parent.parent
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

  getItemByPath = async (path) => {
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
      dir = dir.directories.find(d => d.directoryName === part)
      if (dir && !dir.loaded) {
        // eslint-disable-next-line no-await-in-loop
        await this.loadDirectory(dir)
      }
      if (!dir) {
        const file = prevDir.files.find(f => f.fileName === part)
        return file
      }
      prevDir = dir
    }
    return dir
  }

  @action addItem(item) {
    if (item.added || item.selected) {
      return
    }
    if (item.removed) {
      this.updateRemovedChildCount(item, -1)
      this.updateSelectedChildCount(item, 1)
      item.selected = true
      item.removed = false
    } else {
      item.added = true
      this.updateAddedChildCount(item, 1)
    }
    this.Qvain.setChanged(true)
  }

  @action removeItem(item) {
    if (!item.added && !item.selected) {
      return
    }
    if (item.added) {
      this.updateAddedChildCount(item, -1)
      item.added = false
      item.selected = false
    } else if (item.selected) {
      this.updateRemovedChildCount(item, 1)
      this.updateSelectedChildCount(item, -1)
      item.selected = false
      item.removed = true
    }
    this.Qvain.setChanged(true)
  }

  @action applyInEdit = values => {
    this.inEdit.title = values.title
    this.inEdit.description = values.description
    this.inEdit.useCategory = values.useCategory

    let hasMetadata = false
    const inEdit = this.inEdit
    if (inEdit.type === 'file') {
      this.inEdit.fileType = values.fileType
      if (inEdit.description || inEdit.useCategory || inEdit.fileType || inEdit.title !== inEdit.fileName) {
        hasMetadata = true
      }
    } else if (inEdit.type === 'directory') {
      if (inEdit.description || inEdit.useCategory || inEdit.title !== inEdit.directoryName) {
        hasMetadata = true
      }
    }
    if (hasMetadata) {
      this.addItem(inEdit)
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

  toMetax = () => {
    const directoryToMetax = (dir) => ({
      identifier: dir.identifier,
      title: dir.title,
      description: dir.description ? dir.description : 'Folder',
      useCategory: {
        identifier: dir.useCategory || UseCategoryURLs.OUTCOME_MATERIAL
      },
      projectIdentifier: dir.projectIdentifier ? dir.projectIdentifier : undefined
    })

    const fileToMetax = (file) => ({
      identifier: file.identifier,
      title: file.title,
      description: file.description ? file.description : 'File',
      fileType: (file.fileType && {
        identifier: file.fileType,
      }) || undefined,
      useCategory: {
        identifier: file.useCategory || UseCategoryURLs.OUTCOME_MATERIAL
      },
      projectIdentifier: file.projectIdentifier ? file.projectIdentifier : undefined
    })

    const files = {}
    const directories = {}

    // add original selection data
    Object.entries(this.selectedExistingMetadata).forEach(([key, item]) => {
      const itemCopy = {
        ...item,
        useCategory: item.useCategory && { identifier: item.useCategory }
      }
      if (item.fileType) {
        itemCopy.fileType = { identifier: item.fileType }
      }
      delete itemCopy.details
      if (isDirKey(key)) {
        directories[item.identifier] = itemCopy
      } else if (isFileKey(key)) {
        files[item.identifier] = itemCopy
      }
    })

    // add updated selection data
    const recurse = (parent) => {
      if (parent.files) {
        parent.files.forEach(file => {
          if (file.selected || file.added) {
            files[file.identifier] = fileToMetax(file)
          } else if (file.removed) {
            delete files[file.identifier]
          }
        })
      }

      if (parent.directories) {
        parent.directories.forEach(dir => {
          if (dir.selected || dir.added) {
            directories[dir.identifier] = directoryToMetax(dir)
          } else if (dir.removed) {
            delete directories[dir.identifier]
          }
          recurse(dir)
        })
      }
    }
    if (this.root) {
      recurse(this.root)
    }
    return {
      files: Object.values(files),
      directories: Object.values(directories)
    }
  }
}

export default Files
