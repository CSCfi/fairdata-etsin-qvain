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

    if (!cleanupBeforeBackend()) return
    if (!(await this.promptProvenances())) return

    this.closeUseDoiModal()
    const dataset = this.prepareDataset()
    const { fileActions, metadataActions, newCumulativeState } = this.prepareActions()

    try {
      await schema.validate(dataset)
      await this.checkDoiCompability(dataset)
    } catch (error) {
      if (error instanceof ValidationError) {
        this.setLoading(false)
        this.setError(error)
        return
      }
      if (!(error instanceof ValidationError)) {
        console.error(error)
        this.setLoading(false)
        this.setError(error)
        throw error
      }
    }

    try {
      this.setLoading(true)
      const { data } = await submitFunction(dataset)
      await this.updateFiles(data.identifier, fileActions, metadataActions)
      setChanged(false)

      if (newCumulativeState != null && this.Qvain.original) {
        const obj = {
          identifier: this.Qvain.original.identifier,
          cumulative_state: this.Qvain.newCumulativeState,
        }

        const url = urls.v2.rpc.changeCumulativeState()
        await axios.post(url, obj)
      }

      if (fileActions || metadataActions || newCumulativeState != null) {
        // Files changed, get updated dataset
        const url = urls.v2.dataset(data.identifier)
        const updatedResponse = await axios.get(url)
        this.Qvain.setOriginal(updatedResponse.data)
        await editDataset(updatedResponse.data)
      } else {
        await editDataset(data)
      }
      this.setResponse(data)
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
    const res = await axios.post(datasetsUrl, dataset, { params: { draft: true } })
    return res
  }

  updateDataset = async dataset => {
    const url = urls.v2.dataset(dataset.original.identifier)
    const res = await axios.patch(url, dataset)
    return res
  }

  savePublishedAsDraft = async dataset => {
    const { identifier } = dataset.original
    const res = await axios.post(urls.v2.rpc.createDraft(), null, { params: { identifier } })
    const newIdentifier = res.data.identifier

    const draftUrl = await urls.v2.dataset(newIdentifier)
    const draftResponse = await axios.get(draftUrl)
    const draft = draftResponse.data
    dataset.original = draft

    const resp = await this.updateDataset(dataset)
    resp.data.is_draft = true

    return resp
  }

  publishNewDataset = async dataset => {
    // Publishes a new dataset by creating a draft and publishing it
    const res = await this.createNewDraft(dataset)
    const url = urls.v2.rpc.publishDataset()
    await axios.post(url, null, { params: { identifier: res.data.identifier } })
    return res
  }

  publishDraft = async dataset => {
    const { identifier } = dataset.original
    const res = await this.updateDataset(dataset)
    const url = urls.v2.rpc.publishDataset()
    await axios.post(url, null, { params: { identifier } })
    return res
  }

  republish = async dataset => {
    const res = await this.updateDataset(dataset)
    return res
  }

  mergeDraft = async dataset => {
    const { original } = dataset
    const identifier = original && original.identifier
    const draftOf = original && original.draft_of && original.draft_of.identifier

    await this.updateDataset(dataset)

    const url = urls.v2.rpc.mergeDraft()
    await axios.post(url, null, { params: { identifier } })

    const editUrl = urls.v2.dataset(draftOf)
    const res = await axios.get(editUrl)
    return res
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
