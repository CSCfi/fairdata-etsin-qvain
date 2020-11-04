import { makeObservable, observable, action, computed } from 'mobx'
import handleSubmitToBackend from '../../components/qvain/utils/handleSubmit'
import { qvainFormSchema } from '../../components/qvain/utils/formValidation'
import { DATA_CATALOG_IDENTIFIER } from '../../utils/constants'

const DATASET_STATE = {
  NEW: 'NEW',
  DRAFT: 'DRAFT',
  UNKNOWN: 'UNKNOWN',
}

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

  @action clearResponse = () => {
    this.response = null
  }

  @action closeUseDoiModal = () => {
    this.useDoiModalIsOpen = false
  }

  @action openUseDoiModal = () => {
    this.useDoiModalIsOpen = true
  }

  @action exec = async submitFunction => {
    const isProvenanceActorsOk = await this.Qvain.checkProvenanceActors()
    const isOtherIdentifiersValid = this.Qvain.cleanupOtherIdentifiers()
    if (!isProvenanceActorsOk || !isOtherIdentifiersValid) {
      return
    }

    this.closeUseDoiModal()
    this.Qvain.addUnsavedMultiValueFields()
    const payload = handleSubmitToBackend(this.Qvain.Env, this.Qvain)

    try {
      await this.checkDoiCompability(payload)
      await qvainFormSchema.validate(payload)
      this.setLoading(true)
      await submitFunction(payload)
    } catch (error) {
      this.setError(error)
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  @action submitDraft = async () => {
    switch (this.submitType) {
      case DATASET_STATE.NEW:
        await this.exec(this.createNewDraft)
        return
      case DATASET_STATE.DRAFT:
        await this.exec(this.updateDraft)
        return
      default:
        console.error('Unknown submit status')
    }
  }

  @action submitPublish = async () => {
    switch (this.submitType) {
      case DATASET_STATE.NEW:
        await this.exec(this.publishNewDataset)
        return
      default:
        console.error('Unknown submit status')
    }
  }

  checkDoiCompability = payload => {
    return new Promise((res, rej) => {
      if (!payload.useDoi) res()
      if (payload.useDoi && payload.dataCatalog === DATA_CATALOG_IDENTIFIER.IDA) res()
      rej(new Error('Doi can be used only with Ida datasets.'))
    })
  }

  createNewDraft = () => {}

  updateDraft = () => {}

  publishNewDataset = () => {}

  @computed get submitType() {
    const { original } = this.Qvain
    if (!original) {
      return DATASET_STATE.NEW
    }
    if (original && original.state === 'draft') {
      return DATASET_STATE.DRAFT
    }

    return DATASET_STATE.UNKNOWN
  }
}

export default Submit
