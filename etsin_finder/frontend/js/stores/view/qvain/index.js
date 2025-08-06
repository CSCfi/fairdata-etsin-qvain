import { observable, action, computed, makeObservable, toJS } from 'mobx'
import { cumulativeStateSchema, useDoiSchema, dataCatalogSchema } from './qvain.dataCatalog.schemas'
import {
  CUMULATIVE_STATE,
  DATA_CATALOG_IDENTIFIER,
  REMOTE_RESOURCES_DATA_CATALOGS,
  FILES_DATA_CATALOGS,
} from '../../../utils/constants'
import Sections from './qvain.sections'

import ReferenceData from './qvain.referenceData'
import Resources from './qvain.resources'
import createQvainFilesStore from './qvain.files'
import Submit from './qvain.submit'
import SubmitV3 from './qvain.submit.v3'
import Lock from './qvain.lock'
import track, { touch } from './track'
import queryParamEnabled from '@/utils/queryParamEnabled'
import Adapter from './qvain.adapter'
import remapActorIdentifiers from '@/utils/remapActorIdentifiers'
import Modals from './structural/qvain.modal.v3'
import AbortClient, { ignoreAbort, isAbort } from '@/utils/AbortClient'
import urls from '@/utils/urls'

class Qvain extends Resources {
  constructor(Env, Auth, Locale, OrgReferences) {
    super(Env, OrgReferences)
    makeObservable(this)
    this.OrgReferences = OrgReferences
    this.Env = Env
    this.Auth = Auth
    this.Locale = Locale
    this.ReferenceData = new ReferenceData(this)
    this.SubmitV2 = new Submit(this, this.Env)
    this.SubmitV3 = new SubmitV3(this, this.Env)
    this.Sections = new Sections({ parent: this })
    this.Files = createQvainFilesStore(this, Auth)
    this.Adapter = new Adapter(this)
    this.resetQvainStore()
    this.Lock = new Lock(this, Auth)
    this.Modals = new Modals()
  }

  @computed get Submit() {
    if (this.Env.Flags.flagEnabled('QVAIN.METAX_V3.FRONTEND')) {
      return this.SubmitV3
    }
    return this.SubmitV2
  }

  cumulativeStateSchema = cumulativeStateSchema

  useDoiSchema = useDoiSchema

  dataCatalogSchema = dataCatalogSchema

  @observable original = undefined // used if editing, otherwise undefined

  @observable changed = false // has dataset been changed

  @observable deprecated = false

  @observable unsupported = null

  @action
  resetQvainStore = () => {
    this.client.abort()
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
    this.showFileMetadata = false

    this.ExternalResources.reset()
    this.resources.forEach(r => {
      if (r.controller?.reset) {
        r.controller.reset()
      } else {
        r.reset()
      }
    })

    this.useDoi = false
    this.defaultDoi = true

    this.changed = false
    this.deprecated = false

    this.Submit.reset()
    this.Sections.collapseAll()
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

  @observable defaultDoi = true

  @observable cumulativeState = CUMULATIVE_STATE.NO

  // Used for updating cumulative state separately from rest of dataset in v2
  @observable newCumulativeState = CUMULATIVE_STATE.NO

  @observable inEdit = undefined

  @observable metadataModalFile = undefined

  @observable clearMetadataModalFile = undefined

  @observable promptLooseActors = undefined

  @observable promptLooseProvenances = undefined

  @observable provenancesWithNonExistingActors = []

  client = new AbortClient()

  @observable datasetLoading = false

  @observable datasetError = null

  @observable showFileMetadata = false

  @action.bound setDatasetLoading(value) {
    this.datasetLoading = value
  }

  @action.bound setDatasetError(value) {
    this.datasetError = value
  }

  @action.bound
  async fetchDataset(identifier, { isTemplate = false } = {}) {
    this.client.abort()
    const { metaxV3Url } = this.Env
    this.datasetLoading = true
    this.datasetError = null

    try {
      let result
      let nextDraft
      if (this.Env.Flags.flagEnabled('QVAIN.METAX_V3.FRONTEND')) {
        const url = metaxV3Url('dataset', identifier)
        result = await this.client.get(url)
        nextDraft = result.data.next_draft?.id
      } else {
        const url = urls.qvain.dataset(identifier)
        result = await this.client.get(url)
        nextDraft = result.data.next_draft?.identifier
      }
      this.resetQvainStore()

      // Open draft instead if it exists
      if (nextDraft && !isTemplate) {
        return this.fetchDataset(nextDraft)
      }

      if (isTemplate) {
        this.resetWithTemplate(result.data)
      } else {
        ignoreAbort(() => this.editDataset(result.data))
      }
      this.setDatasetError(null)
    } catch (e) {
      this.handleFetchDatasetError(e)
    } finally {
      this.setDatasetLoading(false)
    }
  }

  handleFetchDatasetError(e) {
    if (isAbort(e)) {
      return
    }
    const status = e.response.status

    let errorTitle, errorDetails
    if (status === 401 || status === 403) {
      errorTitle = 'qvain.error.permission'
    } else if (status === 404) {
      errorTitle = 'qvain.error.missing'
    } else {
      errorTitle = 'qvain.error.default'
    }

    if (typeof e.response.data === 'object') {
      const values = Object.values(e.response.data)
      if (values.length === 1) {
        errorDetails = values[0]
      } else {
        errorDetails = JSON.stringify(e.response.data, null, 2)
      }
    } else {
      errorDetails = e.response.data
    }
    if (!errorDetails) {
      errorDetails = e.message
    }

    this.setDatasetError({
      title: errorTitle,
      details: errorDetails,
    })
  }

  @action
  setDataCatalog = selectedDataCatalog => {
    this.dataCatalog = selectedDataCatalog
    this.setChanged(true)

    // Remove useDoi if dataCatalog is ATT
    if (selectedDataCatalog === DATA_CATALOG_IDENTIFIER.ATT) {
      this.setUseDoi(false)
    }

    /*When IDA is selected as the catalog, the DOI value is set to the 
    user-selected value. If the user hasn't changed the value, it'll be true 
    by default: */
    if (selectedDataCatalog === DATA_CATALOG_IDENTIFIER.IDA) {
      this.setUseDoi(this.defaultDoi)
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
  setDefaultDoi = isChecked => {
    this.defaultDoi = isChecked
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

  @action
  setShowFileMetadata = selectedShowFileMetadata => {
    this.showFileMetadata = selectedShowFileMetadata
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
    this.resources.forEach(r => {
      if (r.adapter?.fromMetaxV3) {
        r.adapter.fromMetaxV3(researchDataset[r.adapter.V3FieldName])
      } else {
        r.fromBackend(researchDataset, this, tracker)
      }
    })

    this.unsupported = tracker.getUnused({ deep: true })
  }

  // load fields that won't be duplicated by template copy
  @action loadStatusAndFileFields = async dataset => {
    this.deprecated = dataset.deprecated

    // Load data catalog
    this.dataCatalog = dataset.data_catalog?.identifier

    const researchDataset = dataset.research_dataset

    // Load preservation state
    this.preservationState = dataset.preservation_state

    // New version should leave some fields with default values
    if (this.isNewVersion) {
      this.deprecated = false
      this.preservationState = 0
    }

    // Load cumulative state
    this.cumulativeState =
      dataset.cumulative_state === CUMULATIVE_STATE.YES ? CUMULATIVE_STATE.YES : CUMULATIVE_STATE.NO
    this.newCumulativeState = this.cumulativeState

    // Load DOI
    if (researchDataset?.preferred_identifier?.startsWith('doi') || dataset.use_doi_for_published) {
      this.useDoi = true
      this.defaultDoi = true
    } else {
      this.useDoi = false
      this.defaultDoi = false
    }

    // Load files
    await this.Files.openDataset(dataset)
  }

  @action editDataset = async dataset => {
    this.resetQvainStore()
    this.Submit.reset()
    let v2Dataset = dataset
    if (this.Env.Flags.flagEnabled('QVAIN.METAX_V3.FRONTEND')) {
      v2Dataset = this.Adapter.convertV3ToV2(dataset)
      this.showFileMetadata =
        dataset.access_rights.show_file_metadata !== null
          ? dataset.access_rights.show_file_metadata
          : false
    }
    this.setChanged(false)
    this.original = { ...v2Dataset }
    this.loadBasicFields(v2Dataset)
    await this.loadStatusAndFileFields(v2Dataset)
    this.Sections.expandPopulatedSections(v2Dataset.research_dataset)
  }

  @action resetWithTemplate = async dataset => {
    this.resetQvainStore()
    let v2Dataset = dataset
    if (this.Env.Flags.flagEnabled('QVAIN.METAX_V3.FRONTEND')) {
      remapActorIdentifiers(dataset) // can't reuse actor ids in new dataset
      v2Dataset = this.Adapter.convertV3ToV2(dataset)
      this.showFileMetadata =
        dataset.access_rights.show_file_metadata !== null
          ? dataset.access_rights.show_file_metadata
          : false
    }
    this.loadBasicFields(v2Dataset)
    this.OtherIdentifiers.reset()
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
  get isPreserved() {
    return this.preservationState === 120
  }

  @computed
  get isPas() {
    return !!(
      this.dataCatalog === DATA_CATALOG_IDENTIFIER.PAS ||
      this.preservationState > 0 ||
      this.original?.preservation_pas_process_running ||
      this.original?.preservation_pas_package_created
    )
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
      const hasNoPublishedFiles =
        this.Files.hasPublishedFiles === false || // V3
        !this.Files.projectLocked ||
        this.Files.draftOfHasProject === false // V2
      if (hasNoPublishedFiles) {
        return true // for published noncumulative datasets, allow adding files only if none exist yet
      }
      return this.isCumulative
    }

    return true
  }

  @computed
  get canRemoveFiles() {
    return (
      this.canSelectFiles && (!this.hasBeenPublished || !this.isCumulative || this.isNewVersion)
    )
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

  @computed get hasSelectedFiles() {
    return this.Files.hasSelectedItems
  }

  @computed get hasExternalResources() {
    return !!this.ExternalResources?.storage?.length
  }

  @computed
  get originalHasInfrastructures() {
    return (this.original?.research_dataset?.infrastructure || []).length > 0
  }

  @computed
  get isDataCatalogDecided() {
    const isDataCatalogNotDecided =
      !this.original?.data_catalog ||
      this.original?.data_catalog?.identifier === DATA_CATALOG_IDENTIFIER.DFT
    return (
      this.hasSelectedFiles || this.hasExternalResources || !isDataCatalogNotDecided || this.isPas
    )
  }

  @computed
  get isREMSAllowed() {
    if (!this.Env?.Flags.flagEnabled('QVAIN.REMS')) {
      return false
    }
    return this.dataCatalog === DATA_CATALOG_IDENTIFIER.IDA
  }

  @computed
  get readonly() {
    if (this.Env?.Flags.flagEnabled('PERMISSIONS.WRITE_LOCK') && this.Lock?.enabled) {
      if (this.original && !this.Lock?.haveLock) {
        return true
      }
    }

    if (this.Env.Flags.flagEnabled('QVAIN.METAX_V3.FRONTEND')) {
      return !!this.original?.preservation_pas_process_running
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
