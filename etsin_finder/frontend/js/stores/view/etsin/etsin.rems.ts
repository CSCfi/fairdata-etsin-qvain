import { action, computed, observable, runInAction } from 'mobx'
import * as yup from 'yup'

import type Env from '@/stores/domain/env'
import Tabs from '@/stores/view/tabs'
import AbortClient from '@/utils/AbortClient'
import PromiseManager from '@/utils/promiseManager'
import type EtsinDatasetV3 from './etsin.storesV3'
import safeValidateSync from '@/utils/safeValidateSync'

const localizedTextSchema = yup.object({
  fi: yup.string().nullable(),
  en: yup.string().nullable(),
})

const licenseSchema = yup.object({
  'license/id': yup.number().required(),
  'license/type': yup.string().oneOf(['link', 'text']).required(),
  'license/title': localizedTextSchema.required(),
  'license/text': localizedTextSchema.nullable(),
  'license/link': localizedTextSchema.nullable(),
  is_data_access_terms: yup.boolean().default(false),
})

const fieldSchema = yup.object({
  'field/title': localizedTextSchema.required(),
  'field/type': yup.string().required(),
  'field/id': yup.string().required(),
  'field/max-length': yup.number().nullable(),
  'field/optional': yup.boolean().required(),
  'field/value': yup.mixed(),
})

const formSchema = yup.object({
  'form/internal-name': yup.string().required(),
  'form/fields': yup.array().of(fieldSchema).required(),
  'form/title': yup.string().required(),
  'form/errors': yup.mixed().nullable(),
  'form/id': yup.number().required(),
  'form/external-title': localizedTextSchema.required(),
})

const actorAttributesSchema = yup.object({
  userid: yup.string().required(),
  name: yup.string(),
  email: yup.string().email(),
})

const resourceSchema = yup.object({
  'resource/ext-id': yup.string().required(),
  'catalogue-item/id': yup.number().required(),
})

const applicationFormRefSchema = yup.object({
  'form/id': yup.number().required(),
})

const licenseRefSchema = yup.object({
  'license/id': yup.number().required(),
})

const fieldValueSchema = yup.object({
  value: yup.string().optional(),
  field: yup.string().required(),
  form: yup.number().required(),
})

const applicationEventSchema = yup.object({
  'event/id': yup.number().required(),
  'event/type': yup.string().required(),
  'event/time': yup.string().datetime().required(),
  'event/actor': yup.string().required(),
  'application/id': yup.number().required(),
  'event/actor-attributes': actorAttributesSchema.required(),
  'event/visibility': yup.string().optional(),
  'application/comment': yup.string().optional(),

  // Present on created event
  'application/external-id': yup.string().optional(),
  'workflow/type': yup.string().optional(),
  'workflow/id': yup.number().optional(),
  'application/resources': yup.array().of(resourceSchema).optional(),
  'application/forms': yup.array().of(applicationFormRefSchema).optional(),
  'application/licenses': yup.array().of(licenseRefSchema).optional(),

  // Present on draft-saved event
  'application/field-values': yup.array().of(fieldValueSchema).optional(),

  // Present on licenses-accepted event
  'application/accepted-licenses': yup.array().of(yup.number().required()).optional(),
})

export const applicationEventsSchema = yup.array().of(applicationEventSchema).required()

export const applicationBaseSchema = yup.object({
  'application/licenses': yup.array().of(licenseSchema).default([]),
  'application/forms': yup.array().of(formSchema).default([]),
  'application/id': yup.number().required(), // -1 for new application
})

export const applicationSchema = yup.object({
  'application/licenses': yup.array().of(licenseSchema).default([]),
  'application/forms': yup.array().of(formSchema).default([]),
  'application/id': yup.number().required(),
  'application/events': yup.array().of(applicationEventSchema),
  'application/first-submitted': yup.string(),
  'application/external-id': yup.string(),
  // timestamps
  'application/created': yup.string(),
  'application/modified': yup.string(),
  'application/state': yup.string().default('application.state/draft'),
  hasDetails: yup.bool().default(false), // added by etsin
})

export type ApplicationFormField = yup.InferType<typeof fieldSchema>

export type ApplicationForm = yup.InferType<typeof formSchema>

export type ApplicationEvent = yup.InferType<typeof applicationEventSchema>

export type ApplicationLicense = yup.InferType<typeof licenseSchema>

export type ApplicationBase = yup.InferType<typeof applicationBaseSchema>

export type Application = yup.InferType<typeof applicationSchema>

type FormValues = Record<string, string>
type Forms = Record<number, FormValues>
type ApplicationFormData = Record<number, Forms>

type FieldValue = {
  form: number
  field: string
  value: string
}

class EtsinDatasetRems {
  EtsinDataset: EtsinDatasetV3
  Env: Env
  promiseManager: PromiseManager
  client: AbortClient
  tabs: Tabs

  constructor({ EtsinDataset, Env }: { EtsinDataset: EtsinDatasetV3; Env: Env }) {
    this.EtsinDataset = EtsinDataset
    this.Env = Env
    this.promiseManager = new PromiseManager()
    this.client = new AbortClient()
    this.tabs = new Tabs({}, 'new-application')
    this.setApplications(undefined)
    this.readyForSubmit = this.readyForSubmit.bind(this)
    this.hasAllRequiredFormValues = this.hasAllRequiredFormValues.bind(this)
  }

  @observable accessor showModal = false

  @observable accessor applicationBase: ApplicationBase | undefined

  @observable accessor applications: Array<any> | undefined

  @observable accessor applicationBaseError: any
  @observable accessor applicationsError: any

  // application id -> bool
  @observable accessor acceptLicenses: Record<string, boolean> = {}

  // application id -> form id -> field id -> field value
  @observable accessor formValues: ApplicationFormData = {}

  @action.bound clearApplication() {
    this.acceptLicenses[''] = false
    this.formValues[-1] = {}
  }

  @action.bound
  setFormValue(applicationId: number, formId: number, fieldId: string, value: string) {
    this.formValues[applicationId] = this.formValues[applicationId] || {}
    this.formValues[applicationId][formId] = this.formValues[applicationId][formId] || {}
    this.formValues[applicationId][formId][fieldId] = value
  }

  hasAllRequiredFormValues(application: Application | ApplicationBase) {
    if (!application) {
      return false
    }
    const applicationId = application['application/id'] || -1

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
  loadApplicationFormValues(application: Application) {
    const id = application['application/id'] || -1
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

  @action.bound setAcceptLicenses(applicationId: number, value: boolean) {
    this.acceptLicenses[applicationId] = value
  }

  @action.bound setShowModal(value: boolean) {
    this.showModal = value
  }

  @action.bound setApplicationBase(value?: ApplicationBase) {
    this.applicationBase = value
  }

  @action.bound setApplications(applications: Application[] | undefined) {
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

  @action.bound setApplicationBaseError(value: any) {
    this.applicationBaseError = value
  }

  @action.bound setApplicationsError(value: any) {
    this.applicationsError = value
  }

  @action.bound async fetchApplicationBase() {
    if (this.isLoadingApplicationBase) {
      return
    }
    this.clearApplication()
    this.setApplicationBase(undefined)
    const url = this.Env.metaxUrls.datasetREMSApplicationBase(this.EtsinDataset.identifier)
    try {
      const { data } = await this.promiseManager.add(this.client.get(url), 'application-base')
      const validated = safeValidateSync(applicationBaseSchema, { ...data, 'application/id': -1 })
      this.setApplicationBase(validated)
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
    const url = this.Env.metaxUrls.datasetREMSApplications(this.EtsinDataset.identifier)
    try {
      const { data } = await this.promiseManager.add(this.client.get(url), 'applications')
      data.sort((a: any, b: any) => b['application/id'] - a['application/id']) // newest application first
      const validated = data.map((d: Application) => {
        return safeValidateSync(applicationSchema, { ...d, hasDetails: false })
      })
      this.setApplications(validated)
    } catch (e) {
      console.error(e)
      this.setApplicationsError(e)
    }
  }

  @action.bound async fetchApplicationDetails(application: Application) {
    if (this.isLoadingApplications) {
      return
    }
    try {
      const applicationId = application['application/id']
      const url = this.Env.metaxUrls.datasetREMSApplication(
        this.EtsinDataset.identifier,
        applicationId
      )
      const { data } = await this.promiseManager.add(this.client.get(url), 'applications')
      runInAction(() => {
        const validated = safeValidateSync(applicationSchema, { hasDetails: true, ...data })
        Object.assign(application, validated)
      })
      this.loadApplicationFormValues(application)
      // TODO: Check that licenses have actually been accepted
      this.setAcceptLicenses(applicationId, true)
    } catch (e) {
      console.error(e)
      this.setApplicationsError(e)
    }
  }

  isEditable(application: Application): boolean {
    const state = application['application/state']
    return state === 'application.state/draft' || state === 'application.state/returned'
  }

  applicationWasApproved(application: Application) {
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

  getFieldValues(applicationId: number): FieldValue[] {
    // Get form field values list for REMS application.
    // Use applicationId=null for values of new application.
    const fieldValues: FieldValue[] = []

    for (const [form, fields] of Object.entries(this.formValues[applicationId])) {
      for (const field in fields) {
        const value = fields[field]
        if (value) {
          fieldValues.push({ form: Number(form), field, value })
        }
      }
    }
    return fieldValues
  }

  getSubmitPayload(application: Application | ApplicationBase) {
    const payload: {
      accept_licenses: Array<number>
      field_values?: Array<FieldValue>
    } = {
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
    const applicationBase = this.applicationBase
    if (!applicationBase) {
      throw new Error('Missing application form')
    }
    const url = this.Env.metaxUrls.datasetREMSApplications(this.EtsinDataset.identifier)
    const submit = async () => {
      const payload = this.getSubmitPayload(applicationBase)

      const { data } = await this.client.post(url, payload)
      this.clearApplication()
      await this.fetchApplications()
      this.tabs.setActive(`app-${data['application-id']}`)
    }
    await this.promiseManager.add(submit(), 'create-application')
  }

  @action.bound async submitApplication(application: Application) {
    const applicationId = application['application/id']
    const url = this.Env.metaxUrls.datasetREMSApplicationSubmit(
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

  readyForSubmit(application: Application | ApplicationBase | undefined) {
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
