import { observable, action, computed, makeObservable, toJS } from 'mobx'
import {
  cumulativeStateSchema,
  useDoiSchema,
  dataCatalogSchema,
  externalResourceSchema,
} from './qvain.dataCatalog.schemas'
import {
  CUMULATIVE_STATE,
  DATA_CATALOG_IDENTIFIER,
  REMOTE_RESOURCES_DATA_CATALOGS,
  FILES_DATA_CATALOGS,
} from '../../../utils/constants'
import Resources from './qvain.resources'
import Files from './qvain.files'
import Submit from './qvain.submit'
import Lock from './qvain.lock'
import track, { touch } from './track'
import queryParamEnabled from '@/utils/queryParamEnabled'

class Qvain extends Resources {
  constructor(Env, Auth) {
    super()
    makeObservable(this)
    this.Env = Env
    this.Files = new Files(this, Auth)
    this.Submit = new Submit(this)
    this.resetQvainStore()
    this.Lock = new Lock(this, Auth)
  }

  cumulativeStateSchema = cumulativeStateSchema

  useDoiSchema = useDoiSchema

  dataCatalogSchema = dataCatalogSchema

  externalResourceSchema = externalResourceSchema

  @observable original = undefined // used if editing, otherwise undefined

  @observable changed = false // has dataset been changed

  @observable deprecated = false

  @observable unsupported = null

  @action
  resetQvainStore = () => {
    this.original = undefined
    this.unsupported = null

    // Reset Files/Directories related data
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

    if (selectedDataCatalog === DATA_CATALOG_IDENTIFIER.IDA) {
      this.setUseDoi(true)
    }

    if (!FILES_DATA_CATALOGS.includes(selectedDataCatalog)) {
      this.Files.reset()
    }

    if (!REMOTE_RESOURCES_DATA_CATALOGS.includes(selectedDataCatalog)) {
      this.ExternalResources.reset()
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

  @computed get datasetIdentifier() {
    return this.original?.identifier
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
    const [researchDataset, tracker] = track(toJS(dataset.research_dataset))
    // avoid reporting fields as unsupported when they are automatically defined by metax
    touch(
      researchDataset.metadata_version_identifier,
      researchDataset.preferred_identifier,
      researchDataset.total_files_byte_size
    )
    this.resources.forEach(r => r.fromBackend(researchDataset, this, tracker))
    this.unsupported = tracker.getUnused({ deep: true })
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
    this.cumulativeState =
      dataset.cumulative_state === CUMULATIVE_STATE.YES ? CUMULATIVE_STATE.YES : CUMULATIVE_STATE.NO
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

    // Load v2 files
    await this.Files.openDataset(dataset)
  }

  @action editDataset = async dataset => {
    this.resetQvainStore()
    this.Submit.reset()
    this.setChanged(false)
    this.original = { ...dataset }
    this.loadBasicFields(dataset)
    await this.loadStatusAndFileFields(dataset)
  }

  @action resetWithTemplate = async dataset => {
    this.resetQvainStore()
    this.loadBasicFields(dataset)
    this.ExternalResources.reset()
    this.setChanged(true)
  }

  @action setOriginal = newOriginal => {
    this.original = newOriginal
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
  get isNewVersion() {
    return queryParamEnabled(this.Env.history.location, 'new_version')
  }

  @computed
  get canSelectFiles() {
    if (this.readonly || this.isPas || this.deprecated || !this.Files.userHasRightsToEditProject) {
      return false
    }

    if (this.hasBeenPublished && !this.isNewVersion) {
      if (
        this.Files &&
        (!this.Files.projectLocked || this.Files.draftOfHasProject === false) &&
        this.Files.userHasRightsToEditProject
      ) {
        return true // for published noncumulative datasets, allow adding files only if none exist yet
      }
      return this.isCumulative
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
  get hasBeenPublishedWithDoi() {
    const hasDoi = this.original?.research_dataset?.preferred_identifier?.startsWith('doi')
    const draftOfHasDoi = this.original?.draft_of?.preferred_identifier?.startsWith('doi')
    return !!(this.hasBeenPublished && (hasDoi || draftOfHasDoi))
  }

  @computed
  get readonly() {
    if (this.Env?.Flags.flagEnabled('PERMISSIONS.WRITE_LOCK') && this.Lock.enabled) {
      if (this.original && !this.Lock.haveLock) {
        return true
      }
    }
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

export default Qvain
