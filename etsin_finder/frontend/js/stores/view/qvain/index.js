import { observable, action, computed, makeObservable } from 'mobx'
import { CUMULATIVE_STATE, DATA_CATALOG_IDENTIFIER } from '../../../utils/constants'
import Resources from './qvain.resources'
import Files from './qvain.files'
import Submit from './qvain.submit'

class Qvain extends Resources {
  constructor(Env) {
    super()
    this.Env = Env
    this.Files = new Files(this)
    this.Submit = new Submit(this)
    this.resetQvainStore()
    this.Submit = new Submit(this)
    makeObservable(this)
  }

  @observable original = undefined // used if editing, otherwise undefined

  @observable changed = false // has dataset been changed

  @observable deprecated = false

  @observable externalResourceInEdit = EmptyExternalResource

  @action
  resetQvainStore = () => {
    this.Submit = new Submit(this)
    this.original = undefined
    // Reset Files/Directories related data
    this.resetFilesV1()
    this.Files.reset()
    this.dataCatalog = undefined
    this.preservationState = 0
    this.cumulativeState = CUMULATIVE_STATE.NO
    this.newCumulativeState = this.cumulativeState
    this.inEdit = undefined

    this.metadataModalFile = undefined
    this.clearMetadataModalFile = undefined
    this.fixDeprecatedModalOpen = false

    this.resources.forEach(r => r.reset())

    this.useDoi = false

    // Reset External resources related data
    this.externalResources = []
    this.externalResourceInEdit = EmptyExternalResource
    this.extResFormOpen = false
    this.resourceInEdit = undefined

    this.changed = false
    this.deprecated = false

    this.Submit.reset()
  }

  @action
  setChanged = changed => {
    this.changed = changed
    if (changed) {
      this.Submit.hasValidated = false
      this.Submit.prevalidate()
    }
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

  @observable dataCatalog = undefined

  @observable useDoi = false

  @observable cumulativeState = CUMULATIVE_STATE.NO

  // Used for updating cumulative state separately from rest of dataset in v2
  @observable newCumulativeState = CUMULATIVE_STATE.NO

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
    this.setChanged(true)

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

  @computed
  get getSelectedProject() {
    return this.selectedProject
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

  @computed
  get getInEdit() {
    return this.inEdit
  }

  // Dataset related
  // perform schema transformation METAX JSON -> etsin backend / internal schema
  @action loadBasicFields = dataset => {
    const researchDataset = dataset.research_dataset
    this.resources.forEach(r => r.fromBackend(researchDataset, this))
  }

  // load fields that won't be duplicated by template copy
  @action loadStatusAndFileFields = async dataset => {
    this.deprecated = dataset.deprecated

    // Load data catalog
    this.dataCatalog =
      dataset.data_catalog !== undefined ? dataset.data_catalog.identifier : undefined

    const researchDataset = dataset.research_dataset

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

    this.fromBackendFilesV1(researchDataset)

    // External resources
    const remoteResources = researchDataset.remote_resources
    if (remoteResources !== undefined) {
      this.externalResources = remoteResources.map(r =>
        ExternalResource(
          // Iterate over existing elements from MobX, to assign them a local externalResourceUIId
          remoteResources.indexOf(r),
          r.title,
          r.access_url ? r.access_url.identifier : '',
          r.download_url ? r.download_url.identifier : '',
          r.use_category
            ? {
              label: r.use_category.pref_label.en,
              value: r.use_category.identifier,
            }
            : null
        )
      )
      this.extResFormOpen = true
    }

    // Load v2 files
    if (this.Env.metaxApiV2) {
      await this.Files.openDataset(dataset)
    } else {
      this.Files.reset()
    }
  }

  @action editDataset = async dataset => {
    this.Submit.reset()
    this.setChanged(false)
    this.original = { ...dataset }
    this.loadBasicFields(dataset)
    await this.loadStatusAndFileFields(dataset)
  }

  @action resetWithTemplate = async dataset => {
    this.resetQvainStore()
    this.loadBasicFields(dataset)
    this.setChanged(true)
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
        if (this.Files && (!this.Files.projectLocked || this.Files.draftOfHasProject === false)) {
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

export const ExternalResource = (id, title, accessUrl, downloadUrl, useCategory) => ({
  id,
  title,
  accessUrl,
  downloadUrl,
  useCategory,
})

export const EmptyExternalResource = ExternalResource(undefined, '', '', '', '')

export default Qvain
