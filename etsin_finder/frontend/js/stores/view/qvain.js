import { observable, action, computed } from 'mobx'
import axios from 'axios'
import { getDirectories, getFiles } from '../../components/qvain/utils/fileHierarchy'
import {
  AccessTypeURLs,
  LicenseUrls,
  FileAPIURLs,
  UseCategoryURLs,
} from '../../components/qvain/utils/constants'
import { getPath } from '../../components/qvain/utils/object'

class Qvain {
  @observable original = undefined // used if editing, otherwise undefined

  @observable title = {
    en: '',
    fi: '',
  }

  @observable description = {
    en: '',
    fi: '',
  }

  @observable otherIdentifiers = []

  @observable fieldOfScience = undefined

  @observable keywords = []

  @observable license = License(undefined, LicenseUrls.CCBY4)

  @observable otherLicenseUrl = undefined

  @observable accessType = AccessType(undefined, AccessTypeURLs.OPEN)

  @observable embargoExpDate = undefined

  @observable restrictionGrounds = {}

  @observable participants = []

  @observable participantInEdit = EmptyParticipant

  @observable externalResourceInEdit = EmptyExternalResource

  @action
  resetQvainStore = () => {
    this.title = {
      en: '',
      fi: '',
    }
    this.description = {
      en: '',
      fi: '',
    }
    this.otherIdentifiers = []
    this.fieldOfScience = undefined
    this.keywords = []
    this.license = License(undefined, LicenseUrls.CCBY4)
    this.otherLicenseUrl = undefined
    this.accessType = AccessType(undefined, AccessTypeURLs.OPEN)
    this.embargoExpDate = undefined
    this.restrictionGrounds = {}
    this.participants = []
    this.participantInEdit = EmptyParticipant
    // Reset Files/Directories related data
    this.idaPickerOpen = false
    this._selectedProject = undefined
    this._selectedFiles = []
    this._selectedDirectories = []
    this._hierarchy = {}
    this._inEdit = undefined
    this._parentDirs.clear()
    this._files = []
    this._directories = []
    this._previousDirectories.clear()
    // Reset External resources related data
    this._externalResources = []
    this.externalResources = []
    this.externalResourceInEdit = EmptyExternalResource
    this.extResFormOpen = false
    this.resourceInEdit = undefined
  }

  @action
  setTitle = (title, lang) => {
    if (lang === 'ENGLISH') {
      this.title.en = title
    } else if (lang === 'FINNISH') {
      this.title.fi = title
    }
  }

  @action
  setDescription = (description, lang) => {
    if (lang === 'ENGLISH') {
      this.description.en = description
    } else if (lang === 'FINNISH') {
      this.description.fi = description
    }
  }

  @action
  addOtherIdentifier = identifier => {
    this.otherIdentifiers = [...this.otherIdentifiers, identifier]
  }

  @action
  removeOtherIdentifier = identifier => {
    this.otherIdentifiers = this.otherIdentifiers.filter(
      otherIdentifier => otherIdentifier !== identifier
    )
  }

  @action
  setFieldOfScience = fieldOfScience => {
    this.fieldOfScience = fieldOfScience
  }

  @action
  setKeywords = keywords => {
    this.keywords = keywords
  }

  @action
  removeKeyword = keyword => {
    this.keywords = this.keywords.filter(word => word !== keyword)
  }

  @action
  setLicense = license => {
    this.license = license
  }

  @action
  setAccessType = accessType => {
    this.accessType = accessType
  }

  @action
  setRestrictionGrounds = restrictionGrounds => {
    this.restrictionGrounds = restrictionGrounds
  }

  @action
  removeRestrictionGrounds = () => {
    this.restrictionGrounds = {}
  }

  @action
  setParticipants = participants => {
    this.participants = participants
  }

  @action saveParticipant = participant => {
    if (participant.uiId !== undefined) {
      // Saving a participant that was previously added
      const existing = this.participants.find(
        addedParticipant => addedParticipant.uiId === participant.uiId
      )
      if (existing !== undefined) {
        this.removeParticipant(participant)
      }
    } else {
      // Adding a new participant, generate a new UI ID for them
      participant.uiId = this.createParticipantUIId()
    }
    this.setParticipants([...this.participants, participant])
  }

  @action
  removeParticipant = participant => {
    const participants = this.participants.filter(p => p.uiId !== participant.uiId)
    this.setParticipants(participants)
  }

  @action
  editParticipant = participant => {
    this.participantInEdit = { ...participant }
  }

  @computed
  get addedParticipants() {
    return this.participants
  }

  @action
  setExternalResources = externalResources => {
    this.externalResources = externalResources
  }

  @action saveExternalResource = resource => {
    const existing = this._externalResources.find(r => r.id === resource.id)
    if (existing !== undefined) {
      existing.title = resource.title
      existing.url = resource.url
      existing.useCategory = resource.useCategory
    } else {
      // Create an internal identifier for the resource to help with UI interaction
      const newId = this.createExternalResourceUIId()
      const newResource = ExternalResource(
        newId,
        resource.title,
        resource.url,
        resource.useCategory
      )
      this._externalResources = [...this._externalResources, newResource]
    }
  }

  @action
  removeExternalResource = externalResource => {
    const externalResources = this.externalResources.filter(p => p.id !== externalResource.id)
    this.setExternalResources(externalResources)
  }

  @action
  editExternalResource = externalResource => {
    this.externalResourceInEdit = { ...externalResource }
  }

  @computed
  get getParticipantInEdit() {
    return this.participantInEdit
  }

  @computed
  get addedExternalResources() {
    return this.externalResources
  }

 @computed
 get getExternalResourceInEdit() {
   return this.externalResourceInEdit
 }

  // FILE PICKER STATE MANAGEMENT

  @observable idaPickerOpen = false

  @observable _selectedProject = undefined

  @observable _selectedFiles = []

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
    // file.selected = select
    getFiles(newHier).find(f => f.identifier === file.identifier).selected = select
    if (select) {
      const theDir = flat.find(d => d.directoryName === file.parentDirectory.directoryName)
      this.deselectParents(theDir, flat)
      this._selectedFiles = [...this._selectedFiles, file]
    } else {
      this._selectedFiles = this._selectedFiles.filter(f => f.identifier !== file.identifier)
    }
    this._hierarchy = newHier
  }

  @action toggleSelectedDirectory = (dir, select) => {
    const newHier = { ...this._hierarchy }
    const flat = getDirectories(newHier)
    const theDir = flat.find(d => d.directoryName === dir.directoryName)
    theDir.selected = select
    if (select) {
      // deselect and remove the files within the selected directory
      theDir.files.forEach(f => {
        f.selected = false
        this._selectedFiles = [
          ...this._selectedFiles.filter(file => file.identifier !== f.identifier),
        ]
      })
      // deselect directories and files downwards in the hierarchy, remove them from selections
      theDir.directories.forEach(d => this.deselectChildren(d))
      // deselect parents
      const parent = flat.find(d => d.directoryName === theDir.parentDirectory.directoryName)
      this.deselectParents(parent, flat)
      this._selectedDirectories = [...this._selectedDirectories, dir]
    } else {
      this._selectedDirectories = this._selectedDirectories.filter(
        d => d.identifier !== dir.identifier
      )
    }
    this._hierarchy = newHier
  }

  deselectChildren = dir => {
    dir.selected = false
    this._selectedDirectories = [
      ...this._selectedDirectories.filter(d => d.identifier !== dir.identifier),
    ]
    dir.files.forEach(f => {
      f.selected = false
      this._selectedFiles = [
        ...this._selectedFiles.filter(file => file.identifier !== f.identifier),
      ]
    })
    dir.directories.forEach(d => this.deselectChildren(d))
  }

  deselectParents = (dir, flattenedHierarchy) => {
    // deselect directories upwards in the hierarchy, remove them from selected directories
    if (dir !== undefined) {
      dir.selected = false
      this._selectedDirectories = [
        ...this._selectedDirectories.filter(d => d.identifier !== dir.identifier),
      ]
      if (dir.parentDirectory !== undefined) {
        const aDir = flattenedHierarchy.find(d => d.identifier === dir.parentDirectory.identifier)
        if (aDir !== undefined) {
          this.deselectParents(aDir, flattenedHierarchy)
        }
      }
    }
  }

  @action getInitialDirectories = () =>
    axios.get(FileAPIURLs.PROJECT_DIR_URL + this._selectedProject).then(res => {
      this._hierarchy = Directory(res.data, undefined, false, false)
      return this._hierarchy
    })

  @action changeProject = projectId => {
    this._selectedProject = projectId
    this._hierarchy = {}
    this._selectedFiles = []
    this._selectedDirectories = []
    return this.getInitialDirectories()
  }

  @action loadDirectory = (dirId, rootDir, callback) => {
    const req = axios
      .get(FileAPIURLs.DIR_URL + dirId)
      .then(res => {
        const newDirs = [
          ...rootDir.directories.map(d =>
            (d.id === dirId
              ? {
                  ...d,
                  directories: res.data.directories.map(newDir =>
                    Directory(
                      newDir,
                      d,
                      this._selectedDirectories
                        .map(sd => sd.identifier)
                        .includes(newDir.identifier),
                      false
                    )
                  ),
                  files: res.data.files.map(newFile =>
                    File(
                      newFile,
                      d,
                      this._selectedFiles.map(sf => sf.identifier).includes(newFile.identifier)
                    )
                  ),
                }
              : d)
          ),
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
    const theDir = this._selectedDirectories.find(d => d.directoryName === directory.directoryName)
    theDir.title = title
    theDir.description = description
    theDir.useCategory = useCategory
  }

  @action setInEdit = selectedItem => {
    this._inEdit = selectedItem
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
  @action editDataset = dataset => {
    this.original = dataset
    const researchDataset = dataset.research_dataset

    // Load description
    this.title = researchDataset.title
    this.description = researchDataset.description

    // Other identifiers
    this.otherIdentifiers = researchDataset.other_identifier
      ? researchDataset.other_identifier.map(oid => oid.notation)
      : []

    // field of science
    if (researchDataset.field_of_science !== undefined) {
      const primary = researchDataset.field_of_science[0]
      if (primary !== undefined) {
        this.fieldOfScience = FieldOfScience(primary.pref_label, primary.identifier)
      }
    }

    // keywords
    this.keywords = researchDataset.keyword || []

    // access type
    const at = researchDataset.access_rights.access_type
    this.accessType = AccessType(at.pref_label, at.identifier)

    // license
    const l = researchDataset.access_rights.license
      ? researchDataset.access_rights.license[0]
      : undefined
    this.license = l ? License(l.title, l.identifier) : undefined

    // Load participants
    let participants = []
    participants = [
      ...participants,
      ...this.createParticipants(participants, researchDataset.creator || [], Role.CREATOR),
    ]
    participants = [
      ...participants,
      ...this.createParticipants(participants, researchDataset.publisher || [], Role.PUBLISHER),
    ]
    participants = [
      ...participants,
      ...this.createParticipants(participants, researchDataset.curator || [], Role.CURATOR),
    ]
    this.participants = participants

    // Load files
    const dsFiles = researchDataset.files
    const dsDirectories = researchDataset.directories
    if (dsFiles !== undefined || dsDirectories !== undefined) {
      this.idaPickerOpen = true
      this._selectedProject = dsFiles[0].details.project_identifier
      this.getInitialDirectories()
      this._selectedDirectories = dsDirectories
        ? dsDirectories.map(d => Directory(d, undefined, true, false))
        : []
      this._selectedFiles = dsFiles ? dsFiles.map(f => DatasetFile(f, undefined, true)) : []
    }

    // external resources
    const remoteResources = researchDataset.remote_resources
    this._externalResources = remoteResources
      ? remoteResources.map(r =>
          ExternalResource(this.createExternalResourceUIId(), r.title, r.identifier)
        )
      : []
    if (remoteResources !== undefined) {
      this._externalResources = remoteResources.map(r =>
        ExternalResource(this.createExternalResourceUIId(), r.title, r.identifier)
      )
      this.extResFormOpen = true
    }
  }

  createParticipants = (existing, toAdd, role) => {
    let added = []
    if (toAdd.length > 0) {
      added = [...toAdd.map(participant => this.createParticipant(participant, role, existing))]
    }
    return added
  }

  createParticipant = (participantJson, role, participants) => {
    let name
    if (participantJson['@type'].toLowerCase() === EntityType.ORGANIZATION) {
      name = participantJson.name ? participantJson.name.en : undefined
    } else {
      name = participantJson.name
    }

    let parentOrg
    if (participantJson['@type'].toLowerCase() === EntityType.ORGANIZATION) {
      const isPartOf = participantJson.is_part_of
      if (isPartOf !== undefined) {
        parentOrg = isPartOf.name.en
      } else {
        parentOrg = undefined
      }
    } else {
      const parentOrgName = participantJson.member_of.name
      if (parentOrgName !== undefined && parentOrgName.en !== undefined) {
        parentOrg = parentOrgName.en
      } else if (parentOrgName !== undefined) {
        parentOrg = parentOrgName.fi
      } else {
        parentOrg = undefined
      }
    }

    return Participant(
      participantJson['@type'].toLowerCase() === EntityType.PERSON
        ? EntityType.PERSON
        : EntityType.ORGANIZATION,
      [role],
      name,
      participantJson.email,
      participantJson.identifier,
      parentOrg,
      this.createParticipantUIId(participants)
    )
  }

  // create a new UI Identifier based on existing UI IDs
  // basically a simple number increment
  // use the store participants by default
  createParticipantUIId = (participants = this.participants) => {
    const latestId = participants.length > 0 ? Math.max(...participants.map(p => p.uiId)) : 0
    return latestId + 1
  }
  // EXTERNAL FILES

  @observable _externalResources = []

  @observable extResFormOpen = false

  // @observable resourceInEdit = undefined

  /* @action resetInEditResource = () => {
    this.resourceInEdit = undefined
  } */

  @computed get externalResources() {
    return this._externalResources
  }

  createExternalResourceUIId = (resources = this._externalResources) => {
    const latestId = resources.length > 0 ? Math.max(...resources.map(r => r.id)) : 0
    return latestId + 1
  }

  /*@action removeExternalResource = resource => {
    const existing = this._externalResources.find(r => r.id === resource.id)
    if (existing !== undefined) {
      existing.title = resource.title
      existing.url = resource.url
      existing.useCategory = resource.useCategory
    } else {
      // Create an internal identifier for the resource to help with UI interaction
      const newId = this.createExternalResourceUIId()
      const newResource = ExternalResource(
        newId,
        resource.title,
        resource.url,
        resource.useCategory
      )
      this._externalResources = [...this._externalResources, newResource]
    }
  }*/

  /* @action removeExternalResource = id => {
    this._externalResources = this._externalResources.filter(r => r.id !== id)
  } */

  @action setResourceInEdit = id => {
    this.resourceInEdit = this._externalResources.find(r => r.id === id)
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
  directoryName: dir.directory_name,
  directories: dir.directories ? dir.directories.map(d => Directory(d, dir, false, false)) : [],
  useCategory: dir.use_category || UseCategoryURLs.OUTCOME_MATERIAL,
  fileType: dir.file_type,
  files: dir.files ? dir.files.map(f => File(f, dir, false)) : [],
})

const File = (file, parent, selected) => ({
  ...Hierarchy(file, parent, selected),
  fileName: file.file_name,
  filePath: file.file_path,
  useCategory:
    getPath('file_characteristics.use_category', file) || UseCategoryURLs.OUTCOME_MATERIAL,
  fileType: getPath('file_characteristics.file_type', file),
  description: getPath('file_characteristics.description', file),
  title: getPath('file_characteristics.title', file),
})

const DatasetFile = file => ({
  identifier: file.identifier,
  useCategory: getPath('use_category.identifier'),
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
})

export const EntityType = {
  PERSON: 'person',
  ORGANIZATION: 'organization',
}

export const Role = {
  CREATOR: 'creator',
  PUBLISHER: 'publisher',
  CURATOR: 'curator',
}

export const Participant = (entityType, roles, name, email, identifier, organization, uiId) => ({
  type: entityType,
  role: roles,
  name,
  email,
  identifier,
  organization,
  uiId,
})

export const EmptyParticipant = Participant(EntityType.PERSON, [], '', '', '', '', undefined)

export const FieldOfScience = (name, url) => ({
  name,
  url,
})

export const AccessType = (name, url) => ({
  name,
  url,
})

export const License = (name, identifier) => ({
  name,
  identifier,
})

export const ExternalResource = (id, title, url, useCategory) => ({
  id,
  title,
  url,
  useCategory,
})

export const EmptyExternalResource = ExternalResource(undefined, '', '', '')

export default new Qvain()
