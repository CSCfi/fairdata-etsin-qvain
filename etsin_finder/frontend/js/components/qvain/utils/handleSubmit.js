const directoriesToMetax = (selectedDirectories, existingDirectories) => {
  const selectedDirectoryIdentifiers = selectedDirectories
    ? selectedDirectories.map(sd => sd.identifier)
    : []
  const notOverwrittenExistingDirectories = existingDirectories
    ? existingDirectories.filter(ed => !selectedDirectoryIdentifiers.includes(ed.identifier))
    : []
  const directories = [...selectedDirectories, ...notOverwrittenExistingDirectories]
  const parsedDirectoryData = directories
    ? directories.map(dir => ({
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
  const selectedFileIdentifiers = selectedFiles ? selectedFiles.map(sf => sf.identifier) : []
  const notOverwrittenExistingFiles = existingFiles
    ? existingFiles.filter(ef => !selectedFileIdentifiers.includes(ef.identifier))
    : []
  const files = [...selectedFiles, ...notOverwrittenExistingFiles]
  const parsedFileData = files
    ? files.map(file => ({
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

const handleSubmitToBackend = (Env, values) => {
  const title = values.Title.toBackend()

  const description = values.Description.toBackend()

  const theme = values.SubjectHeadings.toBackend()

  const actors = values.Actors.toBackend()

  const spatial = values.Spatials.toBackend()

  const temporal = values.Temporals.toBackend()

  const relation = values.RelatedResources.toBackend()

  const provenance = values.Provenances.toBackend()

  const fieldOfScience = values.FieldOfSciences.toBackend()

  const datasetLanguage = values.DatasetLanguages.toBackend()

  const issuedDate = values.IssuedDate.toBackend()

  const accessType = values.AccessType.toBackend()

  const projects = values.Projects.toBackend()

  const license = values.Licenses.toBackend()

  const embargoDate = values.EmbargoExpDate.toBackend()

  const restrictionGrounds = values.RestrictionGrounds.toBackend()

  const keywords = values.Keywords.toBackend()

  const obj = {
    title,
    description,
    identifiers: values.OtherIdentifiers.storage,
    keywords,
    theme,
    actors,
    infrastructure: values.Infrastructures.storage,
    restrictionGrounds,
    embargoDate,
    license,
    // Send no values if empty instead of empty values.
    remote_resources: values.externalResources.length > 0 ? values.externalResources : [],
    dataCatalog: values.dataCatalog,
    cumulativeState: values.cumulativeState,
    useDoi: values.useDoi,
    projects,
    spatial,
    temporal,
    relation,
    provenance,
    fieldOfScience,
    datasetLanguage,
    issuedDate,
    accessType,
  }

  if (values.original) {
    obj.original = values.original
  }

  if (!Env.metaxApiV2) {
    obj.files = filesToMetax(values.selectedFiles, values.existingFiles)
    obj.directories = directoriesToMetax(values.selectedDirectories, values.existingDirectories)
  }

  return obj
}

export default handleSubmitToBackend
