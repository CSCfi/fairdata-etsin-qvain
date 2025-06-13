 
import { makeObservable, observable, action } from 'mobx'
import { object, array, string, mixed } from 'yup'
import { CommonAdapter, ListAdapter } from '../structural/qvain.adapters'
import {
  CommonController,
  ListModalController,
  ListController,
} from '../structural/qvain.controllers'
import { ListModel, CommonModel } from '../structural/qvain.models'
import { Organization } from '../complex/qvain.organizations.v3'
import removeEmpty from '@/utils/removeEmpty'

const titleSchema = object()
  .shape({
    fi: mixed().when('en', {
      is: val => Boolean(val),
      then: string().typeError('qvain.validationMessages.projects.title.string'),
      otherwise: string()
        .typeError('qvain.validationMessages.projects.title.string')
        .required('qvain.validationMessages.projects.title.required'),
    }),
    en: string().typeError('qvain.validationMessages.projects.title.string'),
  })
  .default(undefined)
  .required('qvain.validationMessages.projects.title.required')

const projectIdentifierSchema = string().nullable()

const participatingOrganizationsSchema = array()
  .min(1, 'qvain.validationMessages.projects.organization.min')
  .required('qvain.validationMessages.projects.organization.min')

// max validation is just for the transitional phase. Later on there is no limit how many funds project can have.
const fundingSchema = array().max(1, 'qvain.validationMessages.projects.funding.max').nullable()

const accessTypeSchema = object().shape({
  url: string().required('qvain.validationMessages.projects.funding.funder.access_type.required'),
})

const funderSchema = object().shape({
  access_type: mixed().when('organization', {
    is: val => Object.values(val.pref_label).filter(v => v).length,
    then: accessTypeSchema.nullable(),
    otherwise: accessTypeSchema.required(),
  }),
  organization: object(),
})

export class FunderOrganization extends Organization {
  constructor() {
    super({ fieldName: 'organization' })
  }

  translationPath = 'qvain.project.fields.funding.fields.funder.fields.organization'
}

export class FunderAdapter extends CommonAdapter {
  constructor(args) {
    super(args)
    makeObservable(this)
  }

  @action.bound toMetaxV3() {
    return {
      funder_type: this.instance.funder_type,
      organization: this.instance.organization.adapter.toMetaxV3(),
    }
  }

  @action.bound fromMetaxV3(data) {
    this.instance.funder_type = data?.funder_type
    this.instance.organization = new FunderOrganization()
    this.instance.organization.adapter.fromMetaxV3(data?.organization)
  }
}

export class Funder extends CommonModel {
  constructor() {
    super()
    makeObservable(this)

    this.adapter = new FunderAdapter({ instance: this, Model: Funder })
    this.controller = new CommonController({ instance: this, Model: Funder })
  }

  translationPath = 'qvain.project.fields.funding.fields.funder'

  @observable funder_type = null

  @observable organization = new FunderOrganization()
}

export class FundAdapter extends CommonAdapter {
  constructor(args) {
    super(args)
    makeObservable(this)
  }

  @action.bound toMetaxV3() {
    // Qvain supports only one funding per project for now
    return removeEmpty([
      {
        funding_identifier: this.instance.funding_identifier,
        funder: this.instance.funder.adapter.toMetaxV3(),
      },
    ])
  }

  @action.bound fromMetaxV3(data) {
    this.instance.funding_identifier = data[0]?.funding_identifier || ''
    this.instance.funder = new Funder()
    this.instance.funder.adapter.fromMetaxV3(data[0]?.funder)
  }
}

export class Fund extends CommonModel {
  constructor() {
    super()
    makeObservable(this)
    this.controller = new CommonController({ instance: this })
    this.adapter = new FundAdapter({ instance: this, Model: this })
    this.validationError = {
      funding_identifier: '',
      funder: '',
    }
    this.schema = {
      funding_identifier: projectIdentifierSchema,
      funder: funderSchema,
    }
  }

  translationPath = 'qvain.project.fields.funding'

  @observable funding_identifier = ''

  @observable funder = new Funder()

  @observable validationError
}

export class ParticipatingOrganization extends Organization {
  translationPath = 'qvain.project.fields.participating_organizations'
}

class ParticipatingOrganizations extends ListModel {
  constructor() {
    super()
    makeObservable(this)

    this.adapter = new ListAdapter({
      instance: this,
      Model: ParticipatingOrganization,
      V3FieldName: 'participating_organizations',
    })
    this.controller = new ListController({
      instance: this,
      Model: ParticipatingOrganization,
    })
  }

  @observable inEdit

  translationPath = 'qvain.project.fields.participating_organizations'
}

class ProjectAdapter extends CommonAdapter {
  constructor(args) {
    super(args)
    makeObservable(this)
  }

  @action.bound fromMetaxV3(data) {
    this.instance.title = {
      fi: data.title.fi || '',
      en: data.title.en || '',
      und: data.title.und || '',
    }

    this.instance.project_identifier = data.project_identifier
    this.instance.participating_organizations = new ParticipatingOrganizations()
    this.instance.participating_organizations.adapter.fromMetaxV3(data.participating_organizations)
    this.instance.funding = new Fund()
    this.instance.funding.adapter.fromMetaxV3(data.funding)
  }

  @action.bound toMetaxV3() {
    return {
      title: this.instance.title,
      project_identifier: this.instance.project_identifier,
      participating_organizations: this.instance.participating_organizations.adapter.toMetaxV3(),
      funding: this.instance.funding.adapter.toMetaxV3(),
    }
  }
}

export class Project extends CommonModel {
  constructor() {
    super()
    makeObservable(this)

    this.getLabel = this.getLabel.bind(this)

    this.adapter = new ProjectAdapter({ instance: this, Model: Project })
    this.controller = new CommonController({ instance: this })
    this.translationPath = 'qvain.project'
    this.schema = {
      title: titleSchema,
      project_identifier: projectIdentifierSchema,
      participating_organizations: participatingOrganizationsSchema,
      funding: fundingSchema,
    }
    this.validationError = {
      title: '',
      project_identifier: '',
      participating_organizations: '',
      funding: '',
    }
  }

  @observable validationError

  @observable title = { fi: '', en: '' }

  @observable project_identifier = ''

  @observable participating_organizations = new ParticipatingOrganizations()

  @observable funding = new Fund()

  getLabel() {
    return this.title
  }
}

export class Projects extends ListModel {
  constructor(Qvain) {
    super()

    this.adapter = new ListAdapter({ instance: this, Model: Project, V3FieldName: 'projects' })
    this.controller = new ListModalController({
      instance: this,
      Qvain,
      Model: Project,
      listId: 'project',
    })
    this.translationPath = 'qvain.project'
  }
}
