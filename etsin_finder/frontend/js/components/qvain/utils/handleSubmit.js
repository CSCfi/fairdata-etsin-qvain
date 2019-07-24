
const participantsToMetax = participants => {
  const parsedParticipant = participants.map(participant => ({
      type: participant.type,
      role: participant.role,
      name: participant.name,
      email: participant.email ? participant.email : undefined,
      identifier: participant.identifier ? participant.identifier : undefined,
      organization: participant.organization,
    }))
  return parsedParticipant
}

const directoriesToMetax = (selectedDirectories, existingDirectories) => {
  const selectedDirectoryIdentifiers = selectedDirectories.map(sd => sd.identifier)
  const notOverwrittenExistingDirectories = existingDirectories
    ? existingDirectories.filter(ed => !selectedDirectoryIdentifiers.includes(ed.identifier))
    : []
  const directories = [...selectedDirectories, ...notOverwrittenExistingDirectories]
  const parsedDirectoryData = directories.map(dir => ({
    identifier: dir.identifier,
    title: dir.title,
    description: dir.description ? dir.description : undefined,
    useCategory: {
      identifier: dir.useCategory
    },
    projectIdentifier: dir.projectIdentifier ? dir.projectIdentifier : undefined
  }))
  return parsedDirectoryData
}

const filesToMetax = (selectedFiles, existingFiles) => {
  const selectedFileIdentifiers = selectedFiles.map(sf => sf.identifier)
  const notOverwrittenExistingFiles = existingFiles
    ? existingFiles.filter(ef => !selectedFileIdentifiers.includes(ef.identifier))
    : []
  const files = [...selectedFiles, ...notOverwrittenExistingFiles]
  const parsedFileData = files.map(file => ({
    identifier: file.identifier,
    title: file.title,
    description: file.description ? file.description : undefined,
    fileType: file.fileType ? {
      identifier: file.fileType ? file.fileType : undefined
    } : undefined,
    useCategory: {
      identifier: file.useCategory
    },
    projectIdentifier: file.projectIdentifier ? file.projectIdentifier : undefined
  }))
  return parsedFileData
}

const handleSubmitToBackend = (values) => {
  const obj = {
    title: {
      fi: values.title.fi,
      en: values.title.en,
    },
    description: {
      fi: values.description.fi,
      en: values.description.en,
    },
    identifiers: values.otherIdentifiers,
    fieldOfScience: values.fieldOfScience ? values.fieldOfScience.url : undefined,
    keywords: values.keywords,
    participants: participantsToMetax(values.participants),
    accessType: values.accessType ? values.accessType : undefined,
    restrictionGrounds: values.restrictionGrounds ? values.restrictionGrounds.value : undefined,
    embargoDate: values.embargoExpDate,
    license: values.license ? values.license : undefined,
    otherLicenseUrl: values.otherLicenseUrl,
    // Send no values if empty instead of empty values.
    remote_resources:
      values.externalResources.length > 0 ? values.externalResources : [],
      dataCatalog: values.dataCatalog,
      files: values.selectedFiles.length > 0 ? filesToMetax(values.selectedFiles) : [],
      directories: values.selectedDirectories.length > 0 ? directoriesToMetax(values.selectedDirectories) : [],
  }
  return obj
}

export default handleSubmitToBackend
