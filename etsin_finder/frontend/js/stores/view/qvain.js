import { observable, action, computed } from 'mobx'
import axios from 'axios'

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

  // directory currently in the view (modal)
  @observable _currentDirectory = []

  // acquired directories parent directories' ids
  @observable _parentDirs = new Map()

  // files in the view
  @observable _files = []

  // directories in the view
  @observable _directories = []

  // directories visited, used to go up the directory hierarchy
  @observable _previousDirectories = new Map()

  @action toggleSelectedFile = (file) => {
    if (this._selectedFiles.find(s => s.file_name === file.file_name) === undefined) {
      this._selectedFiles = [...this._selectedFiles, file]
    } else {
      this._selectedFiles = this._selectedFiles.filter(s => s.file_name !== file.file_name)
    }
  }

  @action toggleSelectedDirectory = (dir, select) => {
    if (select) {
      this._selectedDirectories = [...this._selectedDirectories, dir]
      this.addDirs(dir, select)
    } else {
      this._selectedDirectories = this._selectedDirectories.filter(sd => sd.directory_name !== dir.directory_name)
    }
  }

  @action addDirs = (dir, select) => {
    axios
      .get(DIR_URL + dir.id)
      .then(res => {
        const { files, directories } = res.data
        dir.files = files
        dir.directories = directories
        dir.directories.forEach(d => this.addDirs(d, select))
      })
  }

  @action removeSelectedFile = (fileId) => {
    this._selectedFiles = this._selectedFiles.filter(sf => sf.id !== fileId)
  }

  @action setCurrentDirectory = (dir) => {
    this._currentDirectory = dir
  }

  @action getInitialDirectories = () => {
    axios
      .get(PROJECT_DIR_URL + this._selectedProject)
      .then(res => {
        this._directories = res.data.directories
        this._files = res.data.files
        this._directories.forEach(dir => this._parentDirs.set(dir.id, dir.parent_directory.id))
        this._hierarchy = res.data
        console.log(res.data)
        this._currentDirectory = this._hierarchy
      })
      .catch(e => {
        console.log('Failed to acquire project root directory, error: ', e.message)
      })
  }

  @action changeProject = (projectId) => {
    this._selectedProject = projectId
    this.getInitialDirectories()
  }

  @action changeDirectory = (dirId) => {
    axios
      .get(DIR_URL + dirId)
      .then(res => {
        this._previousDirectories.set(this._currentDirectory.id, this._currentDirectory)
        this._currentDirectory = this._directories.find(dir => dir.id === dirId) ||
          this._previousDirectories.get(dirId)
        const { files, directories } = res.data
        this._directories = directories
        this._directories.forEach(dir => this._parentDirs.set(dir.id, dir.parent_directory.id))
        this._files = files
      })
  }

  @action openDirectory = (dirId, rootDir) => {
    axios
      .get(DIR_URL + dirId)
      .then(res => {
        const dir = rootDir.directories.find(d => d.id === dirId)
        const { files, directories } = res.data
        dir.files = files
        dir.directories = directories
      })
  }

  @action setInEdit = (storageItem) => {
    this._inEdit = storageItem
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
  get currentDirectory() {
    return this._currentDirectory
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

export default new Qvain()
