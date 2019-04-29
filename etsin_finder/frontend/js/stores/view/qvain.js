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

  @observable _selectedFiles = []

  // Selected files AND directories
  @observable _selected = []

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
    if (this._selected.find(s => s.file_name === file.file_name) === undefined) {
      this._selected = [...this._selected, file]
    } else {
      this._selected = this._selected.filter(s => s.file_name !== file.file_name)
    }
  }

  @action toggleSelectedDirectory = (directory) => {
    if (this._selected.find(s => s.directory_name === directory.directory_name) === undefined) {
      this._selected = [...this._selected, directory]
    } else {
      this._selected = this._selected.filter(s => s.directory_name !== directory.directory_name)
    }
  }

  @action toggleSelected = (selected) => {
    if (this._selected.find(s => s.identifier === selected.identifier) === undefined) {
      this._selected = [...this._selected, selected]
    } else {
      this._selected = this._selected.filter(s => s.identifier !== selected.identifier)
    }
  }

  @action removeSelectedFile = (fileId) => {
    this._selectedFiles = this._selectedFiles.filter(sf => sf.id !== fileId)
  }

  @action setCurrentDirectory = (dir) => {
    this._currentDirectory = dir
  }

  @action getInitialDirectories = () => {
    this._userProjects.forEach(projectId => {
      axios
        .get(PROJECT_DIR_URL + projectId)
        .then(res => {
          this._currentDirectory = res.data
          this._directories = this._directories.concat(res.data.directories)
          this._files = this._files.concat(res.data.files)
          this._directories.forEach(dir => this._parentDirs.set(dir.id, dir.parent_directory.id))
        })
    })
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

  @action setInEdit = (storageItem) => {
    this._inEdit = storageItem
  }

  @computed
  get selectedFiles() {
    return this._selectedFiles
  }

  @computed
  get selected() {
    return this._selected
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
