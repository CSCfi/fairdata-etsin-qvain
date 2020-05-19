const fieldsOfScienceToMetaxMethod = (fieldsOfScience) =>
  fieldsOfScience.map((fieldOfScience) => fieldOfScience.url)

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

const handleSubmitToBackend = (values) => {
  let files, directories
  if (values.legacyFilePicker) {
    files = filesToMetax(values.selectedFiles, values.existingFiles)
    directories = directoriesToMetax(values.selectedDirectories, values.existingDirectories)
  } else {
    ({ files, directories } = values.Files.toMetax())
  }

  const actors = values.Actors.toBackend()

  const obj = {
    title: values.title,
    description: values.description,
    issuedDate: values.issuedDate,
    identifiers: values.otherIdentifiers,
    fieldOfScience: fieldsOfScienceToMetaxMethod(values.fieldsOfScience),
    keywords: values.keywords,
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
    files,
    directories,
    useDoi: values.useDoi,
  }
  return obj
}

export default handleSubmitToBackend
