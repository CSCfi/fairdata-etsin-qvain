import { makeObservable, override } from 'mobx'
import axios from 'axios'
import { ValidationError } from 'yup'
import { qvainFormSchema } from './qvain.submit.schemas'
import { DATASET_STATE } from '../../../utils/constants'
import { getResponseError } from '../../../components/qvain/utils/responseError'
import Submit from './qvain.submit'

class SubmitV3 extends Submit {
  constructor(Qvain) {
    super()
    this.Qvain = Qvain
    makeObservable(this)
  }

  @override get submitType() {
    const { original } = this.Qvain
    if (!original) {
      return DATASET_STATE.NEW
    }
    return DATASET_STATE.DRAFT
  }

  @override async exec(submitFunction, schema = qvainFormSchema) {
    const {
      OtherIdentifiers: { cleanupBeforeBackend },
      editDataset,
      Lock,
      Adapter: { convertQvainV2ToV3 },
      original,
      Files,
    } = this.Qvain

    const isNew = !!original

    this.response = undefined
    this.error = undefined

    if (this.isLoading) {
      return
    }

    try {
      this.setLoading(true)
      if (Lock) {
        await Lock.request()
      }

      const draftFunction = submitFunction.draftFunction || submitFunction

      if (!cleanupBeforeBackend()) return
      if (!(await this.promptProvenances())) return

      const dataset = this.prepareDataset()

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
        dataset.fileset = Files.actionsToMetax()
        const v3Dataset = convertQvainV2ToV3(dataset)

        const updatedDataset = await draftFunction(v3Dataset)
        await editDataset(updatedDataset)
        this.setResponse({ ...updatedDataset, is_new: isNew })
        this.clearError()
      } catch (error) {
        console.error(error)
        this.setError(getResponseError(error))
        throw error
      }
    } finally {
      this.setLoading(false)
    }
  }

  createNewDraft = async dataset => {
    const url = this.Qvain.Env.metaxV3Url('datasets')
    const { data } = await axios.post(url, dataset, {
      params: { draft: true },
    })
    return data
  }

  updateDataset = async dataset => {
    const url = this.Qvain.Env.metaxV3Url('dataset', dataset.id)
    const { data } = await axios.put(url, dataset)
    return data
  }

  publishNewDataset = {
    // Publishes a new dataset by creating a draft and publishing it
    draftFunction: this.createNewDraft,
  }

  publishDraft = {
    // Updates and publishes a draft
    draftFunction: this.updateDataset,
  }

  mergeDraft = {
    // Updates draft and merges it to the published dataset
    draftFunction: this.updateDataset,
  }

  republish = {
    // Saves changes as a draft and merges it to the published dataset
    draftFunction: this.updateDataset,
  }
}

export default SubmitV3
