import { makeObservable, observable, action, computed } from 'mobx'
import axios from 'axios'
import { ValidationError } from 'yup'
import debounce from 'lodash.debounce'
import handleSubmitToBackend from '../../../components/qvain/utils/handleSubmit'
import {
  qvainFormSchema,
  qvainFormSchemaDraft,
} from '../../../components/qvain/utils/formValidation'
import { DATA_CATALOG_IDENTIFIER, DATASET_STATE } from '../../../utils/constants'
import urls from '../../../components/qvain/utils/urls'
import { getResponseError } from '../../../components/qvain/utils/responseError'

// helper functions
const isActionsEmpty = actions => actions.files.length === 0 && actions.directories.length === 0

class Submit {
  constructor(Qvain) {
    this.Qvain = Qvain
    makeObservable(this)
  }

  @observable isLoading = false

  @observable error = undefined

  @observable draftValidationError = []

  @observable publishValidationError = []

  @observable response = null

  @observable useDoiModalIsOpen = false

  @action reset = () => {
    this.isLoading = false
    this.draftValidationError = []
    this.publishValidationError = []
    this.error = undefined
    this.response = null
    this.useDoiModalIsOpen = false
  }

  @action setLoading = state => {
    this.isLoading = state
  }

  @action setError = error => {
    this.error = error
  }

  @action setResponse = response => {
    this.response = response
  }

  @action clearResponse = () => {
    this.response = null
  }

  @action closeUseDoiModal = () => {
    this.useDoiModalIsOpen = false
  }

  @action openUseDoiModal = () => {
    this.useDoiModalIsOpen = true
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
        await this.exec(this.createNewDraft, qvainFormSchemaDraft)
        return
      case DATASET_STATE.DRAFT:
      case DATASET_STATE.UNPUBLISHED_DRAFT:
        await this.exec(this.updateDataset, qvainFormSchemaDraft)
        return
      case DATASET_STATE.PUBLISHED:
        await this.exec(this.savePublishedAsDraft, qvainFormSchemaDraft)
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
    if (this.response?.identifier && cb) cb(this.response.identifier)
  }

  @action exec = async (submitFunction, schema = qvainFormSchema) => {
    const {
      OtherIdentifiers: { cleanupBeforeBackend },
      editDataset,
      setChanged,
    } = this.Qvain
    this.response = undefined
    this.error = undefined

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

    this.closeUseDoiModal()
    let dataset = this.prepareDataset()
    const { fileActions, metadataActions, newCumulativeState } = this.prepareActions()

    try {
      await schema.validate(dataset)
      await this.checkDoiCompability(dataset)
    } catch (error) {
      this.setLoading(false)
      this.setError(error)
      if (error instanceof ValidationError) {
        return
      }
      console.error(error)
      throw error
    }

    try {
      this.setLoading(true)
      if (draftFunction) {
        const updatedOriginal = await draftFunction(dataset)
        dataset = {
          ...dataset,
          original: updatedOriginal
        }
      }
      await this.updateFiles(dataset.original.identifier, fileActions, metadataActions)
      setChanged(false)

      if (newCumulativeState != null && this.Qvain.original) {
        const obj = {
          identifier: this.Qvain.original.identifier,
          cumulative_state: this.Qvain.newCumulativeState,
        }

        const url = urls.v2.rpc.changeCumulativeState()
        await axios.post(url, obj)
      }

      if (publishFunction) {
        const updatedOriginal = await publishFunction(dataset)
        dataset = {
          ...dataset,
          original: updatedOriginal
        }
      }
      if (fileActions || metadataActions || newCumulativeState != null) {
        // Files changed, get updated dataset
        const url = urls.v2.dataset(dataset.original.identifier)
        const updatedResponse = await axios.get(url)
        dataset.original = updatedResponse.data
      }
      this.Qvain.setOriginal(dataset.original)
      await editDataset(dataset.original)
      this.setResponse(dataset.original)
      this.setError(undefined)
    } catch (error) {
      this.setError(getResponseError(error))
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  createNewDraft = async dataset => {
    const datasetsUrl = urls.v2.datasets()
    const { data } = await axios.post(datasetsUrl, dataset, { params: { draft: true } })
    return data
  }

  updateDataset = async dataset => {
    const url = urls.v2.dataset(dataset.original.identifier)
    const { data } = await axios.patch(url, dataset)
    return data
  }

  savePublishedAsDraft = async dataset => {
    const { identifier } = dataset.original
    const res = await axios.post(urls.v2.rpc.createDraft(), null, { params: { identifier } })
    const newIdentifier = res.data.identifier

    const draftUrl = await urls.v2.dataset(newIdentifier)
    const draftResponse = await axios.get(draftUrl)
    const draft = draftResponse.data

    const data = await this.updateDataset({ ...dataset, original: draft })
    return { ...data, is_draft: true }
  }

  publishWithoutUpdating = async dataset => {
    const url = urls.v2.rpc.publishDataset()
    const { identifier } = dataset.original
    const { data } = await axios.post(url, null, { params: { identifier } })
    return { ...dataset.original, ...data }
  }

  mergeDraftWithoutUpdating = async dataset => {
    const { original } = dataset
    const identifier = original?.identifier
    const url = urls.v2.rpc.mergeDraft()
    await axios.post(url, null, { params: { identifier } })

    const draftOf = original?.draft_of?.identifier
    const editUrl = urls.v2.dataset(draftOf)
    const { data } = await axios.get(editUrl)
    return data
  }

  publishNewDataset = {
    // Publishes a new dataset by creating a draft and publishing it
    draftFunction: this.createNewDraft,
    publishFunction: this.publishWithoutUpdating
  }

  publishDraft = {
    // Updates and publishes a draft
    draftFunction: this.updateDataset,
    publishFunction: this.publishWithoutUpdating
  }

  mergeDraft = {
    // Updates draft and merges it to the published dataset
    draftFunction: this.updateDataset,
    publishFunction: this.mergeDraftWithoutUpdating
  }

  republish = {
    // Saves changes as a draft and merges it to the published dataset
    draftFunction: this.savePublishedAsDraft,
    publishFunction: this.mergeDraftWithoutUpdating
  }

  @action promptProvenances = async () => {
    const isProvenanceActorsOk = await this.Qvain.Actors.checkProvenanceActors()
    if (!isProvenanceActorsOk) {
      return false
    }
    return true
  }

  @action prepareDataset = () => {
    const dataset = handleSubmitToBackend(this.Qvain.Env, this.Qvain)
    delete dataset.directories
    delete dataset.files
    return dataset
  }

  @action prepareActions = () => {
    const {
      original,
      Files,
      canRemoveFiles,
      canSelectFiles,
      newCumulativeState,
      cumulativeState,
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

    if (newCumulativeState !== undefined && newCumulativeState !== cumulativeState) {
      values.newCumulativeState = newCumulativeState
    }
    return values
  }

  @action updateFiles = async (identifier, fileActions, metadataActions) => {
    if (fileActions) {
      await axios.post(urls.v2.datasetFiles(identifier), fileActions)
    }
    if (metadataActions) {
      await axios.put(urls.v2.datasetUserMetadata(identifier), metadataActions)
    }
  }

  checkDoiCompability = payload =>
    new Promise((res, rej) => {
      if (!payload.useDoi) res()
      if (payload.useDoi && payload.dataCatalog === DATA_CATALOG_IDENTIFIER.ATT) {
        rej(new ValidationError('Doi can be used only with Ida datasets.'))
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
      await qvainFormSchema.validate(dataset, { abortEarly: false })
    } catch (error) {
      this.setPublishValidationError(error)
    }

    try {
      await qvainFormSchemaDraft.validate(dataset, { abortEarly: false })
    } catch (error) {
      this.setDraftValidationError(error)
    }
  }, 200)
}

export default Submit
