import * as yup from 'yup'
import { makeObservable, action, observable, override, computed } from 'mobx'
import { CommonAdapter } from '../structural/qvain.adapters'
import { CommonController } from '../structural/qvain.controllers'
import { CommonModel } from '../structural/qvain.models'
import removeEmpty from '@/utils/removeEmpty'

export const organizationNameSchema = yup
  .string()
  .typeError('qvain.validationMessages.actors.organization.name')
  .min(1, 'qvain.validationMessages.actors.organization.name')
  .max(1000, 'qvain.validationMessages.actors.name.max')
  .required('qvain.validationMessages.actors.organization.name')

export const organizationEmailSchema = yup
  .string()
  .typeError('qvain.validationMessages.actors.email.string')
  .max(1000, 'qvain.validationMessages.actors.email.max')
  .email('qvain.validationMessages.actors.email.email')
  .nullable()

export const organizationIdentifierSchema = yup
  .string()
  .max(1000, 'qvain.validationMessages.actors.identifier.max')
  .nullable()

export const organizationNameTranslationsSchema = yup.lazy(translations => {
  // Each value in the translations must be an organization name string.
  const obj = Object.keys(translations).reduce((o, translation) => {
    o[translation] = organizationNameSchema
    return o
  }, {})
  // At least one translation is required.
  if (Object.keys(obj).length === 0) {
    obj.und = organizationNameSchema
  }
  return yup.object().shape(obj)
})

export const organizationSectionSchema = yup
  .object()
  .shape({
    pref_label: organizationNameTranslationsSchema,
    url: organizationIdentifierSchema,
    email: organizationEmailSchema,
    external_identifier: organizationIdentifierSchema,
  })
  .nullable()

export class OrganizationAdapter extends CommonAdapter {
  constructor(args) {
    super(args)
    makeObservable(this)
  }

  @action.bound fromMetaxV3(data) {
    const fields = ['organization', 'department', 'subdepartment']

    if (!data) {
      return
    }

    let depth = 0
    if (data.parent) depth += 1
    if (data.parent?.parent) depth += 1

    let part = data

    for (; depth >= 0; depth -= 1) {
      this.instance[fields[depth]] = removeEmpty({
        url: part.url,
        pref_label: part.pref_label,
        email: part.email,
        external_identifier: part.external_identifier,
        isReference: !!part.url,
      })

      part = part.parent
    }
  }

  @action.bound toMetaxV3() {
    if (!this.instance.hasOrganization) return null
    const org = removeEmpty({
      url: this.instance.organization.url,
      pref_label: this.instance.organization.pref_label,
      email: this.instance.organization.email,
      external_identifier: this.instance.organization.external_identifier,
    })

    if (!this.instance.hasDepartment) return org
    const dep = removeEmpty({
      url: this.instance.department.url,
      pref_label: this.instance.department.pref_label,
      email: this.instance.department.email,
      external_identifier: this.instance.department.external_identifier,
    })
    dep.parent = org

    if (!this.instance.hasSubdepartment) return dep
    const sub = removeEmpty({
      url: this.instance.subdepartment.url,
      pref_label: this.instance.subdepartment.pref_label,
      email: this.instance.subdepartment.email,
      external_identifier: this.instance.subdepartment.external_identifier,
    })

    sub.parent = dep
    return sub
  }
}

export class OrganizationController extends CommonController {
  constructor(args) {
    super(args)
    makeObservable(this)
  }

  @action.bound setOrganization(data) {
    this.instance.organization = data
  }

  @action.bound setDepartment(data) {
    this.instance.department = data
  }

  @action.bound setSubdepartment(data) {
    this.instance.subdepartment = data
  }

  @override set({ section, fieldName, value }) {
    this.instance[section][fieldName] = value
  }

  @action.bound setSection({ section, value }) {
    this.instance[section] = value
  }

  @action.bound reset() {
    this.instance.organization = {}
    this.instance.department = {}
    this.instance.subdepartment = {}
  }
}

export class Organization extends CommonModel {
  constructor() {
    super()
    makeObservable(this)

    this.getLabel = this.getLabel.bind(this)

    this.adapter = new OrganizationAdapter({ instance: this, Model: Organization })
    this.controller = new OrganizationController({ instance: this })
    this.schema = {
      organization: organizationSectionSchema,
      department: organizationSectionSchema,
      subdepartment: organizationSectionSchema,
    }
    this.validationError = { organization: '', department: '', subdepartment: '' }
  }

  @observable validationError

  @observable organization = {
    pref_label: { fi: '', en: '', und: '' },
    url: '',
    email: '',
    external_identifier: '',
    isReference: true,
  }

  @observable department = { pref_label: { fi: '', en: '', und: '' }, isReference: true }

  @observable subdepartment = { pref_label: { fi: '', en: '', und: '' }, isReference: true }

  @computed get hasOrganization() {
    return (
      !!this.organization?.pref_label?.en ||
      !!this.organization?.pref_label?.fi ||
      !!this.organization?.pref_label?.und
    )
  }

  @computed get hasDepartment() {
    return (
      !!this.department?.pref_label?.en ||
      !!this.department?.pref_label?.fi ||
      !!this.department?.pref_label?.und
    )
  }

  @computed get hasSubdepartment() {
    return (
      !!this.subdepartment?.pref_label?.en ||
      !!this.subdepartment?.pref_label?.fi ||
      !!this.subdepartment?.pref_label?.und
    )
  }

  getLabel() {
    if (!this.hasOrganization) return { und: '' }

    const name = { ...this.organization.pref_label }
    const languages = ['fi', 'en', 'und']

    if (this.hasDepartment)
      Object.entries(this.department.pref_label).forEach(([key, value]) => {
        if (languages.includes(key) && value) name[key] += `, ${value}`
      })

    if (this.hasSubdepartment)
      Object.entries(this.subdepartment.pref_label).forEach(([key, value]) => {
        if (languages.includes(key) && value) name[key] += `, ${value}`
      })

    return name
  }
}
