import { makeObservable, override } from 'mobx'
import axios from 'axios'
import { ValidationError } from 'yup'
import { qvainFormSchemaV3 } from './qvain.submit.schemas'
import { getResponseError } from '../../../components/qvain/utils/responseError'
import Submit from './qvain.submit'
import remapActorIdentifiers from '@/utils/remapActorIdentifiers'

class SubmitV3 extends Submit {
  constructor(Qvain) {
    super()
    this.Qvain = Qvain
    makeObservable(this)
  }

  qvainFormSchema = qvainFormSchemaV3

  @override async exec(submitFunction, schema = qvainFormSchemaV3) {
    const {
      OtherIdentifiers: { cleanupBeforeBackend },
      editDataset,
      Lock,
      Adapter: { convertQvainV2ToV3 },
      original,
      Files,
    } = this.Qvain

    const isNew = !original

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
        let v3Dataset = convertQvainV2ToV3(dataset)
        if (this.Qvain.isNewVersion) {
          v3Dataset = await this.createNewVersion(v3Dataset)
        }
        if (draftFunction) {
          v3Dataset = await draftFunction(v3Dataset)
        }
        if (publishFunction) {
          v3Dataset = await publishFunction(v3Dataset)
        }
        await editDataset(v3Dataset)
        this.setResponse({ ...v3Dataset, is_new: isNew })
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

  createNewPublished = async dataset => {
    const url = this.Qvain.Env.metaxV3Url('datasets')
    const { data } = await axios.post(url, { ...dataset, state: 'published' })
    return data
  }

  createNewDraft = async dataset => {
    const url = this.Qvain.Env.metaxV3Url('datasets')
    const { data } = await axios.post(url, dataset)
    return data
  }

  createNewVersion = async dataset => {
    // Creates new version but does not update it.
    // Would be better if this was turned into a draftFunction
    // that also updates the new version but that needs more refactoring.
    const url = this.Qvain.Env.metaxV3Url('datasetNewVersion', dataset.id)
    const { data } = await axios.post(url)

    remapActorIdentifiers(dataset)
    return {
      ...dataset,
      id: data.id,
    }
  }

  updateDataset = async dataset => {
    const url = this.Qvain.Env.metaxV3Url('dataset', dataset.id)
    const { data } = await axios.patch(url, dataset)
    return data
  }

  publishDataset = async dataset => {
    const url = this.Qvain.Env.metaxV3Url('datasetPublish', dataset.id)
    const { data } = await axios.post(url)
    return data
  }

  savePublishedAsDraft = async dataset => {
    const url = this.Qvain.Env.metaxV3Url('datasetCreateDraft', dataset.id)
    const res = await axios.post(url)

    remapActorIdentifiers(dataset)
    const data = await this.updateDataset({ ...dataset, id: res.data.id })
    return { ...data, is_draft: true }
  }

  publishNewDataset = {
    // Creates new published dataset directly
    publishFunction: this.createNewPublished,
  }

  publishDraft = {
    // Updates and publishes a draft
    draftFunction: this.updateDataset,
    publishFunction: this.publishDataset,
  }

  mergeDraft = {
    // Updates draft and merges it to the published dataset
    draftFunction: this.updateDataset,
    publishFunction: this.publishDataset,
  }

  republish = {
    // Updates published dataset directly
    publishFunction: this.updateDataset,
  }
}

export default SubmitV3
