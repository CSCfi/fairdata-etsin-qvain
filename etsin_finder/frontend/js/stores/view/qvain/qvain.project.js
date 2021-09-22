import { observable, action, toJS, makeObservable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import * as yup from 'yup'
import { parseOrganization } from '../../../components/qvain/fields/project/utils'
import { organizationArrayToMetax } from './qvain.actors'
import { touch } from './track'

// PROJECT VALIDATION
export const organizationSelectSchema = yup.object().shape({
  identifier: yup.string(),
  name: yup.object().shape({
    und: yup.string().required('qvain.validationMessages.projects.organization.name'),
  }),
  email: yup.string().email('qvain.validationMessages.projects.organization.email'),
})

export const organizationObjectSchema = yup.object().shape({
  organization: organizationSelectSchema
    .nullable()
    .required('qvain.validationMessages.projects.organization.name'),
  department: organizationSelectSchema.nullable(),
  subDepartment: organizationSelectSchema.nullable(),
})

export const fundingAgencySchema = yup.object().shape({
  identifier: yup
    .mixed()
    .required('qvain.validationMessages.projects.fundingAgency.contributorType.identifier'),
  labelFi: yup.string(),
  labelEn: yup.string(),
  definitionFi: yup.string(),
  definitionEn: yup.string(),
  inScheme: yup.string(),
})

export const projectSchema = yup.object().shape({
  details: yup.object().shape({
    titleFi: yup.mixed().when('titleEn', {
      is: val => Boolean(val),
      then: yup.string().typeError('qvain.validationMessages.projects.title.string'),
      otherwise: yup
        .string()
        .typeError('qvain.validationMessages.projects.title.string')
        .required('qvain.validationMessages.projects.title.required'),
    }),
    titleEn: yup.string().typeError('qvain.vaidationMessages.projects.title.string'),
    identifier: yup.string(),
    fundingIdentifier: yup.string(),
    funderType: yup.object().nullable(),
  }),
  organizations: yup.array().min(1, 'qvain.validationMessages.projects.organization.min'),
  fundingAgencies: yup.array().min(0),
})

class Projects {
  constructor(Parent) {
    this.readonly = Parent.readonly
    this.Parent = Parent
    makeObservable(this)
  }

  projectSchema = projectSchema

  orgSelectSchema = organizationSelectSchema

  orgObjectSchema = organizationObjectSchema

  fundingAgencySchema = fundingAgencySchema

  @observable projects = []

  @action reset = () => {
    this.projects = []
  }

  // Add or Update
  @action setProject = project => {
    const { id } = project
    const existingProject = this.projects.find(proj => proj.id === id)
    if (existingProject) {
      const updatedProject = { ...existingProject, ...project }
      this.projects = this.projects
        .filter(proj => proj.id !== existingProject.id)
        .concat([updatedProject])
    } else this.projects = this.projects.concat([project])
    this.changed = true
    this.Parent.setChanged(true)
  }

  @action removeProject = id => {
    this.projects = this.projects.filter(project => project.id !== id)
    this.changed = true
    this.Parent.setChanged(true)
  }

  @action fromBackend = dataset => {
    // Projects
    const projects = dataset.is_output_of
    if (projects !== undefined) {
      this.projects = projects.map(project => {
        const { identifier } = project

        // If no English or Finnish name is found, fill in value from other translations if possible
        let name = { ...project.name }
        if (!name.en && !name.fi) {
          const nameTranslation = name.und || Object.values(name).find(translation => translation)
          if (nameTranslation) {
            name = { ...name, en: nameTranslation }
          }
        }
        const params = [uuidv4(), name, identifier, project.has_funder_identifier]

        // We need to push null if no funder type found.
        // Consider refactoring params array to object to prevent this
        if (project.funder_type) {
          touch(project.funder_type)
          params.push(
            ProjectFunderType(project.funder_type.pref_label, project.funder_type.identifier)
          )
        } else params.push(null)

        // Organizations
        const organizations = (project.source_organization || []).map(organization => {
          const parsedOrganizations = parseOrganization(organization)
          parsedOrganizations.reverse()
          return Organization(uuidv4(), ...parsedOrganizations)
        })
        params.push(organizations)

        // Funding agencies
        if (project.has_funding_agency) {
          project.has_funding_agency.forEach(agency => {
            touch(agency.contributor_type)
          })
          const fundingAgencies = project.has_funding_agency.map(agency => {
            const parsedOrganizations = parseOrganization(agency)
            parsedOrganizations.reverse()
            const organization = Organization(uuidv4(), ...parsedOrganizations)
            const contributorTypes = (agency.contributor_type || []).map(contributorType =>
              ContributorType(
                uuidv4(),
                contributorType.identifier,
                contributorType.pref_label,
                contributorType.definition,
                contributorType.in_scheme
              )
            )
            return FundingAgency(uuidv4(), organization, contributorTypes)
          })
          params.push(fundingAgencies)
        } else params.push(null)
        return Project(...params)
      })
    }
  }

  projectToMetax = project => {
    const projectObject = toJS(project)
    const { details } = projectObject

    const fundingAgencies = projectObject.fundingAgencies.map(agency => {
      const contributorTypes = agency.contributorTypes.map(contributorType => {
        const { identifier, definition } = contributorType
        return { identifier, definition }
      })
      const { organization } = agency
      return { ...organizationToMetax(organization), contributor_type: contributorTypes }
    })

    const metaxProject = {
      name: project.details?.title,
      identifier: project.details?.identifier,
      has_funder_identifier: project.details?.fundingIdentifier,
      source_organization: (projectObject.organizations || []).map(fullOrganization =>
        organizationToMetax(fullOrganization)
      ),
      has_funding_agency: fundingAgencies,
    }

    if (details.funderType?.url) {
      metaxProject.funder_type = { identifier: details.funderType.url }
    }
    return metaxProject
  }

  toBackend = () => this.projects.map(this.projectToMetax)
}

const organizationToMetax = fullOrganization => {
  for (const [key, value] of Object.entries(fullOrganization)) {
    if (value && !value.email) delete fullOrganization[key].email
  }
  const { organization, department, subDepartment } = fullOrganization
  const organizationArray = [organization, department, subDepartment].filter(v => v)
  return organizationArrayToMetax(organizationArray)
}

export const Project = (
  id,
  title,
  identifier,
  fundingIdentifier,
  funderType, // ProjectFunderType
  organizations, // Array<Organization>
  fundingAgencies // Array<FundingAgency>
) => ({
  id: id || uuidv4(),
  details: { title, identifier, fundingIdentifier, funderType },
  organizations,
  fundingAgencies: fundingAgencies || [],
})

export const ProjectFunderType = (name, url) => ({
  name,
  url,
})

export const Organization = (id, organization, department, subDepartment) => ({
  id: id || uuidv4(),
  organization,
  department,
  subDepartment,
})

export const FundingAgency = (id, organization, contributorTypes) => ({
  id: id || uuidv4(),
  organization,
  contributorTypes: contributorTypes || [], // Array<ContributorType>
})

export const ContributorType = (id, identifier, label, definition, inScheme) => ({
  id: id || uuidv4(),
  identifier,
  label,
  definition,
  inScheme,
})

export default Projects
