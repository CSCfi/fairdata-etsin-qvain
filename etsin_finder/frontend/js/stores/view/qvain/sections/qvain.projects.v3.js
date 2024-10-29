/* eslint-disable camelcase */
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

export class ParticipatingOrganization extends Organization {
  translationPath = 'qvain.project.fields.participating_organizations'
}

class ParticipatingOrganizations extends ListModel {
  constructor() {
    super()
    makeObservable(this)

    this.adapter = new ListAdapter({ instance: this, Model: ParticipatingOrganization })
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
  }

  @action.bound toMetaxV3() {
    return {
      title: this.instance.title,
      project_identifier: this.instance.project_identifier,
      participating_organizations: this.instance.participating_organizations.adapter.toMetaxV3(),
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
    }
    this.validationError = {
      title: '',
      project_identifier: '',
      participating_organizations: '',
    }
  }

  @observable validationError

  @observable title = { fi: '', en: '' }

  @observable project_identifier = ''

  @observable participating_organizations = new ParticipatingOrganizations()

  getLabel() {
    return this.title
  }
}

export class Projects extends ListModel {
  constructor(Qvain) {
    super()

    this.adapter = new ListAdapter({ instance: this, Model: Project })
    this.controller = new ListModalController({
      instance: this,
      Qvain,
      Model: Project,
      listId: 'project',
    })
    this.translationPath = 'qvain.project'
  }
}
