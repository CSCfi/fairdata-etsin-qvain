import { observable, action, computed, toJS } from 'mobx'
import axios from 'axios'
import { getDirectories, deepCopy } from '../../components/qvain/utils/fileHierarchy'

const DIR_URL = '/api/files/directory/'
const PROJECT_DIR_URL = '/api/files/project/'

class Qvain {
  @observable otherIdentifiers = []

  @observable fieldOfScience = {}

  @observable keywords = []

  @observable license = {}

  @observable accessType = {}

  @observable participants = []

  @action
  addOtherIdentifier = (identifier) => {
    this.otherIdentifiers = [...this.otherIdentifiers, identifier]
  }

  @action
  removeOtherIdentifier = (identifier) => {
    this.otherIdentifiers = this.otherIdentifiers.filter(otherIdentifier => otherIdentifier !== identifier);
  }

  @action
  setFieldOfScience = (fieldOfScience) => {
    this.fieldOfScience = fieldOfScience
  }

  @action
  setKeywords = (keywords) => {
    this.keywords = keywords
  }

  @action
  removeKeyword = (keyword) => {
    this.keywords = this.keywords.filter(word => word !== keyword);
  }

  @action
  setLicence = (license) => {
    this.license = license
  }

  @action
  setAccessType = (accessType) => {
    this.accessType = accessType
  }

  @action
  setParticipants = (participants) => {
    this.participants = participants
  }

  @action
  addParticipant = (participant) => {
    const existing = this.participants.find((addedParticipant) => (addedParticipant.identifier === participant.identifier))
    if (existing !== undefined) {
      this.removeParticipant(participant)
    }
    this.setParticipants(
      [...this.participants, participant]
    )
  }

  @action
  removeParticipant = (participant) => {
    const participants = this.participants.filter((p) => p.identifier !== participant.identifier)
    this.setParticipants(participants)
  }

  @computed
  get addedParticipants() {
    return this.participants
  }

  // FILE PICKER STATE MANAGEMENT

  @observable _userProjects = ['project_x']

  @observable _selectedProject = undefined

  @observable _selectedFiles = []

  // Selected files AND directories
  @observable _selected = []

  @observable _selectedDirectories = []

  @observable _hierarchy = {}

  @observable _inEdit = undefined

  // acquired directories parent directories' ids
  @observable _parentDirs = new Map()

  // files in the view
  @observable _files = []

  // directories in the view
  @observable _directories = []

  // directories visited, used to go up the directory hierarchy
  @observable _previousDirectories = new Map()

  @action toggleSelectedFile = (file, select) => {
    if (select && this._selectedFiles.find(s => s.file_name === file.file_name) === undefined) {
      // if we are selecting
      this._selectedFiles = [...this._selectedFiles, file]
    } else if (!select && this._selectedFiles.find(s => s.file_name === file.file_name) === undefined) {
      // if we are deselecting but there is no file in selected files
      // go through selected directories, find the file and filter it out
      this._selectedDirectories.forEach(sd => {
        const dirs = getDirectories(sd).filter(d => d.identifier === file.parent_directory.identifier)
        dirs.forEach(dir => {
          dir.files = [...dir.files.filter(f => f.file_name !== file.file_name)]
        })
        if (dirs.length === 0) {
          // debug. might be hard to find bugs in this logic since nothing here will break even
          // if it isn't working
          console.warn(`Couldn't find directory for file with file path ${file.file_path}`)
        }
      })
    } else {
      // otherwise remove
      this._selectedFiles = [...this._selectedFiles.filter(s => s.file_name !== file.file_name)]
    }
  }

  @action toggleSelectedDirectory = (dir, select) => {
    const newHier = { ...this._hierarchy }
    const flat = getDirectories(newHier)
    this.selectDirectory(flat.find(d => d.identifier === dir.identifier), select)
    this._hierarchy = newHier
  }

  selectDirectory = (dir, select, prev) => {
    dir.selected = select
    console.log('selectDirectory, dir ', toJS(dir))
    console.log()
    if (prev !== undefined && dir.directories.length === 0) {
      console.log('selectDirectory load more')
      this.loadDirectory(dir.id, prev, () => {
        console.log('this is the callback')
        dir.files.forEach(f => {
          f.selected = select
        })
        dir.directories.forEach(d => this.selectDirectory(d, select, dir))
      })
    } else {
      dir.files.forEach(f => {
        f.selected = select
      })
      dir.directories.forEach(d => this.selectDirectory(d, select, dir))
    }
  }

  findDir = (dir, dirs) => this.findDir(dirs.find(d => d.identifier === dir.identifier))

  checkDir = (dir, dirs) => {
    const toBeChecked = this.findDir(dir, dirs)
    toBeChecked.selected = true
    return toBeChecked
  }

  @action removeSelectedFile = (fileId) => {
    this._selectedFiles = this._selectedFiles.filter(sf => sf.id !== fileId)
  }

  @action getInitialDirectories = () => {
    axios
      .get(PROJECT_DIR_URL + this._selectedProject)
      .then(res => {
        console.log(res.data)
        this._hierarchy = Directory(res.data, false, false)
      })
      .catch(e => {
        console.log('Failed to acquire project root directory, error: ', e)
      })
  }

  @action changeProject = (projectId) => {
    this._selectedProject = projectId
    this.getInitialDirectories()
  }

  @action loadDirectory = (dirId, rootDir, callback) => {
    const req = axios
      .get(DIR_URL + dirId)
      .then(res => {
        const newDirs = [...rootDir.directories.map(d => (
          d.id === dirId ? {
            ...d,
            directories: res.data.directories.map(newDir => Directory(newDir, false, false)),
            files: res.data.files.map(newFile => File(newFile, false)),
          } : d
        ))]
        rootDir.directories = newDirs
      })
    if (callback) {
      req.then(callback)
    }
  }

  @action setInEdit = (selectedItem) => {
    this._inEdit = selectedItem
  }

  @computed
  get userProjects() {
    return this._userProjects
  }

  @computed
  get selectedProject() {
    return this._selectedProject
  }

  @computed
  get selectedFiles() {
    return this._selectedFiles
  }

  @computed
  get selectedDirectories() {
    return this._selectedDirectories
  }

  @computed
  get inEdit() {
    return this._inEdit
  }

  @computed
  get hierarchy() {
    return this._hierarchy
  }

  @computed
  get directories() {
    return this._directories
  }

  @computed
  get files() {
    return this._files
  }

  @computed
  get parentDirs() {
    return this._parentDirs
  }
}

const Hierarchy = (h, parent, selected) => ({
  original: h,
  identifier: h.identifier,
  projectIdentifier: h.project_identifier,
  id: h.id,
  parentDirectory: h.parent_directory,
  selected
})

const Directory = (dir, selected, open) => ({
  ...Hierarchy(dir, selected),
  open,
  directoryName: dir.directory_name,
  directories: dir.directories ? dir.directories.map(d => Directory(d, false, false)) : [],
  files: dir.files ? dir.files.map(f => File(f, false)) : []
})

const File = (file, selected) => ({
  ...Hierarchy(file, selected),
  fileName: file.file_name,
  filePath: file.file_path,
  fileCharacteristics: file.file_characteristics
})

export default new Qvain()
