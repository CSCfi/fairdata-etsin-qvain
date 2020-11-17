import { observable, action, toJS, makeObservable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import { parseOrganization } from '../../../components/qvain/fields/project/utils'

class Projects {
  constructor(Parent) {
    this.readonly = Parent.readonly
    makeObservable(this)
  }

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
  }

  @action removeProject = id => {
    this.projects = this.projects.filter(project => project.id !== id)
    this.changed = true
  }

  @action changeProject = projectId => {
    this.selectedProject = projectId
    this.hierarchy = {}
    this.selectedFiles = []
    this.selectedDirectories = []
    return this.getInitialDirectories()
  }

  @action fromBackend = dataset => {
    // Projects
    const projects = dataset.is_output_of
    if (projects !== undefined) {
      this.projects = projects.map(project => {
        const { name, identifier } = project
        const params = [uuidv4(), name, identifier, project.has_funder_identifier]

        // We need to push null if no funder type found.
        // Consider refactoring params array to object to prevent this
        if (project.funder_type) {
          params.push(
            ProjectFunderType(project.funder_type.pref_label, project.funder_type.identifier)
          )
        } else params.push(null)

        // Organizations
        const organizations = project.source_organization.map(organization => {
          const parsedOrganizations = parseOrganization(organization)
          parsedOrganizations.reverse()
          return Organization(uuidv4(), ...parsedOrganizations)
        })
        params.push(organizations)

        // Funding agencies
        if (project.has_funding_agency) {
          const fundingAgencies = project.has_funding_agency.map(agency => {
            const parsedOrganizations = parseOrganization(agency)
            parsedOrganizations.reverse()
            const organization = Organization(uuidv4(), ...parsedOrganizations)
            const contributorTypes = agency.contributor_type.map(contributorType =>
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

  toBackend = () =>
    this.projects.map(project => {
      const projectObject = toJS(project)
      const { details } = projectObject
      if (details.funderType && details.funderType.url) {
        details.funderType = { identifier: details.funderType.url }
      } else delete details.funderType

      const organizations = projectObject.organizations.map(fullOrganization =>
        organizationToArray(fullOrganization)
      )

      const fundingAgencies = projectObject.fundingAgencies.map(agency => {
        const { organization } = agency
        const contributorTypes = agency.contributorTypes.map(contributorType => {
          const { identifier, label, definition, inScheme } = contributorType
          return { identifier, label, definition, inScheme }
        })
        return { organization: organizationToArray(organization), contributorTypes }
      })
      return { details, organizations, fundingAgencies }
    })
}

const organizationToArray = fullOrganization => {
  for (const [key, value] of Object.entries(fullOrganization)) {
    if (value && !value.email) delete fullOrganization[key].email
  }
  const { organization, department, subDepartment } = fullOrganization
  const output = [{ ...organization }]
  if (department) output.push({ ...department })
  if (subDepartment) output.push({ ...subDepartment })
  return output
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
