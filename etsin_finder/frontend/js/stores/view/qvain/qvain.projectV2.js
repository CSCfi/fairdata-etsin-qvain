 
import { makeObservable, observable, action, computed, override, runInAction } from 'mobx'
import * as yup from 'yup'
import { v4 as uuidv4 } from 'uuid'
import cloneDeep from 'lodash.clonedeep'
import axios from 'axios'

import Field from './qvain.field'
import { touch } from './track'
import { METAX_FAIRDATA_ROOT_URL, ENTITY_TYPE } from '@/utils/constants'

const codeRegExp = RegExp('http://uri.suomi.fi/codelist/fairdata/organization/code/(.*)')

const parseOrgName = org => {
  const namePartsFi = [
    org.organization?.name?.fi,
    org.department?.name?.fi,
    org.subdepartment?.name?.fi,
  ].filter(e => e)
  const namePartsEn = [
    org.organization?.name?.en,
    org.department?.name?.en,
    org.subdepartment?.name?.en,
  ].filter(e => e)
  const namePartsUnd = [
    org.organization?.name?.und,
    org.department?.name?.und,
    org.subdepartment?.name?.und,
  ].filter(e => e)
  return { fi: namePartsFi.join(' / '), en: namePartsEn.join(' / '), und: namePartsUnd.join('/') }
}

const removeEmptyValues = obj =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== null && value !== ''))

const prepareOrgToMetax = org => {
  if (!org.organization) {
    return null
  }
  const clone = cloneDeep(org)
  const orgArr = [clone.organization, clone.department, clone.subdepartment].filter(v => v)
  const modifiedArr = orgArr
    .map(o => ({
      '@type': ENTITY_TYPE.ORGANIZATION,
      name: o.name,
      identifier: o.value,
      email: o.email,
    }))
    .map(removeEmptyValues)

  return modifiedArr.reduce((res, cur) => {
    cur.is_part_of = res
    return cur
  })
}
const parseOrgToEtsin = org => {
  const orgs = []
  let currentOrg = org
  while (currentOrg) {
    touch(currentOrg['@type'])
    orgs.unshift({
      name: { ...currentOrg.name },
      email: currentOrg.email,
      value: currentOrg.identifier,
    })
    currentOrg = currentOrg.is_part_of
  }
  const orgObject = { organization: orgs[0] }
  if (orgs[1]) orgObject.department = orgs[1]
  if (orgs[2]) orgObject.subdepartment = orgs[2]
  orgObject.name = parseOrgName(orgObject)
  orgObject.uiid = uuidv4()

  return orgObject
}

export const getOrganizationSearchUrl = parentId => {
  let shortId = ''
  if (parentId) {
    const match = codeRegExp.exec(parentId)
    if (match) {
      shortId = `organization_${match[1]}`
    } else {
      return null
    }
  }
  return `${METAX_FAIRDATA_ROOT_URL}/es/organization_data/organization/_search?size=3000&q=parent_id:"${shortId}"`
}

function parseOptions(hits) {
  return {
    en: hits.map(hit => getOption(hit, 'en')),
    fi: hits.map(hit => getOption(hit, 'fi')),
  }
}

function getOption(hit, language) {
  return {
    value: hit._source.uri,
    label: hit._source.label[language] || hit._source.label.und,
    name: {
      en: hit._source.label.en || hit._source.label.und,
      fi: hit._source.label.fi || hit._source.label.und,
      und: hit._source.label.und,
    },
  }
}

const ProjectTemplate = ({
  uiid = uuidv4(),
  name = { fi: '', en: '' },
  identifier = '',
  organizations = [],
  funderType = null,
  funderOrganization = null,
  fundingIdentifier = '',
}) => ({ uiid, name, identifier, organizations, funderType, funderOrganization, fundingIdentifier })

const FunderTypeModel = (name, url) => ({
  name,
  url,
})

const ProjectModel = ({
  name,
  identifier,
  source_organization,
  funder_type,
  has_funder_identifier,
  has_funding_agency,
}) => ({
  uiid: uuidv4(),
  name,
  identifier,
  organizations: source_organization ? source_organization.map(org => parseOrgToEtsin(org)) : [],
  funderType: funder_type
    ? FunderTypeModel(funder_type.pref_label, funder_type.identifier)
    : undefined,
  fundingIdentifier: has_funder_identifier,
  funderOrganization: has_funding_agency ? parseOrgToEtsin(has_funding_agency[0]) : undefined,
})

class ProjectV2 extends Field {
  constructor(Qvain) {
    super(Qvain, ProjectTemplate, ProjectModel)
    makeObservable(this)
  }

  @observable orgInEdit = { uiid: uuidv4(), organization: null }

  @observable orgValidationError = null

  @observable options = { organizations: {}, funderOrg: {} }

  @observable translationsRoot = 'qvain.projectV2'

  @action.bound fromBackend(dataset, Qvain) {
    if (dataset.is_output_of) {
      dataset.is_output_of.forEach(proj => {
        touch(proj.lifecycle_event, proj.event_outcome)
      })
    }
    this.fromBackendBase(dataset.is_output_of, Qvain)
  }

  @action.bound toBackend = () =>
    this.storage.map(project => {
      const item = {
        name: project.name,
        identifier: project.identifier,
        source_organization: project.organizations.map(org => prepareOrgToMetax(org)),
        has_funder_identifier: project.fundingIdentifier,
        funder_type: project.funderType?.url ? { identifier: project.funderType.url } : undefined,
        has_funding_agency: project.funderOrganization?.organization
          ? [prepareOrgToMetax(project.funderOrganization)]
          : undefined,
      }
      Object.entries(item).forEach(({ key, value }) => {
        if (!value) delete item[key]
      })
      return item
    })

  @override create(data) {
    super.create(data)
    this.setChanged(false)
    this.orgInEdit = { uiid: uuidv4(), organization: null }
    this.fetchAllOptions()
    this.orgValidationError = null
  }

  @override edit(uiid) {
    super.edit(uiid)
    this.orgInEdit = { uiid: uuidv4(), organization: null }
    this.fetchAllOptions()
    this.orgValidationError = null
  }

  @override reset() {
    super.reset()
    this.orgInEdit = { uiid: uuidv4(), organization: null }
    this.orgValidationError = null
  }

  @action.bound changeOrgInEdit(dep, value) {
    this.setChanged(true)

    const org = { ...this.orgInEdit }

    if (dep === 'organization') {
      org.organization = value
      org.department = undefined
      org.subdepartment = undefined
    } else if (dep === 'department') {
      org.department = value
      org.subdepartment = undefined
    } else if (dep === 'subdepartment') {
      org.subdepartment = value
    } else {
      console.warn(`invalid organization level: ${dep}`)
    }

    if (org.organization) {
      this.orgInEdit = org
    } else {
      this.orgInEdit = { uiid: uuidv4(), organization: null }
    }

    this.fetchOrgOptions()
  }

  @action.bound saveOrg() {
    if (!this.validateOrg()) {
      return
    }
    this.orgInEdit.name = parseOrgName(this.orgInEdit)

    if (this.orgEditMode) {
      const index = this.inEdit.organizations.findIndex(i => i.uiid === this.orgInEdit.uiid)
      this.inEdit.organizations[index] = { ...this.orgInEdit }
    } else {
      this.inEdit.organizations.push({ ...this.orgInEdit })
    }
    this.orgInEdit = { uiid: uuidv4(), organization: null }
  }

  @action.bound validateOrg() {
    try {
      organizationObjectSchema.validateSync(this.orgInEdit, { strict: true })
      this.orgValidationError = null
    } catch (error) {
      this.orgValidationError = error.message
      return false
    }
    return true
  }

  @action.bound async fetchAllOptions() {
    this.fetchOrgOptions()
    this.fetchFunderOrgOptions()
  }

  @action.bound async fetchOrgOptions() {
    const organizations = {
      organization: this.options.organizations.organization || (await this.fetch('all')),
      department: await this.fetch(this.orgInEdit.organization?.value),
      subdepartment: await this.fetch(this.orgInEdit.department?.value),
    }
    runInAction(() => {
      this.options.organizations = organizations
    })
  }

  @action.bound async fetchFunderOrgOptions() {
    const funderOrg = {
      organization: this.options.funderOrg.organization || (await this.fetch('all')),
      department: await this.fetch(this.inEdit?.funderOrganization?.organization?.value),
      subdepartment: await this.fetch(this.inEdit?.funderOrganization?.department?.value),
    }
    runInAction(() => {
      this.options.funderOrg = funderOrg
    })
  }

  @action.bound async fetch(parentId = null) {
    if (!parentId) {
      return []
    }

    const url = parentId === 'all' ? getOrganizationSearchUrl() : getOrganizationSearchUrl(parentId)
    if (!url) {
      return []
    }
    const response = await axios.get(url)

    if (response?.status !== 200) return null
    const { hits } = response.data.hits
    return parseOptions(hits)
  }

  @action.bound editOrg(uiid) {
    const item = this.inEdit.organizations.find(i => i.uiid === uiid)
    this.orgInEdit = { ...item }
  }

  @action.bound removeOrg(uiid) {
    const index = this.inEdit.organizations.findIndex(i => i.uiid === uiid)
    this.inEdit.organizations.splice(index, 1)
  }

  @action.bound changeFunderOrgInEdit(dep, value) {
    this.setChanged(true)

    const funderOrg = { ...this.inEdit.funderOrganization }

    if (dep === 'organization') {
      funderOrg.organization = value
      funderOrg.department = undefined
      funderOrg.subdepartment = undefined
    } else if (dep === 'department') {
      funderOrg.department = value
      funderOrg.subdepartment = undefined
    } else if (dep === 'subdepartment') {
      funderOrg.subdepartment = value
    } else {
      console.warn(`invalid organization level: ${dep}`)
    }

    if (funderOrg.organization) {
      this.inEdit.funderOrganization = funderOrg
    } else {
      this.inEdit.funderOrganization = null
    }

    this.fetchFunderOrgOptions()
  }

  @computed get orgEditMode() {
    return this.inEdit.organizations.find(i => i.uiid === this.orgInEdit.uiid)
  }

  @computed get isOrgDepartmentVisible() {
    return !!this.orgInEdit.organization
  }

  @computed get isOrgSubdepartmentVisible() {
    return !!this.orgInEdit.department
  }

  @computed get isFunderOrgDepartmentVisible() {
    return !!this.inEdit.funderOrganization?.organization
  }

  @computed get isFunderOrgSubdepartmentVisible() {
    return !!this.inEdit.funderOrganization?.department
  }

  FunderTypeModel = FunderTypeModel

  Model = ProjectModel

  schema = projectSchema
}

// PROJECT VALIDATION
export const organizationSelectSchema = yup
  .object()
  .shape({
    name: yup.lazy(obj => {
      if (!obj) {
        return yup.object().required('qvain.validationMessages.projects.organization.name')
      }

      const langs = Object.keys(obj)
      if (!langs.length) {
        return yup
          .object({
            fi: yup.string().required('qvain.validationMessages.projects.organization.name'),
            en: yup.string().required('qvain.validationMessages.projects.organization.name'),
            und: yup.string().required('qvain.validationMessages.projects.organization.name'),
          })
          .required('qvain.validationMessages.projects.organization.name')
      }

      const shape = langs.reduce(
        (schema, lang) => ({
          ...schema,
          [lang]: yup.string().required('qvain.validationMessages.projects.organization.name'),
        }),
        {}
      )
      return yup.object(shape).required('qvain.validationMessages.projects.organization.name')
    }),
    email: yup.string().email('qvain.validationMessages.projects.organization.email'),
    identifier: yup.string(),
  })
  .default(undefined)

export const organizationObjectSchema = yup
  .object()
  .shape({
    organization: organizationSelectSchema.required(
      'qvain.validationMessages.projects.organization.required'
    ),
    department: organizationSelectSchema.nullable().default(undefined),
    subdepartment: organizationSelectSchema.nullable().default(undefined),
  })
  .default(undefined)

export const contributorTypeSchema = yup.array().of(
  yup.object().shape({
    identifier: yup
      .mixed()
      .required('qvain.validationMessages.projects.fundingAgency.contributorType.identifier'),
  })
)

export const projectSchema = yup.object().shape({
  name: yup
    .object()
    .shape({
      fi: yup.mixed().when('en', {
        is: val => Boolean(val),
        then: yup.string().typeError('qvain.validationMessages.projects.title.string'),
        otherwise: yup
          .string()
          .typeError('qvain.validationMessages.projects.title.string')
          .required('qvain.validationMessages.projects.title.required'),
      }),
      en: yup.string().typeError('qvain.vaidationMessages.projects.title.string'),
    })
    .default(undefined)
    .required('qvain.validationMessages.projects.title.required'),
  organizations: yup
    .array()
    .min(1, 'qvain.validationMessages.projects.organization.min')
    .required('qvain.validationMessages.projects.organization.min'),
  identifier: yup.string().nullable(),
  funderType: yup.object().shape({ url: yup.string() }).nullable(),
  fundingIdentifier: yup.string().nullable(),
  funderOrganization: organizationObjectSchema.nullable(),
})

export default ProjectV2
