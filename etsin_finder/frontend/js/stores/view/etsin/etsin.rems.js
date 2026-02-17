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

  // application id -> form id -> field id -> field value
  @observable formValues = {}

  @action.bound clearApplication() {
    this.acceptLicenses = false
  }

  @action.bound
  setFormValue(applicationId, formId, fieldId, value) {
    this.formValues[applicationId] = this.formValues[applicationId] || {}
    this.formValues[applicationId][formId] = this.formValues[applicationId][formId] || {}
    this.formValues[applicationId][formId][fieldId] = value
  }

  hasAllRequiredFormValues(applicationId) {
    let application
    if (applicationId === null) {
      application = this.applicationBase
    }

    if (!application) {
      return false // not supported yet for other than new application
    }

    const forms = application['application/forms'] || []
    for (const form of forms) {
      const formId = form['form/id']
      const fields = form['form/fields']
      for (const field of fields) {
        const fieldId = field['field/id']
        const optional = field['field/optional']
        const value = this.formValues[applicationId]?.[formId]?.[fieldId] || ''
        if (!optional && !value.trim()) {
          return false
        }
      }
    }

    return true
  }

  @action.bound
  loadApplicationFormValues(application) {
    const id = application['application/id'] || null
    const forms = application['application/forms'] || []
    this.formValues[id] = {}
    for (const form of forms) {
      const formId = form['form/id']
      this.formValues[id][formId] = {}
      const fields = form['form/fields']
      for (const field of fields) {
        const fieldId = field['field/id']
        this.formValues[id][formId][fieldId] = field['field/value'] || ''
      }
    }
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
      this.loadApplicationFormValues(data)
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
      this.loadApplicationFormValues(application)
    } catch (e) {
      console.error(e)
      this.setApplicationsError(e)
    }
  }

  applicationWasApproved(application) {
    // Return true if application was approved at some point (might no longer be approved).
    const events = application['application/events'] || []
    for (const event of events) {
      if (event['event/type'] === 'application.event/approved') {
        return true
      }
    }

    return false
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

  getFieldValues(applicationId) {
    // Get form field values list for REMS application.
    // Use applicationId=null for values of new application.
    const fieldValues = []
    for (const form in this.formValues[applicationId]) {
      const fields = this.formValues[applicationId][form]
      for (const field in fields) {
        const value = fields[field]
        if (value) {
          fieldValues.push({ form, field, value })
        }
      }
    }
    return fieldValues
  }

  @action.bound async createApplication() {
    const url = this.Env.metaxV3Url('datasetREMSApplications', this.EtsinDataset.identifier)
    const submit = async () => {
      const payload = {
        accept_licenses: this.applicationBase['application/licenses'].map(l => l['license/id']),
      }
      const fieldValues = this.getFieldValues(null)
      if (fieldValues.length > 0) {
        payload.field_values = fieldValues
      }

      const { data } = await this.client.post(url, payload)
      this.clearApplication()
      await this.fetchApplications()
      this.tabs.setActive(`app-${data['application-id']}`)
    }
    await this.promiseManager.add(submit(), 'create-application')
  }

  @computed get readyForSubmit() {
    return (
      this.acceptLicenses &&
      this.hasAllRequiredFormValues(null) &&
      !this.isSubmitting &&
      !this.isLoadingApplicationBase &&
      !this.applicationBaseError
    )
  }
}

export default EtsinDatasetRems
