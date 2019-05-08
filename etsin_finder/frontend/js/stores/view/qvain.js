import { observable, action, computed } from 'mobx'
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
      this._selectedDirectories.forEach(sd =>
        getDirectories(sd)
          .filter(d => d.identifier === file.parent_directory.identifier)
          .map(d => d.files.filter(f => f.file_name !== file.file_name))
      )
    } else {
      // otherwise remove
      this._selectedFiles = [...this._selectedFiles.filter(s => s.file_name !== file.file_name)]
    }
  }

  @action toggleSelectedDirectory = (dir, select) => {
    console.log('toggleSelectedDirectory, dir, select', { dir, select })
    if (select) {
      // FIXME: somehow deep copy the entire dir tree
      // even if we copy the dir, the directories and files within will still be referring to their original instances
      // the moment we deselect them from the UI, thus removing them from the dir, the elements will be gone from
      // the hierarchy object, which is used to render the file selector itself
      // const copy = JSON.parse(JSON.stringify(dir))
      const copy = deepCopy(dir)
      this._selectedDirectories = [...this._selectedDirectories, copy]
      this.addDirs(copy)
    } else {
      const root = this._selectedDirectories.find(sd => sd.directory_name === dir.directory_name)
      // we are removing the root selected directory, not one of the subdirectories belonging
      // to one of the selected directories
      if (root !== undefined) {
        this._selectedDirectories = this._selectedDirectories.filter(sd => sd.directory_name !== dir.directory_name)
      } else {
        // we are removing one of the subdirectories
        // this is the selected directory, the highest level directory of the one we are
        // removing
        const theSelectedDirs = this._selectedDirectories.filter(sd =>
          getDirectories(sd).map(d => d.directory_name).includes(dir.directory_name)
        )
        console.log(theSelectedDirs)
        theSelectedDirs.forEach(sd => {
          const dirs = getDirectories(sd)
          const theDir = dirs.find(d => d.directory_name === dir.directory_name)
          theDir.files = undefined
          theDir.directories = undefined

          const parent = dirs.find(d => d.identifier === theDir.parent_directory.identifier)
          console.log('parent, ', parent)
          parent.directories = [...parent.directories.filter(d => d.directory_name !== theDir.directory_name)]
        })
        // deselect the individually selected files within the directory
        if (theSelectedDirs.length === 0) {
          this._selectedFiles = [...this._selectedFiles.filter(sf => sf.parent_directory.identifier !== dir.identifier)]
        }
      }
    }
  }

  @action addDirs = (dir) => {
    axios
      .get(DIR_URL + dir.id)
      .then(res => {
        const { files, directories } = res.data
        dir.files = files
        dir.directories = directories
        dir.directories.forEach(d => this.addDirs(d))
      })
  }

  @action removeSelectedFile = (fileId) => {
    this._selectedFiles = this._selectedFiles.filter(sf => sf.id !== fileId)
  }

  @action getInitialDirectories = () => {
    axios
      .get(PROJECT_DIR_URL + this._selectedProject)
      .then(res => {
        // this._directories = res.data.directories
        // this._files = res.data.files
        // this._directories.forEach(dir => this._parentDirs.set(dir.id, dir.parent_directory.id))
        this._hierarchy = res.data
        console.log(res.data)
      })
      .catch(e => {
        console.log('Failed to acquire project root directory, error: ', e.message)
      })
  }

  @action changeProject = (projectId) => {
    this._selectedProject = projectId
    this.getInitialDirectories()
  }

  @action loadDirectory = (dirId, rootDir) => {
    axios
      .get(DIR_URL + dirId)
      .then(res => {
        const dir = rootDir.directories.find(d => d.id === dirId)
        const { files, directories } = res.data
        dir.files = files
        dir.directories = directories
        dir.open = true
      })
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

export default new Qvain()
