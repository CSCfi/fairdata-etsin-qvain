import { action, computed, makeObservable, observable, runInAction } from 'mobx'

import Tabs from '@/stores/view/tabs'
import AbortClient from '@/utils/AbortClient'
import PromiseManager from '@/utils/promiseManager'

class EtsinDatasetRems {
  constructor({ EtsinDataset, Env }) {
    this.EtsinDataset = EtsinDataset
    this.Env = Env
    makeObservable(this)
    this.promiseManager = new PromiseManager()
    this.client = new AbortClient()
    this.tabs = new Tabs({}, 'new-application')
    this.setApplications(undefined)
  }

  @observable showModal = false

  @observable applicationBase

  @observable applications

  @observable applicationBaseError

  @observable acceptLicenses = false

  @action.bound clearApplication() {
    this.acceptLicenses = false
  }

  @action.bound setAcceptLicenses(value) {
    this.acceptLicenses = value
  }

  @action.bound setShowModal(value) {
    this.showModal = value
  }

  @action.bound setApplicationBase(value) {
    this.applicationBase = value
  }

  @action.bound setApplications(applications) {
    this.applications = applications
    if (applications) {
      const entries = Object.fromEntries(applications.map(a => [`app-${a['application/id']}`, a]))
      this.tabs.setOptions({ 'new-application': null, ...entries })
      if (!this.tabs.activeValue) {
        // Default to "new application" tab when previously selected tab is not available
        this.tabs.setActive('new-application')
      }
    } else {
      // Applications not yet loaded
      this.tabs.setOptions({})
    }
  }

  @action.bound setApplicationBaseError(value) {
    this.applicationBaseError = value
  }

  @action.bound setApplicationsError(value) {
    this.applicationsError = value
  }

  @action.bound async fetchApplicationBase() {
    if (this.isLoadingApplicationBase) {
      return
    }
    this.clearApplication()
    this.setApplicationBase(undefined)
    const url = this.Env.metaxV3Url('datasetREMSApplicationBase', this.EtsinDataset.identifier)
    try {
      const { data } = await this.promiseManager.add(this.client.get(url), 'application-base')
      this.setApplicationBase(data)
    } catch (e) {
      console.error(e)
      this.setApplicationBaseError(e)
    }
  }

  @action.bound async fetchApplications() {
    if (this.isLoadingApplications) {
      return
    }
    const url = this.Env.metaxV3Url('datasetREMSApplications', this.EtsinDataset.identifier)
    try {
      const { data } = await this.promiseManager.add(this.client.get(url), 'applications')
      data.sort((a, b) => b['application/id'] - a['application/id']) // newest application first
      data.forEach(d => {
        d.hasDetails = false
      })
      this.setApplications(data)
    } catch (e) {
      console.error(e)
      this.setApplicationsError(e)
    }
  }

  @action.bound async fetchApplicationDetails(application) {
    if (this.isLoadingApplications) {
      return
    }
    try {
      const url = this.Env.metaxV3Url(
        'datasetREMSApplication',
        this.EtsinDataset.identifier,
        application['application/id']
      )
      const { data } = await this.promiseManager.add(this.client.get(url), 'applications')
      runInAction(() => {
        Object.assign(application, data)
        application.hasDetails = true
      })
    } catch (e) {
      console.error(e)
      this.setApplicationsError(e)
    }
  }

  @computed get isLoadingApplicationBase() {
    return this.promiseManager.count('application-base') > 0
  }

  @computed get isLoadingApplications() {
    return this.promiseManager.count('applications') > 0
  }

  @computed get isLoading() {
    return this.isLoadingApplications || this.isLoadingApplicationBase
  }

  @computed get isSubmitting() {
    return this.promiseManager.count('create-application') > 0
  }

  @action.bound async createApplication() {
    const url = this.Env.metaxV3Url('datasetREMSApplications', this.EtsinDataset.identifier)
    const submit = async () => {
      const { data } = await this.client.post(url, {
        accept_licenses: this.applicationBase['application/licenses'].map(l => l['license/id']),
      })
      this.clearApplication()
      await this.fetchApplications()
      this.tabs.setActive(`app-${data['application-id']}`)
    }
    await this.promiseManager.add(submit(), 'create-application')
  }
}

export default EtsinDatasetRems
