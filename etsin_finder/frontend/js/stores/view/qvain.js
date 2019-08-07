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

  @observable actors = []

  @observable actorInEdit = EmptyActor

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
    this.actors = []
    this.actorInEdit = EmptyActor

    // Reset Files/Directories related data
    this.dataCatalog = undefined
    this.idaPickerOpen = false
    this.selectedProject = undefined
    this.selectedFiles = []
    this.selectedDirectories = []
    this.existingFiles = []
    this.existingDirectories = []
    this.hierarchy = {}
    this.inEdit = undefined
    // Reset External resources related data
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
  setActors = actors => {
    this.actors = actors
  }

  @action saveActor = actor => {
    if (actor.uiId !== undefined) {
      // Saving a actor that was previously added
      const existing = this.actors.find(
        addedActor => addedActor.uiId === actor.uiId
      )
      if (existing !== undefined) {
        this.removeActor(actor)
      }
    } else {
      // Adding a new actor, generate a new UI ID for them
      actor.uiId = this.createActorUIId()
    }
    this.setActors([...this.actors, actor])
  }

  @action
  removeActor = actor => {
    const actors = this.actors.filter(p => p.uiId !== actor.uiId)
    this.setActors(actors)
  }

  @action
  editActor = actor => {
    this.actorInEdit = { ...actor }
  }

  @computed
  get addedActors() {
    return this.actors
  }

  @action saveExternalResource = resource => {
    const existing = this.externalResources.find(r => r.id === resource.id)
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
      this.externalResources = [...this.externalResources, newResource]
    }
  }

  @action
  editExternalResource = externalResource => {
    this.externalResourceInEdit = { ...externalResource }
  }

  @computed
  get getActorInEdit() {
    return this.actorInEdit
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

  @observable dataCatalog = undefined

  @observable selectedProject = undefined

  @observable selectedFiles = []

  @observable selectedDirectories = []

  @observable existingFiles = []

  @observable existingDirectories = []

  @observable hierarchy = {}

  @observable inEdit = undefined

  @action
  setDataCatalog = selectedDataCatalog => {
    this.dataCatalog = selectedDataCatalog
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
        const theDir = flat.find(d => d.directoryName === file.parentDirectory.directoryName)
        this.deselectParents(theDir, flat)
        this.selectedFiles = [...this.selectedFiles, file]
      } else {
        this.selectedFiles = this.selectedFiles.filter(f => f.identifier !== file.identifier)
      }
      this.hierarchy = newHier
    }
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
        const parent = flat.find(d => d.directoryName === theDir.parentDirectory.directoryName)
        this.deselectParents(parent, flat)
        this.selectedDirectories = [...this.selectedDirectories, dir]
      } else {
        this.selectedDirectories = this.selectedDirectories.filter(
          d => d.identifier !== dir.identifier
        )
      }
      this.hierarchy = newHier
    }
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
  }

  @action getInitialDirectories = () =>
    axios.get(FileAPIURLs.PROJECT_DIR_URL + this.selectedProject).then(res => {
      this.hierarchy = Directory(res.data, undefined, false, false)
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
    const collection = directory.existing ? this.existingDirectories : this.selectedDirectories
    const theDir = collection.find(d => d.identifier === directory.identifier)
    theDir.title = title
    theDir.description = description
    theDir.useCategory = useCategory
  }

  @action setInEdit = selectedItem => {
    this.inEdit = selectedItem
  }

  @computed
  get getSelectedProject() {
    return this.selectedProject
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
  get getInEdit() {
    return this.inEdit
  }

  @computed
  get getHierarchy() {
    return this.hierarchy
  }

  // Dataset related

  // dataset - METAX dataset JSON
  // perform schema transformation METAX JSON -> etsin backend / internal schema
  @action editDataset = dataset => {
    this.original = { ...dataset }
    const researchDataset = dataset.research_dataset

    // Load description
    this.title = { ...researchDataset.title }
    this.description = { ...researchDataset.description }
    this.title.en = researchDataset.title.en ? researchDataset.title.en : ''
    this.title.fi = researchDataset.title.fi ? researchDataset.title.fi : ''
    this.description.en = researchDataset.description.en ? researchDataset.description.en : ''
    this.description.fi = researchDataset.description.fi ? researchDataset.description.fi : ''

    // Other identifiers
    this.otherIdentifiers = researchDataset.other_identifier
      ? researchDataset.other_identifier.map(oid => oid.notation)
      : []

    // field of science
    if (researchDataset.field_of_science !== undefined) {
      const primary = researchDataset.field_of_science[0]
      if (primary !== undefined) {
        this.fieldOfScience = FieldOfScience(primary.pref_label, primary.identifier)
      } else {
        this.fieldOfScience = undefined
      }
    } else {
      this.fieldOfScience = undefined
    }

    // keywords
    this.keywords = researchDataset.keyword || []

    // access type
    const at = researchDataset.access_rights.access_type
      ? researchDataset.access_rights.access_type
      : undefined
    this.accessType = at
      ? AccessType(at.pref_label, at.identifier)
      : AccessType(undefined, AccessTypeURLs.OPEN)

    // embargo date
    const date = researchDataset.access_rights.available
      ? researchDataset.access_rights.available
      : undefined
    this.embargoExpDate = date || undefined

    // license
    const l = researchDataset.access_rights.license
      ? researchDataset.access_rights.license[0]
      : undefined
    if (l !== undefined) {
      if (l.identifier !== undefined) {
        this.license = l ? License(l.title, l.identifier) : License(undefined, LicenseUrls.CCBY4)
      } else {
        this.license = l
          ? License(
              {
                en: 'Other (URL)',
                fi: 'Muu (URL)',
              },
              'other'
            )
          : License(undefined, LicenseUrls.CCBY4)
        this.otherLicenseUrl = l.license
      }
    } else {
      this.license = undefined
    }

    // restriction grounds
    const rg = researchDataset.access_rights.restriction_grounds
      ? researchDataset.access_rights.restriction_grounds[0]
      : undefined
    this.restrictionGrounds = rg ? RestrictionGrounds(rg.pref_label, rg.identifier) : undefined

    // Load actors
    const actors = []
    if ('publisher' in researchDataset) {
      actors.push(
        this.createActor(researchDataset.publisher, Role.PUBLISHER, actors)
      )
    }
    if ('curator' in researchDataset) {
      researchDataset.curator.forEach(curator =>
        actors.push(this.createActor(curator, Role.CURATOR, actors))
      )
    }
    if ('creator' in researchDataset) {
      researchDataset.creator.forEach(creator =>
        actors.push(this.createActor(creator, Role.CREATOR, actors))
      )
    }
    console.groupCollapsed('Actors to be compared DEBUG')
    console.table(JSON.parse(JSON.stringify(actors)))
    console.groupEnd()
    this.actors = this.mergeTheSameActors(actors)

    // load data catalog
    this.dataCatalog =
      dataset.data_catalog !== undefined ? dataset.data_catalog.identifier : undefined

    // Load files
    const dsFiles = researchDataset.files
    const dsDirectories = researchDataset.directories

    if (dsFiles !== undefined || dsDirectories !== undefined) {
      this.idaPickerOpen = true
      const toCheck = [...(dsFiles || []), ...(dsDirectories || [])]
      this.selectedProject = toCheck.length > 0 ? toCheck[0].details.project_identifier : undefined
      this.getInitialDirectories()
      this.existingDirectories = dsDirectories ? dsDirectories.map(d => DatasetDirectory(d)) : []
      this.existingFiles = dsFiles ? dsFiles.map(f => DatasetFile(f, undefined, true)) : []
    }

    // external resources
    const remoteResources = researchDataset.remote_resources
    if (remoteResources !== undefined) {
      this.externalResources = remoteResources.map(r =>
        ExternalResource(
          // Iterate over existing elements from MobX, to assign them a local externalResourceUIId
          remoteResources.indexOf(r),
          r.title,
          r.access_url ? r.access_url.identifier : undefined,
          r.use_category
            ? {
                label: r.use_category.pref_label.en,
                value: r.use_category.identifier,
              }
            : undefined
        )
      )
      this.extResFormOpen = true
    }
  }

  // Creates a single instance of a actor, only has one role.
  // Returns a Actor.
  createActor = (actorJson, role, actors) => {
    const entityType = actorJson['@type'].toLowerCase()
    let name
    if (entityType === EntityType.ORGANIZATION) {
      name = actorJson.name ? actorJson.name : undefined
    } else {
      name = actorJson.name
    }

    let parentOrg
    if (entityType === EntityType.ORGANIZATION) {
      const isPartOf = actorJson.is_part_of ? actorJson.is_part_of : undefined
      if (isPartOf) {
        parentOrg = isPartOf.name
      } else {
        parentOrg = undefined
      }
    } else {
      const parentOrgName = actorJson.member_of ? actorJson.member_of.name : undefined
      if (parentOrgName) {
        parentOrg = parentOrgName
      } else {
        parentOrg = undefined
      }
    }

    return Actor(
      entityType === EntityType.PERSON
        ? EntityType.PERSON
        : EntityType.ORGANIZATION,
      [role],
      name,
      actorJson.email ? actorJson.email : '',
      actorJson.identifier ? actorJson.identifier : '',
      parentOrg,
      this.createActorUIId(actors)
    )
  }

  // Function that 'Merge' the actors with the same metadata (except UIid).
  // It looks for actors with the same info but different roles and adds their
  // roles together to get one actor with multiple roles.
  // Returns a nw array with the merged actors.
  mergeTheSameActors = actors => {
    console.groupCollapsed('Actor object comparison DEBUG')
    if (actors.length <= 1) return actors
    const mergedActors = []
    actors.forEach(actor1 => {
      actors.forEach((actor2, index) => {
        if (this.isEqual(actor1, actor2)) {
          actor1.role = [...new Set([].concat(...[actor1.role, actor2.role]))]
          delete actors[index]
        }
      })
      mergedActors.push(actor1)
    })
    console.groupEnd()
    return mergedActors
  }

  // Function to compare two actors and see if they are the same actor.
  // Returns True if the actors seem the same, or False if not.
  isEqual = (a1, a2) => {
    console.log(
      // eslint-disable-next-line no-nested-ternary
      `Compare: ${a1.name.en ? a1.name.en : a1.name.und ? a1.name.und : a1.name} and ${a2.name.en ? a2.name.en : a2.name.und ? a2.name.und : a2.name}`
    )
    if (!!a1.identifier && !!a2.identifier) {
      // If a1 and a2 have identifiers.
      if (a1.identifier === a2.identifier) {
        // If the identifiers are the same.
        console.log(true)
        return true
      }
      // If a1 and a2 have identifiers but they are not the same, then they
      // are not the same actor.
      console.log(false)
      return false
    }
    if (!!a1.email && !!a2.email) {
      // If a1 and a2 have emails.
      if (a1.type === EntityType.PERSON && a2.type === EntityType.PERSON) {
        // If they have emails and are type PERSON.
        if (a1.email === a2.email && a1.name === a2.name) {
          // If they have emails and are type PERSON and the emails and names are equal.
          console.log(true)
          return true
        }
        // If they have emails and are type person but the emails or names are not equal.
        console.log(false)
        return false
      }
      if (a1.type === EntityType.ORGANIZATION && a2.type === EntityType.ORGANIZATION) {
        // If they have emails an are of type ORGANIZATION.
        if (a1.email === a2.email && this.isEqualObj(a1.name, a2.name)) {
          // If they have emails and are of type ORGANIZATION and the emails
          // and name objects are equal.
          console.log(true)
          return true
        }
        // If they have emails and are type ORGANIZATION but the emails or
        // name objects are not equal.
        console.log(false)
        return false
      }
    }
    if (a1.type === EntityType.PERSON && a2.type === EntityType.PERSON) {
      // If a1 and a2 are of type PERSON.
      if (a1.name === a2.name && this.isEqualObj(a1.organization, a2.organization)) {
        // if they are of type PERSON and the names and organization objects
        // are equal.
        console.log(true)
        return true
      }
      // If they are of type PERSON but the names or organization objects
      // are not equal.
      console.log(false)
      return false
    }
    if (a1.type === EntityType.ORGANIZATION && a2.type === EntityType.ORGANIZATION) {
      // If a1 and a2 are of type ORGANIZATION.
      if (!(a1.organization === undefined && a2.organization === undefined)) {
        // If they are of type ORGANIZATION and their parent organizations
        // are not empty objects.
        if (this.isEqualObj(a1.name, a2.name) && this.isEqualObj(a1.organization, a2.organization)) {
          // If they are of type ORGANIZATION and their parent organization objects
          // are not empty and their names and parent organization objects are equal.
          console.log(true)
          return true
        }
        // If they are of type ORGANIZATION and their parent organization objects
        // are not empty, but their names or parent organization objects are not equal.
        console.log(false)
        return false
      }
      if (this.isEqualObj(a1.name, a2.name)) {
        // If they are of type ORGANIZATION and their parent organization objects
        // are empty and their name objects are equal.
        console.log(true)
        return true
      }
      // If they are of type ORGANIZATION and their parent organization objects
      // are empty and their name objects are not equal.
      console.log(false)
      return false
    }
    // If a1 and a2 don't have identifiers or emails and they are not the same entity type.
    console.log(false)
    return false
  }

  isObjectEmpty = (obj) => {
    // ECMA 5+ way to check if object is empty.
    if (Object.keys(obj).length === 0 && obj.constructor === Object) {
      return true
    }
    return false
  }

  isEqualObj = (obj1, obj2) => {
    // Checks if the objects have the same key-value pairs.
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
      return true
    }
    return false
  }

  // create a new UI Identifier based on existing UI IDs
  // basically a simple number increment
  // use the store actors by default
  createActorUIId = (actors = this.actors) => {
    const latestId = actors.length > 0 ? Math.max(...actors.map(p => p.uiId)) : 0
    return latestId + 1
  }
  // EXTERNAL FILES

  @observable externalResources = []

  @observable extResFormOpen = false

  createExternalResourceUIId = (resources = this.externalResources) => {
    const latestId = resources.length > 0 ? Math.max(...resources.map(r => r.id)) : 0
    return latestId + 1
  }

  @action removeExternalResource = id => {
    this.externalResources = this.externalResources.filter(r => r.id !== id)
  }

  @action setResourceInEdit = id => {
    this.resourceInEdit = this.externalResources.find(r => r.id === id)
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
  existing: false
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
  existing: false
})

const DatasetFile = file => ({
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
  existing: true
})

const DatasetDirectory = directory => ({
  ...Directory(directory.details, undefined, true, false),
  identifier: directory.identifier,
  description: directory.description,
  title: directory.title,
  useCategory: directory.use_category.identifier,
  existing: true
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

export const Actor = (entityType, roles, name, email, identifier, organization, uiId) => ({
  type: entityType,
  role: roles,
  name,
  email,
  identifier,
  organization,
  uiId,
})

export const EmptyActor = Actor(EntityType.PERSON, [], '', '', '', undefined, undefined)

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

export const RestrictionGrounds = (name, identifier) => ({
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
