import { observable, action, computed } from 'mobx'
import axios from 'axios'
import { getDirectories } from '../../components/qvain/utils/fileHierarchy'

const DIR_URL = '/api/files/directory/'
const PROJECT_DIR_URL = '/api/files/project/'

class Qvain {
  @observable title = {
    en: '',
    fi: ''
  }

  @observable description = {
    en: '',
    fi: ''
  }

  @observable otherIdentifiers = []

  @observable fieldOfScience = undefined

  @observable keywords = []

  @observable license = {}

  @observable accessType = {}

  @observable participants = []

  @observable participantInEdit = EmptyParticipant

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
    if (participant.uiId !== undefined) {
      // we are saving a participant that was previously added
      const existing = this.participants.find((addedParticipant) => (addedParticipant.uiId === participant.uiId))
      if (existing !== undefined) {
        this.removeParticipant(participant)
      }
    } else {
      // we are adding a new participant, generate a new UI ID for them
      participant.uiId = this.createParticipantUIId()
    }
    this.setParticipants(
      [...this.participants, participant]
    )
  }

  @action
  removeParticipant = (participant) => {
    const participants = this.participants.filter((p) => p.uiId !== participant.uiId)
    this.setParticipants(participants)
  }

  @action
  editParticipant = (participant) => {
    this.participantInEdit = participant
  }

  @computed
  get addedParticipants() {
    return this.participants
  }

  @computed
  get getParticipantInEdit() {
    return this.participantInEdit
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
    const newHier = { ...this._hierarchy }
    const flat = getDirectories(newHier)
    file.selected = select
    if (select) {
      const deselectDir = (dir) => {
        dir.selected = false
        if (dir.parentDirectory !== undefined) {
          const aDir = flat.find(d => d.directoryName === dir.parentDirectory.directoryName)
          if (aDir !== undefined) {
            deselectDir(aDir)
          }
        }
      }
      const theDir = flat.find(d => d.directoryName === file.parentDirectory.directoryName)
      deselectDir(theDir)
    }
    this._hierarchy = newHier
  }

  @action toggleSelectedDirectory = (dir, select) => {
    const newHier = { ...this._hierarchy }
    const flat = getDirectories(newHier)
    const theDir = flat.find(d => d.directoryName === dir.directoryName)
    theDir.selected = select
    if (select) {
      theDir.files.forEach(f => {
        f.selected = false
      })
      const deselectOthers = (aDir) => {
        aDir.selected = false
        aDir.files.forEach(f => {
          f.selected = false
        })
        aDir.directories.forEach(d => deselectOthers(d))
      }
      theDir.directories.forEach(d => deselectOthers(d))
    }
    this._hierarchy = newHier
  }

  @action getInitialDirectories = () => (
    axios
      .get(PROJECT_DIR_URL + this._selectedProject)
      .then(res => {
        this._hierarchy = Directory(res.data, undefined, false, false)
        return this._hierarchy
      })
      .catch(e => {
        console.log('Failed to acquire project root directory, error: ', e)
      })
  )

  @action changeProject = (projectId) => {
    this._selectedProject = projectId
    return this.getInitialDirectories()
  }

  @action loadDirectory = (dirId, rootDir, callback) => {
    const req = axios
      .get(DIR_URL + dirId)
      .then(res => {
        const newDirs = [...rootDir.directories.map(d => (
          d.id === dirId ? {
            ...d,
            directories: res.data.directories.map(newDir => Directory(
              newDir,
              d,
              false,
              false
            )),
            files: res.data.files.map(newFile => File(
              newFile,
              d,
              false
            )),
          } : d
        ))]
        rootDir.directories = newDirs
      })
    if (callback) {
      req.then(callback)
    }
  }

  @action setDirFileSettings = (directory, useCategory, fileType) => {
    const newHier = { ...this._hierarchy }
    const theDir = getDirectories(newHier).find(d => d.directoryName === directory.directoryName)
    theDir.fileCharacteristics = {
      useCategory,
      fileType
    }
    this._hierarchy = newHier
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

  // Dataset related

  // dataset - METAX dataset JSON
  // perform schema transformation METAX JSON -> etsin backend / internal schema
  @action editDataset = (dataset) => {
    const researchDataset = dataset.research_dataset

    // Load description
    this.title = researchDataset.title
    this.description = researchDataset.description

    // Other identifiers
    this.otherIdentifiers = researchDataset.other_identifier ?
      researchDataset.other_identifier.map(oid => oid.notation) : []

    // field of science
    const fieldOfScience = researchDataset.field_of_science[0]
    this.fieldOfScience = fieldOfScience ? FieldOfScience(fieldOfScience.pref_label, fieldOfScience.identifier) : undefined

    // Load participants
    let participants = []
    participants = [...participants, ...this.createParticipants(participants, researchDataset.creator || [], Role.CREATOR)]
    participants = [...participants, ...this.createParticipants(participants, researchDataset.publisher || [], Role.PUBLISHER)]
    participants = [...participants, ...this.createParticipants(participants, researchDataset.curator || [], Role.CURATOR)]
    this.participants = participants

    // Load files
  }

  createParticipants = (existing, toAdd, role) => {
    let added = []
    if (toAdd.length > 0) {
      added = [...toAdd.map(participant =>
        this.createParticipant(participant, role, existing)
      )]
    }
    return added
  }

  createParticipant = (participantJson, role, participants) => Participant(
    participantJson['@type'].toLowerCase() === EntityType.PERSON ?
      EntityType.PERSON : EntityType.ORGANIZATION,
    [role],
    participantJson['@type'].toLowerCase() === EntityType.ORGANIZATION ?
      participantJson.name.en : participantJson.name,
    participantJson.email,
    participantJson.identifier,
    participantJson['@type'].toLowerCase() === EntityType.ORGANIZATION ?
      participantJson.is_part_of.name.en : participantJson.member_of.name.en,
    this.createParticipantUIId(participants)
  )

  // create a new UI Identifier based on existing UI IDs
  // basically a simple number increment
  // use the store participants by default
  createParticipantUIId = (participants = this.participants) => {
    const latestId = participants.length > 0 ? Math.max(...participants.map(p => p.uiId)) : 0
    return latestId + 1
  }
}

const Hierarchy = (h, parent, selected) => ({
  original: h,
  identifier: h.identifier,
  projectIdentifier: h.project_identifier,
  id: h.id,
  parentDirectory: parent,
  selected
})

export const Directory = (dir, parent, selected, open) => ({
  ...Hierarchy(dir, parent, selected),
  open,
  directoryName: dir.directory_name,
  directories: dir.directories ? dir.directories.map(d => Directory(d, dir, false, false)) : [],
  files: dir.files ? dir.files.map(f => File(f, dir, false)) : []
})

const File = (file, parent, selected) => ({
  ...Hierarchy(file, parent, selected),
  fileName: file.file_name,
  filePath: file.file_path,
  fileCharacteristics: {
    ...file.file_characteristics,
    useCategory: file.file_characteristics.use_category,
    fileType: file.file_characteristics.file_type
  }
})

export const EntityType = {
  PERSON: 'person',
  ORGANIZATION: 'organization'
}

export const Role = {
  CREATOR: 'creator',
  PUBLISHER: 'publisher',
  CURATOR: 'curator'
}

export const Participant = (entityType, roles, name, email, identifier, organization, uiId) => ({
  type: entityType,
  role: roles,
  name,
  email,
  identifier,
  organization,
  uiId
})

export const EmptyParticipant = Participant(
  undefined,
  [],
  '',
  '',
  '',
  '',
  undefined
)

export const FieldOfScience = (name, url) => ({
  name,
  url
})

export default new Qvain()
