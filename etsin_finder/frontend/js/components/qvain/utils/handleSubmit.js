import { toJS } from 'mobx'

const fieldsOfScienceToMetaxMethod = (fieldsOfScience) =>
  fieldsOfScience.map((fieldOfScience) => fieldOfScience.url)

const datasetLanguageToMetax = datasetLanguage =>
  datasetLanguage.map(language => language.url)

const directoriesToMetax = (selectedDirectories, existingDirectories) => {
  const selectedDirectoryIdentifiers = selectedDirectories
    ? selectedDirectories.map((sd) => sd.identifier)
    : []
  const notOverwrittenExistingDirectories = existingDirectories
    ? existingDirectories.filter((ed) => !selectedDirectoryIdentifiers.includes(ed.identifier))
    : []
  const directories = [...selectedDirectories, ...notOverwrittenExistingDirectories]
  const parsedDirectoryData = directories
    ? directories.map((dir) => ({
      identifier: dir.identifier,
      title: dir.title,
      description: dir.description ? dir.description : undefined,
      useCategory: {
        identifier: dir.useCategory,
      },
      projectIdentifier: dir.projectIdentifier ? dir.projectIdentifier : undefined,
    }))
    : []
  return parsedDirectoryData
}

const filesToMetax = (selectedFiles, existingFiles) => {
  const selectedFileIdentifiers = selectedFiles ? selectedFiles.map((sf) => sf.identifier) : []
  const notOverwrittenExistingFiles = existingFiles
    ? existingFiles.filter((ef) => !selectedFileIdentifiers.includes(ef.identifier))
    : []
  const files = [...selectedFiles, ...notOverwrittenExistingFiles]
  const parsedFileData = files
    ? files.map((file) => ({
      identifier: file.identifier,
      title: file.title,
      description: file.description ? file.description : undefined,
      fileType: file.fileType
        ? {
          identifier: file.fileType,
        }
        : undefined,
      useCategory: {
        identifier: file.useCategory,
      },
      projectIdentifier: file.projectIdentifier ? file.projectIdentifier : undefined,
    }))
    : []
  return parsedFileData
}

const organizationToArray = fullOrganization => {
  const { organization, department, subDepartment } = fullOrganization
  const output = [{ ...organization }]
  if (department) output.push({ ...department })
  if (subDepartment) output.push({ ...subDepartment })
  return output
}

const projectsToMetax = projects => projects.map(project => {
  const projectObject = toJS(project)
  const { details } = projectObject
  const funderType = { identifier: details.funderType.url }
  details.funderType = funderType

  const organizations = projectObject.organizations
    .map(fullOrganization => organizationToArray(fullOrganization))

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

const handleSubmitToBackend = (values) => {
  const actors = values.Actors.toBackend()

  const spatial = values.Spatials.toBackend()

  const obj = {
    title: values.title,
    description: values.description,
    issuedDate: values.issuedDate,
    identifiers: values.otherIdentifiersArray,
    fieldOfScience: fieldsOfScienceToMetaxMethod(values.fieldOfScienceArray),
    datasetLanguage: datasetLanguageToMetax(values.datasetLanguageArray),
    keywords: values.keywordsArray,
    actors,
    infrastructure: values.infrastructures,
    accessType: values.accessType ? values.accessType : undefined,
    restrictionGrounds: values.restrictionGrounds
      ? values.restrictionGrounds.identifier
      : undefined,
    embargoDate: values.embargoExpDate,
    license: values.license ? values.license : undefined,
    otherLicenseUrl: values.otherLicenseUrl,
    // Send no values if empty instead of empty values.
    remote_resources: values.externalResources.length > 0 ? values.externalResources : [],
    dataCatalog: values.dataCatalog,
    cumulativeState: values.cumulativeState,
    useDoi: values.useDoi,
    projects: projectsToMetax(values.projects),
    spatial,
  }

  if (values.original) {
    obj.original = values.original
  }

  if (!values.metaxApiV2) {
    obj.files = filesToMetax(values.selectedFiles, values.existingFiles)
    obj.directories = directoriesToMetax(values.selectedDirectories, values.existingDirectories)
  }

  return obj
}

export default handleSubmitToBackend
