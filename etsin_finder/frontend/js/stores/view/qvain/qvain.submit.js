import { makeObservable, observable, action, computed } from 'mobx'
import axios from 'axios'
import { ValidationError } from 'yup'
import debounce from 'lodash.debounce'
import handleSubmitToBackend from '../../../components/qvain/utils/handleSubmit'
import { qvainFormSchema, qvainFormDraftSchema } from './qvain.submit.schemas'
import { DATA_CATALOG_IDENTIFIER, DATASET_STATE, CUMULATIVE_STATE } from '../../../utils/constants'
import urls from '../../../utils/urls'
import { getResponseError } from '../../../components/qvain/utils/responseError'

// helper functions
const isActionsEmpty = actions => actions.files.length === 0 && actions.directories.length === 0

class Submit {
  constructor(Qvain) {
    this.Qvain = Qvain
    makeObservable(this)
  }

  qvainFormDraftSchema = qvainFormDraftSchema

  qvainFormSchema = qvainFormSchema

  @observable isLoading = false

  @observable error = undefined

  @observable draftValidationError = []

  @observable publishValidationError = []

  @observable response = null

  @action reset = () => {
    this.draftValidationError = []
    this.publishValidationError = []
    this.error = undefined
    this.response = null
  }

  @action setLoading = state => {
    this.isLoading = state
  }

  @action setError = error => {
    this.error = error
  }

  @action.bound clearError() {
    this.error = undefined
  }

  @action setResponse = response => {
    this.response = response
  }

  @action.bound clearResponse() {
    this.response = null
  }

  @computed get submitType() {
    const { original } = this.Qvain
    if (!original) {
      return DATASET_STATE.NEW
    }
    if (original.state === 'draft') {
      if (original.draft_of) return DATASET_STATE.UNPUBLISHED_DRAFT

      return DATASET_STATE.DRAFT
    }

    // new versions are initially created as drafts
    if (this.Qvain.isNewVersion) {
      return DATASET_STATE.DRAFT
    }

    return DATASET_STATE.PUBLISHED
  }

  @computed get isDraftButtonDisabled() {
    if (!this.draftValidationError) return false
    if (this.draftValidationError.length === 0) return false
    return true
  }

  @computed get isPublishButtonDisabled() {
    if (!this.publishValidationError) return false
    if (this.publishValidationError.length === 0) return false
    return true
  }

  @action submitDraft = async () => {
    switch (this.submitType) {
      case DATASET_STATE.NEW:
        await this.exec(this.createNewDraft, qvainFormDraftSchema)
        return
      case DATASET_STATE.DRAFT:
      case DATASET_STATE.UNPUBLISHED_DRAFT:
        await this.exec(this.updateDataset, qvainFormDraftSchema)
        return
      case DATASET_STATE.PUBLISHED:
        await this.exec(this.savePublishedAsDraft, qvainFormDraftSchema)
        return
      default:
        console.error('Unknown submit status')
        throw new Error('Unknown submit status')
    }
  }

  @action submitPublish = async cb => {
    switch (this.submitType) {
      case DATASET_STATE.NEW:
        await this.exec(this.publishNewDataset)
        break
      case DATASET_STATE.DRAFT:
        await this.exec(this.publishDraft)
        break
      case DATASET_STATE.UNPUBLISHED_DRAFT:
        await this.exec(this.mergeDraft)
        break
      case DATASET_STATE.PUBLISHED:
        await this.exec(this.republish)
        break
      default:
        console.error('Unknown submit status')
        throw new Error('Unknown submit status')
    }
    if (this.response?.identifier && cb) {
      cb(this.response.identifier)
    }
  }

  createNewVersion = async dataset => {
    const { identifier } = dataset.original
    const resp = await axios.post(urls.rpc.createNewVersion(), null, {
      params: { identifier },
    })
    const newVersionUrl = urls.qvain.dataset(resp.data.identifier)
    const { data } = await axios.get(newVersionUrl)
    return data
  }

  @action.bound async exec(submitFunction, schema = qvainFormSchema) {
    const {
      OtherIdentifiers: { cleanupBeforeBackend },
      editDataset,
      setChanged,
      Lock,
      original,
    } = this.Qvain
    this.response = undefined
    this.error = undefined
    const isNew = !!original

    if (this.isLoading) {
      return
    }

    try {
      this.setLoading(true)
      if (Lock) {
        await Lock.request()
      }

      let draftFunction
      let publishFunction
      if (submitFunction.draftFunction || submitFunction.publishFunction) {
        draftFunction = submitFunction.draftFunction
        publishFunction = submitFunction.publishFunction
      } else {
        draftFunction = submitFunction
      }

      if (!cleanupBeforeBackend()) return
      if (!(await this.promptProvenances())) return

      let dataset = this.prepareDataset()
      const { fileActions, metadataActions, newCumulativeState } = this.prepareActions()

      try {
        await schema.validate(dataset, { strict: true })
        await this.checkDoiCompability(dataset)
      } catch (error) {
        this.setError(error)
        if (error instanceof ValidationError) {
          return
        }
        console.error(error)
        throw error
      }

      try {
        this.setLoading(true)
        if (this.Qvain.isNewVersion) {
          const newVersion = await this.createNewVersion(dataset)
          dataset = {
            ...dataset,
            cumulative_state: newVersion.cumulative_state,
            original: newVersion,
          }
        }

        if (draftFunction) {
          const updatedOriginal = await draftFunction(dataset)
          dataset = {
            ...dataset,
            original: updatedOriginal,
          }
        }
        await this.updateFiles(dataset.original.identifier, fileActions, metadataActions)

        if (this.Qvain.original) {
          await this.updateCumulativeState(dataset.original.identifier, newCumulativeState)
        }
        setChanged(false)

        if (publishFunction) {
          const updatedOriginal = await publishFunction(dataset)
          dataset = {
            ...dataset,
            original: updatedOriginal,
          }
        }
        if (fileActions || metadataActions || newCumulativeState != null) {
          // Files changed, get updated dataset
          const url = urls.qvain.dataset(dataset.original.identifier)
          const updatedResponse = await axios.get(url)
          dataset.original = updatedResponse.data
        }
        this.Qvain.setOriginal(dataset.original)
        await editDataset(dataset.original)
        this.setResponse({ ...dataset.original, is_new: isNew })
        this.clearError()
      } catch (error) {
        this.setError(getResponseError(error))
        throw error
      }
    } finally {
      this.setLoading(false)
    }
  }

  createNewDraft = async dataset => {
    const datasetsUrl = urls.qvain.datasets()
    const { data } = await axios.post(datasetsUrl, dataset, { params: { draft: true } })
    return data
  }

  updateDataset = async dataset => {
    const url = urls.qvain.dataset(dataset.original.identifier)
    const { data } = await axios.patch(url, dataset)
    return data
  }

  savePublishedAsDraft = async dataset => {
    const { identifier } = dataset.original
    const res = await axios.post(urls.rpc.createDraft(), null, { params: { identifier } })
    const newIdentifier = res.data.identifier

    const draftUrl = await urls.qvain.dataset(newIdentifier)
    const draftResponse = await axios.get(draftUrl)
    const draft = draftResponse.data

    const data = await this.updateDataset({ ...dataset, original: draft })
    return { ...data, is_draft: true }
  }

  publishWithoutUpdating = async dataset => {
    const url = urls.rpc.publishDataset()
    const { identifier } = dataset.original
    const { data } = await axios.post(url, null, { params: { identifier } })
    return { ...dataset.original, ...data }
  }

  mergeDraftWithoutUpdating = async dataset => {
    const { original } = dataset
    const identifier = original?.identifier
    const url = urls.rpc.mergeDraft()
    await axios.post(url, null, { params: { identifier } })

    const draftOf = original?.draft_of?.identifier
    const editUrl = urls.qvain.dataset(draftOf)
    const { data } = await axios.get(editUrl)
    return data
  }

  publishNewDataset = {
    // Publishes a new dataset by creating a draft and publishing it
    draftFunction: this.createNewDraft,
    publishFunction: this.publishWithoutUpdating,
  }

  publishDraft = {
    // Updates and publishes a draft
    draftFunction: this.updateDataset,
    publishFunction: this.publishWithoutUpdating,
  }

  mergeDraft = {
    // Updates draft and merges it to the published dataset
    draftFunction: this.updateDataset,
    publishFunction: this.mergeDraftWithoutUpdating,
  }

  republish = {
    // Saves changes as a draft and merges it to the published dataset
    draftFunction: this.savePublishedAsDraft,
    publishFunction: this.mergeDraftWithoutUpdating,
  }

  @action promptProvenances = async () => {
    const isProvenanceActorsOk = await this.Qvain.Actors.checkProvenanceActors()
    if (!isProvenanceActorsOk) {
      return false
    }
    return true
  }

  @action.bound prepareDataset() {
    return handleSubmitToBackend(this.Qvain)
  }

  @action.bound prepareActions() {
    const {
      original,
      Files,
      canRemoveFiles,
      canSelectFiles,
      newCumulativeState,
      cumulativeState,
      isNewVersion,
    } = this.Qvain

    const values = {}
    const fileActions = Files.actionsToMetax()
    const metadataActions = Files.metadataToMetax()

    const filesChanged = fileActions.files.length > 0 || fileActions.directories.length > 0
    const filesRemoved =
      fileActions.files.some(v => v.exclude) || fileActions.directories.some(v => v.exclude)

    if (original && (original.state === 'published' || original.draft_of)) {
      if (filesRemoved && !canRemoveFiles) {
        throw new Error('A new dataset version is needed for removing files')
      }
      if (filesChanged && !canSelectFiles) {
        throw new Error('A new dataset version or a cumulative dataset is needed for adding files')
      }
    }

    if (!isActionsEmpty(fileActions)) {
      values.fileActions = fileActions
    }

    if (!isActionsEmpty(metadataActions)) {
      values.metadataActions = metadataActions
    }

    const cumulativeStateChanged =
      newCumulativeState !== undefined && newCumulativeState !== cumulativeState
    const isDefaultCumulativeState = newCumulativeState === CUMULATIVE_STATE.NO
    if (cumulativeStateChanged || (isNewVersion && !isDefaultCumulativeState)) {
      values.newCumulativeState = newCumulativeState
    }
    return values
  }

  updateFiles = async (identifier, fileActions, metadataActions) => {
    if (fileActions) {
      await axios.post(urls.qvain.datasetFiles(identifier), fileActions)
    }
    if (metadataActions) {
      await axios.put(urls.common.datasetUserMetadata(identifier), metadataActions)
    }
  }

  updateCumulativeState = async (identifier, newCumulativeState) => {
    if (newCumulativeState != null) {
      const obj = {
        identifier,
        cumulative_state: newCumulativeState,
      }
      const url = urls.rpc.changeCumulativeState()
      await axios.post(url, obj)
    }
  }

  checkDoiCompability = payload =>
    new Promise((res, rej) => {
      if (!payload.use_doi) res()
      if (payload.use_doi && payload.data_catalog === DATA_CATALOG_IDENTIFIER.ATT) {
        rej(new ValidationError('DOI can be used only with IDA datasets.'))
      }
      res()
    })

  // validation
  @action setDraftValidationError = error => {
    this.draftValidationError = error
  }

  @action setPublishValidationError = error => {
    this.publishValidationError = error
  }

  @action prevalidate = debounce(async () => {
    this.setPublishValidationError([])
    this.setDraftValidationError([])
    const dataset = this.prepareDataset()

    try {
      await this.qvainFormSchema.validate(dataset, { abortEarly: false, strict: true })
    } catch (error) {
      this.setPublishValidationError(error)
    }

    try {
      await this.qvainFormDraftSchema.validate(dataset, { abortEarly: false, strict: true })
    } catch (error) {
      this.setDraftValidationError(error)
    }
  }, 200)
}

export default Submit
