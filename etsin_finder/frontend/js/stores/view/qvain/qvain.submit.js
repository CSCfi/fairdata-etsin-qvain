import { makeObservable, observable, action, computed } from 'mobx'
import axios from 'axios'
import { ValidationError } from 'yup'
import handleSubmitToBackend from '../../../components/qvain/utils/handleSubmit'
import { qvainFormSchema } from '../../../components/qvain/utils/formValidation'
import { DATA_CATALOG_IDENTIFIER, DATASET_STATE } from '../../../utils/constants'
import urls from '../../../components/qvain/utils/urls'

// helper functions
const isActionsEmpty = actions => actions.files.length === 0 && actions.directories.length === 0

class Submit {
  constructor(Qvain) {
    this.Qvain = Qvain
    makeObservable(this)
  }

  @observable isLoading = false

  @observable error = undefined

  @observable response = null

  @observable useDoiModalIsOpen = false

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

  @action submitDraft = async () => {
    switch (this.submitType) {
      case DATASET_STATE.NEW:
        await this.exec(this.createNewDraft)
        return
      case DATASET_STATE.DRAFT:
      case DATASET_STATE.UNPUBLISHED_DRAFT:
        await this.exec(this.updateDataset)
        return
      case DATASET_STATE.PUBLISHED:
        await this.exec(this.savePublishedAsDraft)
        return
      default:
        console.error('Unknown submit status')
        throw new Error('Unknown submit status')
    }
  }

  @action submitPublish = async () => {
    switch (this.submitType) {
      case DATASET_STATE.NEW:
        await this.exec(this.publishNewDataset)
        return
      case DATASET_STATE.DRAFT:
        await this.exec(this.publishDraft)
        return
      case DATASET_STATE.UNPUBLISHED_DRAFT:
        await this.exec(this.mergeDraft)
        return
      case DATASET_STATE.PUBLISHED:
        await this.exec(this.republish)
        return
      default:
        console.error('Unknown submit status')
        throw new Error('Unknown submit status')
    }
  }

  @action exec = async (submitFunction, schema = qvainFormSchema) => {
    const {
      OtherIdentifiers: { cleanupBeforeBackend },
      editDataset,
      setChanged,
    } = this.Qvain

    if (!cleanupBeforeBackend()) return
    if (!(await this.promptProvenancesAndCleanOtherIdentifiers())) return

    this.closeUseDoiModal()
    const dataset = this.prepareDataset()
    const { fileActions, metadataActions, newCumulativeState } = this.prepareActions()

    try {
      await schema.validate(dataset)
      // kind of overrules the other validation errors.
      // Will be fixed in CSCFAIRMETA-542.
      await this.checkDoiCompability(dataset)
      this.setLoading(true)
      const { data } = await submitFunction(dataset)
      await this.updateFiles(data.identifier, fileActions, metadataActions)
      setChanged(false)

      if (fileActions || metadataActions || newCumulativeState) {
        // Files changed, get updated dataset
        const url = urls.v2.dataset(data.identifier)
        const updatedResponse = await axios.get(url)
        await editDataset(updatedResponse.data)
      } else {
        await editDataset(data)
      }
      this.setResponse(data)
      this.setError(undefined)
    } catch (error) {
      this.setError(error)
      this.setResponse(undefined)
      if (!(error instanceof ValidationError)) {
        console.error(error)
      }
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
    const res = await this.createNewDraft(dataset)
    // Publishes an unpublished draft dataset
    const url = urls.v2.rpc.publishDataset()
    const resp = await axios.post(url, null, { params: { identifier: res.data.identifier } })
    return resp
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

  @action promptProvenancesAndCleanOtherIdentifiers = async () => {
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
}

export default Submit
