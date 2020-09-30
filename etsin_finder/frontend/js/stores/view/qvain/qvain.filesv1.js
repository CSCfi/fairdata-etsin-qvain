import { observable, action, computed, runInAction } from 'mobx'
import axios from 'axios'
import { getDirectories, getFiles, deepCopy } from '../../../components/qvain/utils/fileHierarchy'
import urls from '../../../components/qvain/utils/urls'
import { USE_CATEGORY_URL } from '../../../utils/constants'
import { getPath } from '../../../components/qvain/utils/object'

class FilesV1 {
  @observable idaPickerOpen = false

  @observable selectedProject = undefined

  @observable selectedFiles = []

  @observable selectedDirectories = []

  @observable existingFiles = []

  @observable existingDirectories = []

  @observable hierarchy = {}

  @action resetFilesV1 = () => {
    this.idaPickerOpen = false
    this.selectedProject = undefined
    this.selectedFiles = []
    this.selectedDirectories = []
    this.existingFiles = []
    this.existingDirectories = []
    this.hierarchy = {}
  }

  @action fromBackendFilesV1 = dataset => {
    // Load files
    const dsFiles = dataset.files
    const dsDirectories = dataset.directories

    if (dsFiles !== undefined || dsDirectories !== undefined) {
      this.idaPickerOpen = true
      // Find out the dataset IDA project by iterating through files/directories
      const toCheck = [...(dsFiles || []), ...(dsDirectories || [])]
      for (let i = 0; i < toCheck.length; i += 1) {
        // Get project identifier from item.details
        if (toCheck[i].details) {
          this.selectedProject = toCheck[i].details.project_identifier
          break
        }
      }
      if (this.selectedProject) {
        this.getInitialDirectories()
      }
      this.existingDirectories = dsDirectories
        ? dsDirectories.map(d => {
            // Removed directories don't have details
            if (!d.details) {
              d.details = {
                directory_name: d.title,
                file_path: '',
                removed: true,
              }
            }
            return DatasetDirectory(d)
          })
        : []
      this.existingFiles = dsFiles
        ? dsFiles.map(f => {
            // Removed files don't have details
            if (!f.details) {
              f.details = {
                file_name: f.title,
                file_path: '',
                removed: true,
              }
            }
            return DatasetFile(f, undefined, true)
          })
        : []
    }
  }

  @action toggleSelectedFile = (file, select) => {
    // are we removing an old selected file or are we editing the selections in the current session
    if (file.existing && !select) {
      this.existingFiles = this.existingFiles.filter(f => f.identifier !== file.identifier)
    } else {
      const newHier = { ...this.hierarchy }
      const flat = getDirectories(newHier)
      // file.selected = select
      getFiles(newHier).find(f => f.identifier === file.identifier).selected = select
      if (select) {
        const theDir = flat.find(d => d.identifier === file.parentDirectory.identifier)
        this.deselectParents(theDir, flat)
        this.selectedFiles = [...this.selectedFiles, file]
      } else {
        this.selectedFiles = this.selectedFiles.filter(f => f.identifier !== file.identifier)
      }
      this.hierarchy = newHier
    }
    this.changed = true
  }

  @action toggleSelectedDirectory = (dir, select) => {
    // don't edit selected state in hierarchy if editing existing directories
    // otherwise do necessary edits to the hierarchy (to display the correct changes to file selector)
    if (dir.existing && !select) {
      this.existingDirectories = this.existingDirectories.filter(
        d => d.identifier !== dir.identifier
      )
    } else {
      const newHier = { ...this.hierarchy }
      const flat = getDirectories(newHier)
      const theDir = flat.find(d => d.directoryName === dir.directoryName)
      theDir.selected = select
      if (select) {
        // deselect and remove the files within the selected directory
        theDir.files.forEach(f => {
          f.selected = false
          this.selectedFiles = [
            ...this.selectedFiles.filter(file => file.identifier !== f.identifier),
          ]
        })
        // deselect directories and files downwards in the hierarchy, remove them from selections
        theDir.directories.forEach(d => this.deselectChildren(d))
        // deselect parents
        const parent = flat.find(d => d.identifier === theDir.parentDirectory.identifier)
        this.deselectParents(parent, flat)
        this.selectedDirectories = [...this.selectedDirectories, dir]
      } else {
        this.selectedDirectories = this.selectedDirectories.filter(
          d => d.identifier !== dir.identifier
        )
      }
      this.hierarchy = newHier
    }
    this.changed = true
  }

  // Move selected files and directories to existing.
  @action moveSelectedToExisting = () => {
    this.existingDirectories = this.mergeArraysByIdentifier(
      this.selectedDirectories,
      this.existingDirectories
    )
    this.selectedDirectories = []
    this.existingFiles = this.mergeArraysByIdentifier(this.selectedFiles, this.existingFiles)
    this.selectedFiles = []

    // deselect all items in hierarchy
    const newHier = deepCopy(this.hierarchy)
    getDirectories(newHier).forEach(dir => {
      dir.selected = false
    })
    getFiles(newHier).forEach(file => {
      file.selected = false
    })
    this.hierarchy = newHier
  }

  @action getInitialDirectories = () =>
    axios.get(urls.v1.projectFiles(this.selectedProject)).then(res => {
      runInAction(() => {
        this.hierarchy = Directory(res.data, undefined, false, false)
      })
      return this.hierarchy
    })

  @action changeProject = projectId => {
    this.selectedProject = projectId
    this.hierarchy = {}
    this.selectedFiles = []
    this.selectedDirectories = []
    return this.getInitialDirectories()
  }

  @action loadDirectory = (dirId, rootDir, callback) => {
    const req = axios
      .get(urls.v1.directoryFiles(dirId))
      .then(res => {
        const newDirs = [
          ...rootDir.directories.map(d => {
            if (d.id === dirId) {
              return {
                ...d,
                directories: res.data.directories.map(newDir =>
                  Directory(
                    newDir,
                    d,
                    this.selectedDirectories.map(sd => sd.identifier).includes(newDir.identifier),
                    false
                  )
                ),
                files: res.data.files.map(newFile =>
                  File(
                    newFile,
                    d,
                    this.selectedFiles.map(sf => sf.identifier).includes(newFile.identifier)
                  )
                ),
              }
            }
            return d
          }),
        ]
        rootDir.directories = newDirs
        return rootDir
      })
      .catch(e => {
        console.log(e)
      })
    if (callback) {
      req.then(callback)
    }
    return req
  }

  @action setDirFileSettings = (directory, title, description, useCategory) => {
    const collection = directory.existing ? this.existingDirectories : this.selectedDirectories
    const theDir = collection.find(d => d.identifier === directory.identifier)
    theDir.title = title
    theDir.description = description
    theDir.useCategory = useCategory
  }

  @action updateFileMetadata = file => {
    // After editing file metadata, update the file in the hierarchy if possible.
    // The input file comes from a Metax response so needs to be transformed into Qvain light format.
    const flat = getFiles(this.hierarchy)
    const hierarchyFile = flat.find(f => f.identifier === file.identifier)
    if (hierarchyFile) {
      Object.assign(
        hierarchyFile,
        File(file, hierarchyFile.parentDirectory, hierarchyFile.selected)
      )
    }

    // Update existing file if available.
    const existingFile = this.existingFiles.find(f => f.identifier === file.identifier)
    if (existingFile) {
      const parsed = File(file, existingFile.parentDirectory, existingFile.selected)
      const newMetadata = {
        fileFormat: parsed.fileFormat,
        formatVersion: parsed.formatVersion,
        encoding: parsed.encoding,
        csvHasHeader: parsed.csvHasHeader,
        csvDelimiter: parsed.csvDelimiter,
        csvRecordSeparator: parsed.csvRecordSeparator,
        csvQuotingChar: parsed.csvQuotingChar,
      }
      Object.assign(existingFile, newMetadata)
    }
  }

  @computed
  get getSelectedFiles() {
    return this.selectedFiles
  }

  @computed
  get getSelectedDirectories() {
    return this.selectedDirectories
  }

  @computed
  get getExistingFiles() {
    return this.existingFiles
  }

  @computed
  get getExistingDirectories() {
    return this.existingDirectories
  }

  @computed
  get getHierarchy() {
    return this.hierarchy
  }

  deselectChildren = dir => {
    dir.selected = false
    this.selectedDirectories = [
      ...this.selectedDirectories.filter(d => d.identifier !== dir.identifier),
    ]
    dir.files.forEach(f => {
      f.selected = false
      this.selectedFiles = [...this.selectedFiles.filter(file => file.identifier !== f.identifier)]
    })
    dir.directories.forEach(d => this.deselectChildren(d))
    this.changed = true
  }

  deselectParents = (dir, flattenedHierarchy) => {
    // deselect directories upwards in the hierarchy, remove them from selected directories
    if (dir !== undefined) {
      dir.selected = false
      this.selectedDirectories = [
        ...this.selectedDirectories.filter(d => d.identifier !== dir.identifier),
      ]
      if (dir.parentDirectory !== undefined) {
        const aDir = flattenedHierarchy.find(d => d.identifier === dir.parentDirectory.identifier)
        if (aDir !== undefined) {
          this.deselectParents(aDir, flattenedHierarchy)
        }
      }
    }
    this.changed = true
  }
}

const Hierarchy = (h, parent, selected) => ({
  original: h,
  identifier: h.identifier,
  projectIdentifier: h.project_identifier,
  id: h.id,
  parentDirectory: parent,
  selected,
})

export const Directory = (dir, parent, selected, open) => ({
  ...Hierarchy(dir, parent, selected),
  open,
  loaded: !!dir.directories,
  directoryName: dir.directory_name,
  directories: dir.directories ? dir.directories.map(d => Directory(d, dir, false, false)) : [],
  useCategory: dir.use_category || USE_CATEGORY_URL.OUTCOME_MATERIAL,
  fileType: dir.file_type,
  files: dir.files ? dir.files.map(f => File(f, dir, false)) : [],
  description: dir.description || 'Folder',
  title: dir.title || dir.directory_name,
  existing: false,
  removed: dir.removed,
  fileCount: dir.file_count,
})

export const File = (file, parent, selected) => ({
  ...Hierarchy(file, parent, selected),
  fileName: file.file_name,
  filePath: file.file_path,
  useCategory:
    getPath('file_characteristics.use_category', file) || USE_CATEGORY_URL.OUTCOME_MATERIAL,
  fileType: getPath('file_characteristics.file_type', file),
  description: getPath('file_characteristics.description', file) || 'File',
  title: getPath('file_characteristics.title', file) || file.file_name,
  existing: false,
  removed: file.removed,

  // PAS metadata
  fileFormat: getPath('file_characteristics.file_format', file),
  formatVersion: getPath('file_characteristics.format_version', file),
  encoding: getPath('file_characteristics.encoding', file),
  csvHasHeader: getPath('file_characteristics.csv_has_header', file),
  csvDelimiter: getPath('file_characteristics.csv_delimiter', file),
  csvRecordSeparator: getPath('file_characteristics.csv_record_separator', file),
  csvQuotingChar: getPath('file_characteristics.csv_quoting_char', file),
})

export const DatasetFile = file => ({
  ...File(file.details, file.details.parent_directory, true),
  identifier: file.identifier,
  useCategory: getPath('use_category.identifier', file),
  fileType: getPath('file_type.identifier', file),
  projectIdentifier: getPath('details.project_identifier', file),
  title: file.title,
  description: file.description || getPath('details.file_characteristics.description', file),
  fileCharacteristics: {
    ...file.details.file_characteristics,
    useCategory: file.use_category,
    fileType: file.file_type,
    title: file.title,
  },
  existing: true,
})

const DatasetDirectory = directory => ({
  ...Directory(directory.details, undefined, true, false),
  identifier: directory.identifier,
  description: directory.description,
  title: directory.title,
  useCategory: directory.use_category.identifier,
  existing: true,
})

export default FilesV1
