import { makeObservable, observable, action, computed } from 'mobx'
import PromiseManager from '@/utils/promiseManager'
import AbortClient from '@/utils/AbortClient'

class EtsinDatasetRems {
  constructor({ EtsinDataset, Env }) {
    this.EtsinDataset = EtsinDataset
    this.Env = Env
    makeObservable(this)
    this.promiseManager = new PromiseManager()
    this.client = new AbortClient()
  }

  @observable showModal = false

  @observable applicationData

  @action.bound setShowModal(value) {
    this.showModal = value
  }

  @action.bound setApplicationData(value) {
    this.applicationData = value
  }

  @action.bound async fetchApplicationData() {
    if (this.isLoadingApplication) {
      return
    }
    const url = this.Env.metaxV3Url('datasetREMSApplicationData', this.EtsinDataset.identifier)
    try{
      const { data } = await this.promiseManager.add(this.client.get(url), 'application-data')
      this.setApplicationData(data)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  @computed get licenses() {
    return this.applicationData?.licenses || []
  }

  @computed get isLoadingApplication() {
    return this.promiseManager.count('application-data') > 0
  }

  @computed get isSubmitting() {
    return this.promiseManager.count('create-application') > 0
  }

  @action.bound async createApplication() {
    const url = this.Env.metaxV3Url('datasetREMSApplications', this.EtsinDataset.identifier)
    await this.promiseManager.add(
      this.client.post(url, { accept_licenses: [this.licenses.map(l => l.id)] }),
      'create-application'
    )
    this.setShowModal(false)
  }
}

export default EtsinDatasetRems
