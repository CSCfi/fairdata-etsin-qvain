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
    this.readyForSubmit = this.readyForSubmit.bind(this)
    this.hasAllRequiredFormValues = this.hasAllRequiredFormValues.bind(this)
  }

  @observable showModal = false

  @observable applicationBase

  @observable applications

  @observable applicationBaseError

  // application id -> bool
  @observable acceptLicenses = {}

  // application id -> form id -> field id -> field value
  @observable formValues = {}

  @action.bound clearApplication() {
    this.acceptLicenses[null] = false
    this.formValues[null] = {}
  }

  @action.bound
  setFormValue(applicationId, formId, fieldId, value) {
    this.formValues[applicationId] = this.formValues[applicationId] || {}
    this.formValues[applicationId][formId] = this.formValues[applicationId][formId] || {}
    this.formValues[applicationId][formId][fieldId] = value
  }

  hasAllRequiredFormValues(application) {
    if (!application) {
      return false
    }
    const applicationId = application['application/id']

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

  @action.bound setAcceptLicenses(applicationId, value) {
    this.acceptLicenses[applicationId] = value
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
        // When  previously selected tab is not available,
        // default to latest application or "new application" tab
        if (applications.length > 0) {
          this.tabs.setActive(`app-${applications[0]['application/id']}`)
        } else {
          this.tabs.setActive('new-application')
        }
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
      this.setApplicationBase({ ...data, 'application/id': null })
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
      const applicationId = application['application/id']
      const url = this.Env.metaxV3Url(
        'datasetREMSApplication',
        this.EtsinDataset.identifier,
        applicationId
      )
      const { data } = await this.promiseManager.add(this.client.get(url), 'applications')
      runInAction(() => {
        Object.assign(application, data)
        application.hasDetails = true
      })
      this.loadApplicationFormValues(application)
      // TODO: Check that licenses have actually been accepted
      this.setAcceptLicenses(applicationId, true)
    } catch (e) {
      console.error(e)
      this.setApplicationsError(e)
    }
  }

  isEditable(application) {
    const state = application['application/state']
    return state === 'application.state/draft' || state === 'application.state/returned'
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
    return (
      this.promiseManager.count('create-application') > 0 ||
      this.promiseManager.count('submit-application') > 0
    )
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

  getSubmitPayload(application) {
    const payload = {
      accept_licenses: application['application/licenses'].map(l => l['license/id']),
    }
    const applicationId = application['application/id']
    const fieldValues = this.getFieldValues(applicationId)
    if (fieldValues.length > 0) {
      payload.field_values = fieldValues
    }
    return payload
  }

  @action.bound async createApplication() {
    const url = this.Env.metaxV3Url('datasetREMSApplications', this.EtsinDataset.identifier)
    const submit = async () => {
      const payload = this.getSubmitPayload(this.applicationBase)

      const { data } = await this.client.post(url, payload)
      this.clearApplication()
      await this.fetchApplications()
      this.tabs.setActive(`app-${data['application-id']}`)
    }
    await this.promiseManager.add(submit(), 'create-application')
  }

  @action.bound async submitApplication(application) {
    const applicationId = application['application/id']
    const url = this.Env.metaxV3Url(
      'datasetREMSApplicationSubmit',
      this.EtsinDataset.identifier,
      applicationId
    )
    const submit = async () => {
      const payload = this.getSubmitPayload(application)
      await this.client.post(url, payload)
      await this.fetchApplications()
    }
    await this.promiseManager.add(submit(), 'create-application')
  }

  readyForSubmit(application) {
    if (!application) {
      return false
    }
    const applicationId = application['application/id']
    return !!(
      this.acceptLicenses[applicationId] &&
      this.hasAllRequiredFormValues(application) &&
      !this.isSubmitting &&
      !this.isLoadingApplicationBase &&
      !this.applicationBaseError
    )
  }
}

export default EtsinDatasetRems
