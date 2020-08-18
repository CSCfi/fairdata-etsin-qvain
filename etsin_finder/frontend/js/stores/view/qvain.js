import { observable, action, computed, runInAction } from 'mobx'
import axios from 'axios'
import uuid from 'uuid/v4'
import { getDirectories, getFiles, deepCopy } from '../../components/qvain/utils/fileHierarchy'
import {
  ACCESS_TYPE_URL,
  LICENSE_URL,
  FILE_API_URLS,
  USE_CATEGORY_URL,
  CUMULATIVE_STATE,
  DATA_CATALOG_IDENTIFIER,
} from '../../utils/constants'
import { getPath } from '../../components/qvain/utils/object'
import Actors from './qvain.actors'
import Files from './qvain.files'
import Spatials, { SpatialModel } from './qvain.spatials'
import { parseOrganization } from '../../components/qvain/project/utils'

class Qvain {
  constructor() {
    this.Files = new Files(this)
    this.Actors = new Actors(this)
    this.Spatials = new Spatials(this)
  }

  @observable original = undefined // used if editing, otherwise undefined

  @observable changed = false // has dataset been changed

  @observable deprecated = false

  @observable title = {
    en: '',
    fi: '',
  }

  @observable description = {
    en: '',
    fi: '',
  }

  @observable spatials = []

  @observable issuedDate = undefined

  @observable otherIdentifier = ''

  @observable otherIdentifiersArray = []

  @observable otherIdentifiersValidationError = null

  @observable fieldOfScience = undefined

  @observable fieldOfScienceArray = []

  @observable datasetLanguage = undefined

  @observable datasetLanguageArray = []

  @observable keywordString = ''

  @observable keywordsArray = []

  @observable infrastructure = undefined

  @observable infrastructures = []

  @observable projects = []

  @observable license = License(undefined, LICENSE_URL.CCBY4)

  @observable otherLicenseUrl = undefined

  @observable accessType = AccessType(undefined, ACCESS_TYPE_URL.OPEN)

  @observable embargoExpDate = undefined

  @observable restrictionGrounds = {}

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
    this.issuedDate = undefined
    this.otherIdentifier = ''
    this.otherIdentifiersArray = []
    this.otherIdentifiersValidationError = null
    this.fieldOfScience = undefined
    this.fieldOfScienceArray = []
    this.datasetLanguage = undefined
    this.datasetLanguageArray = []
    this.keywordString = ''
    this.keywordsArray = []
    this.infrastructure = undefined
    this.infrastructures = []
    this.projects = []
    this.license = License(undefined, LICENSE_URL.CCBY4)
    this.otherLicenseUrl = undefined
    this.accessType = AccessType(undefined, ACCESS_TYPE_URL.OPEN)
    this.embargoExpDate = undefined
    this.restrictionGrounds = {}

    // Reset Files/Directories related data
    this.dataCatalog = undefined
    this.preservationState = 0
    this.cumulativeState = CUMULATIVE_STATE.NO
    this.idaPickerOpen = false
    this.selectedProject = undefined
    this.selectedFiles = []
    this.selectedDirectories = []
    this.existingFiles = []
    this.existingDirectories = []
    this.hierarchy = {}
    this.inEdit = undefined

    this.metadataModalFile = undefined
    this.fixDeprecatedModalOpen = false

    this.Files.reset()

    this.useDoi = false

    // Reset External resources related data
    this.externalResources = []
    this.externalResourceInEdit = EmptyExternalResource
    this.extResFormOpen = false
    this.resourceInEdit = undefined

    this.changed = false
    this.deprecated = false

    this.Actors.reset()
    this.spatials = []
  }

  @action
  setChanged = (changed) => {
    this.changed = changed
  }

  @action
  setTitle = (title, lang) => {
    if (lang === 'ENGLISH') {
      this.title.en = title
    } else if (lang === 'FINNISH') {
      this.title.fi = title
    }
    this.changed = true
  }

  @action
  setDescription = (description, lang) => {
    if (lang === 'ENGLISH') {
      this.description.en = description
    } else if (lang === 'FINNISH') {
      this.description.fi = description
    }
    this.changed = true
  }

  @action
  setIssuedDate = (exp) => {
    this.issuedDate = exp
    this.changed = true
  }

  @action
  setOtherIdentifier = (identifier) => {
    this.otherIdentifier = identifier
  }

  @action
  addOtherIdentifier = (identifier) => {
    this.changed = true
    this.otherIdentifiersArray = [...this.otherIdentifiersArray, identifier]
  }

  @action
  removeOtherIdentifier = (identifier) => {
    this.changed = true
    this.otherIdentifiersArray = this.otherIdentifiersArray.filter(
      (otherIdentifier) => otherIdentifier !== identifier
    )
  }

  setOtherIdentifierValidationError = (value) => {
    this.otherIdentifiersValidationError = value
  }

  @action
  setFieldOfScience = (fieldOfScience) => {
    this.fieldOfScience = fieldOfScience
  }

  @action
  removeFieldOfScience = (fieldOfScienceToRemove) => {
    this.fieldOfScienceArray = this.fieldOfScienceArray.filter(
      (fieldOfScience) => fieldOfScience.url !== fieldOfScienceToRemove.url
    )
    this.changed = true
  }

  @action
  addFieldOfScience = (fieldOfScience) => {
    // Add fieldOfScience to fieldOfScienceArray if fieldOfScience has "url" and
    // "name" object keys, and does not exist in the array.
    if (fieldOfScience !== undefined) {
      if (
        Object.keys(fieldOfScience).includes(('url', 'name')) &&
        !this.fieldOfScienceArray.some((field) => field.url === fieldOfScience.url)
      ) {
        this.fieldOfScienceArray.push(FieldOfScience(fieldOfScience.name, fieldOfScience.url))
        this.changed = true
      }
      this.setFieldOfScience(undefined)
    }
  }

  @action
  setDatasetLanguage = (language) => {
    this.datasetLanguage = language
  }

  @action
  removeDatasetLanguage = (languageToRemove) => {
    const languagesToRemain = this.datasetLanguageArray.filter(language => language.url !== languageToRemove.url)
    this.datasetLanguageArray = languagesToRemain
    this.changed = true
  }

  @action
  addDatasetLanguage = (language) => {
    if (!language || !('name' in language) || !('url' in language)) return
    const oldDatasetLanguages = this.datasetLanguageArray.filter(item => item.url !== language.url)
    this.datasetLanguageArray = oldDatasetLanguages.concat([(DatasetLanguage(language.name, language.url))])
    this.setDatasetLanguage(undefined)
    this.changed = true
  }

  @action
  setKeywordString = (value) => {
    this.keywordString = value
  }

  @action
  removeKeyword = (keyword) => {
    this.keywordsArray = this.keywordsArray.filter((word) => word !== keyword)
    this.changed = true
  }

  @action
  addKeywordToKeywordArray = () => {
    if (this.keywordString.length > 0) {
      const keywordsInString = this.keywordString.split(',').map((word) => word.trim())
      const noEmptyKeywords = keywordsInString.filter((kw) => kw !== '')
      const uniqKeywords = [...new Set(noEmptyKeywords)]
      const keywordsToStore = uniqKeywords.filter((word) => !this.keywordsArray.includes(word))
      this.setKeywordsArray([...this.keywordsArray, ...keywordsToStore])
      this.setKeywordString('')
    }
  }

  @action
  setKeywordsArray = (keywords) => {
    this.keywordsArray = keywords
    this.changed = true
  }

  @action
  setInfrastructure = (infrastructure) => {
    this.infrastructure = infrastructure
    this.changed = true
  }

  @action setInfrastructures = (infrastructures) => {
    this.infrastructures = infrastructures
    this.changed = true
  }

  @action
  removeInfrastructure = (infrastructureToRemove) => {
    this.infrastructures = this.infrastructures.filter(
      (infra) => infra.url !== infrastructureToRemove.url
    )
  }

  // PROJECT, REMOVE THIS
  // Add or Update
  @action setProject = project => {
    const { id } = project
    const existingProject = this.projects.find(proj => proj.id === id)
    if (existingProject) {
      const updatedProject = { ...existingProject, ...project }
      this.projects = this.projects
        .filter(proj => proj.id !== existingProject.id)
        .concat([updatedProject])
    } else this.projects = this.projects.concat([project])
    this.changed = true
  }

  @action removeProject = id => {
    this.projects = this.projects.filter(project => project.id !== id)
    this.changed = true
  }

  @action
  addUnsavedMultiValueFields = () => {
    // If multi value fields (fieldOfScience, otherIdentifier, keywords) have
    // a value that has not been added with the ADD-button, then add them when
    // the dataset is submitted.
    if (this.fieldOfScience !== undefined) {
      this.addFieldOfScience(this.fieldOfScience)
    }
    if (this.datasetLanguage !== undefined) {
      this.addDatasetLanguage(this.datasetLanguage)
    }
    if (this.keywordString !== '') {
      this.addKeywordToKeywordArray()
    }
  }

  @action
  setLicense = (license) => {
    this.license = license
    this.changed = true
  }

  @action
  setLicenseName = name => {
    this.license.name = name // only affects license display, should not trigger this.changed
  }

  @action
  setAccessType = (accessType) => {
    this.accessType = accessType
    this.changed = true
  }

  @action
  setRestrictionGrounds = (restrictionGrounds) => {
    this.restrictionGrounds = restrictionGrounds
    this.changed = true
  }

  @action
  removeRestrictionGrounds = () => {
    this.restrictionGrounds = {}
    this.changed = true
  }

  @action
  setEmbargoExpDate = (exp) => {
    this.embargoExpDate = exp
    this.changed = true
  }

  @action saveExternalResource = (resource) => {
    const existing = this.externalResources.find((r) => r.id === resource.id)
    if (existing !== undefined) {
      existing.title = resource.title
      existing.accessUrl = resource.accessUrl
      existing.downloadUrl = resource.downloadUrl
      existing.useCategory = resource.useCategory
    } else {
      // Create an internal identifier for the resource to help with UI interaction
      const newId = this.createExternalResourceUIId()
      const newResource = ExternalResource(
        newId,
        resource.title,
        resource.accessUrl,
        resource.downloadUrl,
        resource.useCategory
      )
      this.externalResources = [...this.externalResources, newResource]
    }
    this.changed = true
  }

  @action
  editExternalResource = (externalResource) => {
    this.externalResourceInEdit = { ...externalResource }
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

  @observable metaxApiV2 = process.env.NODE_ENV !== 'production' && localStorage.getItem('metax_api_v2') === '1'

  @action setMetaxApiV2 = (value) => {
    this.metaxApiV2 = value
  }

  @observable idaPickerOpen = false

  @observable dataCatalog = undefined

  @observable useDoi = false

  @observable cumulativeState = CUMULATIVE_STATE.NO

  @observable selectedProject = undefined

  @observable selectedFiles = []

  @observable selectedDirectories = []

  @observable existingFiles = []

  @observable existingDirectories = []

  @observable hierarchy = {}

  @observable inEdit = undefined

  @observable metadataModalFile = undefined

  @observable fixDeprecatedModalOpen = false

  @action
  setDataCatalog = (selectedDataCatalog) => {
    this.dataCatalog = selectedDataCatalog
    this.changed = true

    // Remove useDoi if dataCatalog is ATT
    if (selectedDataCatalog === DATA_CATALOG_IDENTIFIER.ATT) {
      this.useDoi = false
    }
  }

  @action
  setUseDoi = (selectedUseDoiStatus) => {
    this.useDoi = selectedUseDoiStatus
  }

  @action
  setCumulativeState = (selectedCumulativeState) => {
    this.cumulativeState = selectedCumulativeState
    this.changed = true
  }

  @action toggleSelectedFile = (file, select) => {
    // are we removing an old selected file or are we editing the selections in the current session
    if (file.existing && !select) {
      this.existingFiles = this.existingFiles.filter((f) => f.identifier !== file.identifier)
    } else {
      const newHier = { ...this.hierarchy }
      const flat = getDirectories(newHier)
      // file.selected = select
      getFiles(newHier).find((f) => f.identifier === file.identifier).selected = select
      if (select) {
        const theDir = flat.find((d) => d.identifier === file.parentDirectory.identifier)
        this.deselectParents(theDir, flat)
        this.selectedFiles = [...this.selectedFiles, file]
      } else {
        this.selectedFiles = this.selectedFiles.filter((f) => f.identifier !== file.identifier)
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
        (d) => d.identifier !== dir.identifier
      )
    } else {
      const newHier = { ...this.hierarchy }
      const flat = getDirectories(newHier)
      const theDir = flat.find((d) => d.directoryName === dir.directoryName)
      theDir.selected = select
      if (select) {
        // deselect and remove the files within the selected directory
        theDir.files.forEach((f) => {
          f.selected = false
          this.selectedFiles = [
            ...this.selectedFiles.filter((file) => file.identifier !== f.identifier),
          ]
        })
        // deselect directories and files downwards in the hierarchy, remove them from selections
        theDir.directories.forEach((d) => this.deselectChildren(d))
        // deselect parents
        const parent = flat.find((d) => d.identifier === theDir.parentDirectory.identifier)
        this.deselectParents(parent, flat)
        this.selectedDirectories = [...this.selectedDirectories, dir]
      } else {
        this.selectedDirectories = this.selectedDirectories.filter(
          (d) => d.identifier !== dir.identifier
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
    getDirectories(newHier).forEach((dir) => {
      dir.selected = false
    })
    getFiles(newHier).forEach((file) => {
      file.selected = false
    })
    this.hierarchy = newHier
  }

  // Create new array by joining two arrays. If some objects have duplicate identifiers, use the object from the first array.
  mergeArraysByIdentifier = (a, b) => {
    const result = [...a]
    b.forEach((item) => {
      if (!result.some((other) => other.identifier === item.identifier)) {
        result.push(item)
      }
    })
    return result
  }

  deselectChildren = (dir) => {
    dir.selected = false
    this.selectedDirectories = [
      ...this.selectedDirectories.filter((d) => d.identifier !== dir.identifier),
    ]
    dir.files.forEach((f) => {
      f.selected = false
      this.selectedFiles = [
        ...this.selectedFiles.filter((file) => file.identifier !== f.identifier),
      ]
    })
    dir.directories.forEach((d) => this.deselectChildren(d))
    this.changed = true
  }

  deselectParents = (dir, flattenedHierarchy) => {
    // deselect directories upwards in the hierarchy, remove them from selected directories
    if (dir !== undefined) {
      dir.selected = false
      this.selectedDirectories = [
        ...this.selectedDirectories.filter((d) => d.identifier !== dir.identifier),
      ]
      if (dir.parentDirectory !== undefined) {
        const aDir = flattenedHierarchy.find((d) => d.identifier === dir.parentDirectory.identifier)
        if (aDir !== undefined) {
          this.deselectParents(aDir, flattenedHierarchy)
        }
      }
    }
    this.changed = true
  }

  @action getInitialDirectories = () =>
    axios.get(FILE_API_URLS.PROJECT_DIR_URL + this.selectedProject).then((res) => {
      runInAction(() => {
        this.hierarchy = Directory(res.data, undefined, false, false)
      })
      return this.hierarchy
    })

  @action changeProject = (projectId) => {
    this.selectedProject = projectId
    this.hierarchy = {}
    this.selectedFiles = []
    this.selectedDirectories = []
    return this.getInitialDirectories()
  }

  @action loadDirectory = (dirId, rootDir, callback) => {
    const req = axios
      .get(FILE_API_URLS.DIR_URL + dirId)
      .then((res) => {
        const newDirs = [
          ...rootDir.directories.map((d) => {
            if (d.id === dirId) {
              return {
                ...d,
                directories: res.data.directories.map((newDir) =>
                  Directory(
                    newDir,
                    d,
                    this.selectedDirectories.map((sd) => sd.identifier).includes(newDir.identifier),
                    false
                  )
                ),
                files: res.data.files.map((newFile) =>
                  File(
                    newFile,
                    d,
                    this.selectedFiles.map((sf) => sf.identifier).includes(newFile.identifier)
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
      .catch((e) => {
        console.log(e)
      })
    if (callback) {
      req.then(callback)
    }
    return req
  }

  @action setDirFileSettings = (directory, title, description, useCategory) => {
    const collection = directory.existing ? this.existingDirectories : this.selectedDirectories
    const theDir = collection.find((d) => d.identifier === directory.identifier)
    theDir.title = title
    theDir.description = description
    theDir.useCategory = useCategory
  }

  @action setInEdit = (selectedItem) => {
    this.inEdit = selectedItem
  }

  @action toggleInEdit = (selectedItem) => {
    if (this.inEdit === selectedItem) {
      this.inEdit = null
    } else {
      this.inEdit = selectedItem
    }
  }

  @action setMetadataModalFile = (file) => {
    this.metadataModalFile = file
  }

  @action showFixDeprecatedModal = () => {
    this.fixDeprecatedModalOpen = true
  }

  @action closeFixDeprecatedModal = () => {
    this.fixDeprecatedModalOpen = false
  }

  @action updateFileMetadata = (file) => {
    // After editing file metadata, update the file in the hierarchy if possible.
    // The input file comes from a Metax response so needs to be transformed into Qvain light format.
    const flat = getFiles(this.hierarchy)
    const hierarchyFile = flat.find((f) => f.identifier === file.identifier)
    if (hierarchyFile) {
      Object.assign(
        hierarchyFile,
        File(file, hierarchyFile.parentDirectory, hierarchyFile.selected)
      )
    }

    // Update existing file if available.
    const existingFile = this.existingFiles.find((f) => f.identifier === file.identifier)
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

  // Dataset - METAX dataset JSON
  // perform schema transformation METAX JSON -> etsin backend / internal schema
  @action editDataset = async (dataset) => {
    this.original = { ...dataset }
    this.deprecated = dataset.deprecated
    const researchDataset = dataset.research_dataset

    // Load description
    this.title = { ...researchDataset.title }
    this.description = { ...researchDataset.description }
    this.title.en = researchDataset.title.en ? researchDataset.title.en : ''
    this.title.fi = researchDataset.title.fi ? researchDataset.title.fi : ''
    this.description.en = researchDataset.description.en ? researchDataset.description.en : ''
    this.description.fi = researchDataset.description.fi ? researchDataset.description.fi : ''

    // Issued date
    this.issuedDate = researchDataset.issued || undefined

    // Other identifiers
    this.otherIdentifiersArray = researchDataset.other_identifier
      ? researchDataset.other_identifier.map((oid) => oid.notation)
      : []

    // Fields of science
    this.fieldsOfScience = []
    if (researchDataset.field_of_science !== undefined) {
      researchDataset.field_of_science.forEach((element) => {
        this.addFieldOfScience(FieldOfScience(element.pref_label, element.identifier))
      })
    }

    // Languages of dataset
    this.datasetLanguage = undefined
    this.datasetLanguageArray = []
    if (researchDataset.language !== undefined) {
      researchDataset.language.forEach(element => {
        this.addDatasetLanguage(DatasetLanguage(element.title, element.identifier))
      })
    }

    // infrastructures
    this.infrastructures = []
    if (researchDataset.infrastructure !== undefined) {
      researchDataset.infrastructure.forEach((element) => {
        this.infrastructure = Infrastructure(element.pref_label, element.identifier)
        this.infrastructures.push(this.infrastructure)
      })
    }

    // spatials
    this.spatials = []
    if (researchDataset.spatial !== undefined) {
      researchDataset.spatial.forEach(element => {
        const spatial = SpatialModel(element)
        this.spatials.push(spatial)
      })
    }

    // Keywords
    this.keywordsArray = researchDataset.keyword || []

    // Access type
    const at = researchDataset.access_rights.access_type
      ? researchDataset.access_rights.access_type
      : undefined
    this.accessType = at
      ? AccessType(at.pref_label, at.identifier)
      : AccessType(undefined, ACCESS_TYPE_URL.OPEN)

    // Embargo date
    const embargoDate = researchDataset.access_rights.available
      ? researchDataset.access_rights.available
      : undefined
    this.embargoExpDate = embargoDate || undefined

    // License
    const l = researchDataset.access_rights.license
      ? researchDataset.access_rights.license[0]
      : undefined
    if (l !== undefined) {
      if (l.identifier !== undefined) {
        this.license = l ? License(l.title, l.identifier) : License(undefined, LICENSE_URL.CCBY4)
      } else {
        this.license = l
          ? License(
            {
              en: 'Other (URL)',
              fi: 'Muu (URL)',
            },
            'other'
          )
          : License(undefined, LICENSE_URL.CCBY4)
        this.otherLicenseUrl = l.license
      }
    } else {
      this.license = undefined
    }

    // Restriction grounds
    const rg = researchDataset.access_rights.restriction_grounds
      ? researchDataset.access_rights.restriction_grounds[0]
      : undefined
    this.restrictionGrounds = rg ? RestrictionGrounds(rg.pref_label, rg.identifier) : undefined

    // load actors
    this.Actors.editDataset(researchDataset)

    // Load data catalog
    this.dataCatalog =
      dataset.data_catalog !== undefined ? dataset.data_catalog.identifier : undefined

    // Load preservation state
    this.preservationState = dataset.preservation_state

    // Load cumulative state
    this.cumulativeState = dataset.cumulative_state

    // Load DOI
    if (researchDataset.preferred_identifier.startsWith('doi')) {
      this.useDoi = true
    } else {
      this.useDoi = false
    }

    // Load files
    const dsFiles = researchDataset.files
    const dsDirectories = researchDataset.directories

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

    // Projects
    const projects = researchDataset.is_output_of
    if (projects !== undefined) {
      this.projects = projects.map(project => {
        const { name, identifier } = project
        const params = [uuid(), name, identifier, project.has_funder_identifier]
        if (project.funder_type) params.push(ProjectFunderType(project.funder_type.pref_label, project.funder_type.identifier))
        // Organizations
        const organizations = project.source_organization.map(organization => {
          const parsedOrganizations = parseOrganization(organization)
          parsedOrganizations.reverse()
          return Organization(uuid(), ...parsedOrganizations)
        })
        params.push(organizations)
        return Project(...params)
      })
    }

    // External resources
    const remoteResources = researchDataset.remote_resources
    if (remoteResources !== undefined) {
      this.externalResources = remoteResources.map((r) =>
        ExternalResource(
          // Iterate over existing elements from MobX, to assign them a local externalResourceUIId
          remoteResources.indexOf(r),
          r.title,
          r.access_url ? r.access_url.identifier : undefined,
          r.download_url ? r.download_url.identifier : undefined,
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

    this.changed = false
    if (this.metaxApiV2) {
      await this.Files.editDataset(dataset)
    }
  }

  @action setOriginal = (newOriginal) => {
    this.original = newOriginal
  }

  // EXTERNAL FILES

  @observable externalResources = []

  @observable extResFormOpen = false

  createExternalResourceUIId = (resources = this.externalResources) => {
    const latestId = resources.length > 0 ? Math.max(...resources.map((r) => r.id)) : 0
    return latestId + 1
  }

  @action removeExternalResource = (id) => {
    this.externalResources = this.externalResources.filter((r) => r.id !== id)
  }

  @action setResourceInEdit = (id) => {
    this.resourceInEdit = this.externalResources.find((r) => r.id === id)
  }

  // PAS

  @observable preservationState = 0

  @action
  setPreservationState = (state) => {
    this.preservationState = state
    this.changed = true
  }

  @computed
  get isPas() {
    return this.dataCatalog === DATA_CATALOG_IDENTIFIER.PAS || this.preservationState > 0
  }

  @computed
  get canSelectFiles() {
    if (this.readonly || this.isPas || this.deprecated) {
      return false
    }

    if (this.metaxApiV2) {
      if (this.hasBeenPublished) {
        if (this.Files && !this.Files.projectLocked) {
          return true // for published noncumulative datasets, allow adding files only if none exist yet
        }
        return this.isCumulative
      }
    }

    return true
  }

  @computed
  get canRemoveFiles() {
    return this.canSelectFiles && !this.isCumulative
  }

  @computed
  get isCumulative() {
    return this.cumulativeState === CUMULATIVE_STATE.YES
  }

  @computed
  get hasBeenPublished() {
    return !!(this.original && (this.original.state === 'published' || this.original.draft_of))
  }

  @computed
  get readonly() {
    return (
      this.preservationState >= 80 &&
      this.preservationState !== 100 &&
      this.preservationState !== 130
    )
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
  directories: dir.directories ? dir.directories.map((d) => Directory(d, dir, false, false)) : [],
  useCategory: dir.use_category || USE_CATEGORY_URL.OUTCOME_MATERIAL,
  fileType: dir.file_type,
  files: dir.files ? dir.files.map((f) => File(f, dir, false)) : [],
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

export const DatasetFile = (file) => ({
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

const DatasetDirectory = (directory) => ({
  ...Directory(directory.details, undefined, true, false),
  identifier: directory.identifier,
  description: directory.description,
  title: directory.title,
  useCategory: directory.use_category.identifier,
  existing: true,
})

export const FieldOfScience = (name, url) => ({
  name,
  url,
})

export const DatasetLanguage = (name, url) => ({
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

export const Infrastructure = (name, url) => ({
  name,
  url,
})

export const Project = (
  id,
  title, // {en, fi}
  identifier,
  fundingIdentifier,
  funderType, // ProjectFunderType
  organizations, // Array<Organization>
  fundingAgencies, // Array<FundingAgency>
) => ({
  id: id || uuid(),
  details: { title, identifier, fundingIdentifier, funderType },
  organizations,
  fundingAgencies,
})

export const ProjectFunderType = (name, url) => ({
  name,
  url,
})

export const Organization = (id, organization, department, subDepartment) => ({
  id: id || uuid(),
  organization, // {identifier, name: {fi, en, und}}
  department, // {identifier, name: {fi, en, und}}
  subDepartment, // {identifier, name: {fi, en, und}}
})

export const FundingAgency = (id, organization, contributorTypes) => ({
  id: id || uuid(),
  organization, // <Organization>
  contributorTypes, // Array<ContributorType>
})

export const ContributorType = (id, identifier, label, definition, inScheme) => ({
  id: id || uuid(),
  identifier,
  label, // {en, fi}
  definition, // {en, fi}
  inScheme,
})

export const ExternalResource = (id, title, accessUrl, downloadUrl, useCategory) => ({
  id,
  title,
  accessUrl,
  downloadUrl,
  useCategory,
})

export const EmptyExternalResource = ExternalResource(undefined, '', '', '', '')

export default new Qvain()
