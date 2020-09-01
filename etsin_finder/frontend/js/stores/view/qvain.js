import { observable, action, computed, runInAction } from 'mobx'
import axios from 'axios'
import moment from 'moment'
import { getDirectories, getFiles, deepCopy } from '../../components/qvain/utils/fileHierarchy'
import urls from '../../components/qvain/utils/urls'
import {
  ACCESS_TYPE_URL,
  LICENSE_URL,
  USE_CATEGORY_URL,
  CUMULATIVE_STATE,
  DATA_CATALOG_IDENTIFIER,
  ROLE,
} from '../../utils/constants'
import { getPath } from '../../components/qvain/utils/object'
import Actors from './qvain.actors'
import Files from './qvain.files'
import Spatials, { SpatialModel } from './qvain.spatials'
import Provenances, { ProvenanceModel } from './qvain.provenances'
import RelatedResources, { RelatedResourceModel } from './qvain.relatedResources'
import Temporals, { TemporalModel } from './qvain.temporals'

class Qvain {
  constructor(Env) {
    this.Env = Env
    this.Files = new Files(this)
    this.Actors = new Actors(this)
    this.Spatials = new Spatials(this)
    this.Temporals = new Temporals(this)
    this.Temporals.create()
    this.Provenances = new Provenances(this)
    this.RelatedResources = new RelatedResources(this)
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

  @observable temporals = []

  @observable provenances = []

  @observable relatedResources = []

  @observable issuedDate = undefined

  @observable otherIdentifier = ''

  @observable otherIdentifiersArray = []

  @observable otherIdentifiersValidationError = null

  @observable fieldOfScienceArray = []

  @observable datasetLanguageArray = []

  @observable keywordString = ''

  @observable keywordsArray = []

  @observable infrastructureArray = []

  @observable licenseArray = [License(undefined, LICENSE_URL.CCBY4)]

  @observable accessType = AccessType(undefined, ACCESS_TYPE_URL.OPEN)

  @observable embargoExpDate = undefined

  @observable restrictionGrounds = undefined

  @observable externalResourceInEdit = EmptyExternalResource

  @action
  resetQvainStore = () => {
    this.original = undefined
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
    this.fieldOfScienceArray = []
    this.datasetLanguageArray = []
    this.keywordString = ''
    this.keywordsArray = []
    this.infrastructureArray = []
    this.licenseArray = [License(undefined, LICENSE_URL.CCBY4)]
    this.accessType = AccessType(undefined, ACCESS_TYPE_URL.OPEN)
    this.embargoExpDate = undefined
    this.restrictionGrounds = undefined

    // Reset Files/Directories related data
    this.dataCatalog = undefined
    this.preservationState = 0
    this.cumulativeState = CUMULATIVE_STATE.NO
    this.newCumulativeState = this.cumulativeState
    this.idaPickerOpen = false
    this.selectedProject = undefined
    this.selectedFiles = []
    this.selectedDirectories = []
    this.existingFiles = []
    this.existingDirectories = []
    this.hierarchy = {}
    this.inEdit = undefined
    this.temporals = []

    this.metadataModalFile = undefined
    this.clearMetadataModalFile = undefined
    this.fixDeprecatedModalOpen = false

    this.Files.reset()
    this.Temporals.create()

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
    this.provenances = []
    this.temporals = []
  }

  @action
  addToField = (fieldName, item, refs = {}) => {
    Object.keys(refs).forEach(key => {
      item[key] = refs[key]
    })
    this[fieldName] = [...this[fieldName], item]
  }

  @action
  editItemInField = (fieldName, index, item, refs = {}) => {
    Object.keys(refs).forEach(key => {
      item[key] = refs[key]
    })
    this[fieldName][index] = item
  }

  @action
  removeItemInField = (fieldName, uiid) => {
    this[fieldName] = [...this[fieldName].filter(item => item.uiid !== uiid)]
  }

  @action
  setChanged = changed => {
    this.changed = changed
  }

  @action
  setLangValue = (prop, value, lang) => {
    this[prop][lang] = value
    this.changed = true
  }

  @action
  setTitle = (title, lang) => {
    this.title[lang] = title
    this.changed = true

    // If this is a new dataset/draft and date is not yet defined, set date to today's date
    if (this.issuedDate === undefined && this.original === undefined) {
      this.issuedDate = moment().format('YYYY-MM-DD')
    }
  }

  @action
  setDescription = (description, lang) => {
    this.description[lang] = description
    this.changed = true
  }

  @action
  setIssuedDate = exp => {
    this.issuedDate = exp
    this.changed = true
  }

  @action
  setOtherIdentifier = identifier => {
    this.otherIdentifier = identifier
    this.changed = true
  }

  @action
  addOtherIdentifier = identifier => {
    this.changed = true
    this.otherIdentifiersArray = [...this.otherIdentifiersArray, identifier]
  }

  @action
  removeOtherIdentifier = identifier => {
    this.changed = true
    this.otherIdentifiersArray = this.otherIdentifiersArray.filter(
      otherIdentifier => otherIdentifier !== identifier
    )
  }

  setOtherIdentifierValidationError = value => {
    this.otherIdentifiersValidationError = value
  }

  @action
  setFieldOfScienceArray = (array) => {
    this.fieldOfScienceArray = array
  }

  @action
  setDatasetLanguageArray = (array) => {
    this.datasetLanguageArray = array
  }

  @action
  setKeywordString = (value) => {
    this.keywordString = value
    this.changed = true
  }

  @action
  removeKeyword = keyword => {
    this.keywordsArray = this.keywordsArray.filter(word => word !== keyword)
    this.changed = true
  }

  @action
  addKeywordToKeywordArray = () => {
    if (this.keywordString.length > 0) {
      const keywordsInString = this.keywordString.split(',').map(word => word.trim())
      const noEmptyKeywords = keywordsInString.filter(kw => kw !== '')
      const uniqKeywords = [...new Set(noEmptyKeywords)]
      const keywordsToStore = uniqKeywords.filter(word => !this.keywordsArray.includes(word))
      this.setKeywordsArray([...this.keywordsArray, ...keywordsToStore])
      this.setKeywordString('')
      this.changed = true
    }
  }

  @action
  setKeywordsArray = keywords => {
    this.keywordsArray = keywords
    this.changed = true
  }

  @action
  setInfrastructureArray = array => {
    this.infrastructureArray = array
    this.changed = true
  }

  @action
  removeInfrastructure = infrastructureToRemove => {
    this.infrastructures = this.infrastructures.filter(
      infra => infra.url !== infrastructureToRemove.url
    )
    this.changed = true
  }

  @action
  addUnsavedMultiValueFields = () => {
    // If multi value fields (fieldOfScience, otherIdentifier, keywords) have
    // a value that has not been added with the ADD-button, then add them when
    // the dataset is submitted.
    if (this.keywordString !== '') {
      this.addKeywordToKeywordArray()
    }
    if ((this.Temporals.inEdit || {}).startDate && (this.Temporals.inEdit || {}).endDate) {
      this.Temporals.save()
    }
  }

  @action
  setLicenseArray = (keywords) => {
    this.licenseArray = keywords
    this.changed = true
  }

  @action
  setAccessType = (accessType) => {
    this.accessType = accessType
    this.changed = true
  }

  @action
  setRestrictionGrounds = restrictionGrounds => {
    this.restrictionGrounds = restrictionGrounds
    this.changed = true
  }

  @action
  removeRestrictionGrounds = () => {
    this.restrictionGrounds = undefined
    this.changed = true
  }

  @action
  setEmbargoExpDate = exp => {
    this.embargoExpDate = exp
    this.changed = true
  }

  @action saveExternalResource = resource => {
    const existing = this.externalResources.find(r => r.id === resource.id)
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
  editExternalResource = externalResource => {
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

  @observable idaPickerOpen = false

  @observable dataCatalog = undefined

  @observable useDoi = false

  @observable cumulativeState = CUMULATIVE_STATE.NO

  // Used for updating cumulative state separately from rest of dataset in v2
  @observable newCumulativeState = CUMULATIVE_STATE.NO

  @observable selectedProject = undefined

  @observable selectedFiles = []

  @observable selectedDirectories = []

  @observable existingFiles = []

  @observable existingDirectories = []

  @observable hierarchy = {}

  @observable inEdit = undefined

  @observable metadataModalFile = undefined

  @observable clearMetadataModalFile = undefined

  @observable fixDeprecatedModalOpen = false

  @observable promptLooseActors = undefined

  @observable promptLooseProvenances = undefined

  @observable provenancesWithNonExistingActors = []

  @action
  setDataCatalog = selectedDataCatalog => {
    this.dataCatalog = selectedDataCatalog
    this.changed = true

    // Remove useDoi if dataCatalog is ATT
    if (selectedDataCatalog === DATA_CATALOG_IDENTIFIER.ATT) {
      this.useDoi = false
    }
  }

  @action
  setUseDoi = selectedUseDoiStatus => {
    this.useDoi = selectedUseDoiStatus
  }

  @action
  setCumulativeState = selectedCumulativeState => {
    this.cumulativeState = selectedCumulativeState
    this.changed = true
  }

  @action
  setNewCumulativeState = selectedCumulativeState => {
    this.newCumulativeState = selectedCumulativeState
    this.changed = true
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

  // Create new array by joining two arrays. If some objects have duplicate identifiers, use the object from the first array.
  mergeArraysByIdentifier = (a, b) => {
    const result = [...a]
    b.forEach(item => {
      if (!result.some(other => other.identifier === item.identifier)) {
        result.push(item)
      }
    })
    return result
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

  @action setClearMetadataModalFile = file => {
    this.clearMetadataModalFile = file
  }

  @action setMetadataModalFile = file => {
    this.metadataModalFile = file
  }

  @action showFixDeprecatedModal = () => {
    this.fixDeprecatedModalOpen = true
  }

  @action closeFixDeprecatedModal = () => {
    this.fixDeprecatedModalOpen = false
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
  @action editDataset = async dataset => {
    this.orphanActors = []
    this.provenancesWithNonExistingActors = []
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
    this.otherIdentifier = ''
    this.otherIdentifiersArray = researchDataset.other_identifier
      ? researchDataset.other_identifier.map(oid => oid.notation)
      : []

    // Fields of science
    this.fieldOfScienceArray = []
    if (researchDataset.field_of_science !== undefined) {
      this.fieldOfScienceArray = researchDataset.field_of_science.map((element) =>
        FieldOfScience(element.pref_label, element.identifier)
      )
    }

    // Languages of dataset
    this.datasetLanguage = undefined
    this.datasetLanguageArray = []
    if (researchDataset.language !== undefined) {
      this.datasetLanguageArray = researchDataset.language.map(element =>
        DatasetLanguage(element.title, element.identifier)
      )
    }

    // infrastructures
    this.infrastructureArray = []
    if (researchDataset.infrastructure !== undefined) {
      this.infrastructureArray = researchDataset.infrastructure.map((element) =>
        Infrastructure(element.pref_label, element.identifier)
      )
    }

    // spatials
    this.spatials = []
    if (researchDataset.spatial !== undefined) {
      researchDataset.spatial.forEach(element => {
        const spatial = SpatialModel(element)
        this.spatials.push(spatial)
      })
    }

    // temporals
    this.temporals = []
    if (researchDataset.temporal !== undefined) {
      researchDataset.temporal.forEach(element => {
        const temporal = TemporalModel(element)
        this.temporals.push(temporal)
      })
    }

    // Related Resources
    this.relatedResources = []
    if (researchDataset.relation !== undefined) {
      researchDataset.relation.forEach(rr => {
        const rResource = RelatedResourceModel(rr)
        this.relatedResources.push(rResource)
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

    // Licenses
    const l = researchDataset.access_rights.license
      ? researchDataset.access_rights.license
      : undefined
    if (l !== undefined) {
      this.license = undefined
      this.licenseArray = l.map(license => {
        if (license.identifier !== undefined) {
          return License(license.title, license.identifier)
        }
        const name = {
          en: `Other (URL): ${license.license}`,
          fi: `Muu (URL): ${license.license}`,
        }
        return License(name, license.license)
      })
    } else {
      this.license = undefined
      this.licenseArray = []
    }

    // Restriction grounds
    const rg = researchDataset.access_rights.restriction_grounds
      ? researchDataset.access_rights.restriction_grounds[0]
      : undefined
    this.restrictionGrounds = rg ? RestrictionGrounds(rg.pref_label, rg.identifier) : undefined

    // load actors
    this.Actors.editDataset(researchDataset)

    // Provenances
    this.provenances = []
    if (researchDataset.provenance !== undefined) {
      researchDataset.provenance.forEach(p => {
        const prov = ProvenanceModel(this, p)
        this.provenances.push(prov)
      })
    }

    // Load data catalog
    this.dataCatalog =
      dataset.data_catalog !== undefined ? dataset.data_catalog.identifier : undefined

    // Load preservation state
    this.preservationState = dataset.preservation_state

    // Load cumulative state
    this.cumulativeState = dataset.cumulative_state
    this.newCumulativeState = this.cumulativeState

    // Load DOI
    if (
      (researchDataset.preferred_identifier &&
        researchDataset.preferred_identifier.startsWith('doi')) ||
      dataset.use_doi_for_published
    ) {
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

    // External resources
    const remoteResources = researchDataset.remote_resources
    if (remoteResources !== undefined) {
      this.externalResources = remoteResources.map(r =>
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
    if (this.Env.metaxApiV2) {
      await this.Files.openDataset(dataset)
    }
  }

  @action setOriginal = newOriginal => {
    this.original = newOriginal
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
    this.changed = true
  }

  @action setResourceInEdit = id => {
    this.resourceInEdit = this.externalResources.find(r => r.id === id)
  }

  // PAS

  @observable preservationState = 0

  @action
  setPreservationState = state => {
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

    if (this.Env.metaxApiV2) {
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
    return this.canSelectFiles && (!this.hasBeenPublished || !this.isCumulative)
  }

  @computed
  get isCumulative() {
    return this.cumulativeState === CUMULATIVE_STATE.YES && this.hasBeenPublished
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

  @action checkProvenanceActors = () => {
    const provenanceActors = [
      ...new Set(this.provenances.map(prov => Object.values(prov.associations.actorsRef)).flat()),
    ].flat()
    const actorsWithOnlyProvenanceTag = this.Actors.actors.filter(
      actor => actor.roles.includes(ROLE.PROVENANCE) && actor.roles.length === 1
    )

    const orphanActors = actorsWithOnlyProvenanceTag.filter(
      actor => !provenanceActors.includes(actor)
    )
    if (!orphanActors.length) return Promise.resolve(true)
    this.orphanActors = orphanActors

    return this.createLooseActorPromise()
  }

  @action checkActorFromRefs = actor => {
    const provenancesWithActorRefsToBeRemoved = this.provenances.filter(
      p => p.associations.actorsRef[actor.uiid]
    )
    if (!provenancesWithActorRefsToBeRemoved.length) return Promise.resolve(true)
    this.provenancesWithNonExistingActors = provenancesWithActorRefsToBeRemoved
    return this.createLooseProvenancePromise()
  }

  @action removeActorFromRefs = actor => {
    this.provenances.forEach(p => p.associations.removeActorRef(actor.uiid))
  }

  // these two are self-removing-resolve-functions
  // You can call this.promptLooseActors(true/false)
  // and it will resolve promise and then delete resolver from this.promptLooseActors.
  // useful when the User confirm needed from dialog. Otherwise removing this.promptLooseActors should
  // be removed in every .then/ after await.
  createLooseActorPromise = () =>
    new Promise(res => {
      this.promptLooseActors = resolve => {
        this.promptLooseActors = undefined
        res(resolve)
      }
    })

  createLooseProvenancePromise = () =>
    new Promise(res => {
      this.promptLooseProvenances = resolve => {
        this.promptLooseProvenances = undefined
        res(resolve)
      }
    })
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

export const ExternalResource = (id, title, accessUrl, downloadUrl, useCategory) => ({
  id,
  title,
  accessUrl,
  downloadUrl,
  useCategory,
})

export const EmptyExternalResource = ExternalResource(undefined, '', '', '', '')

export default Qvain
