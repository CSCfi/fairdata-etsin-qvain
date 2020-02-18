
const actorsToMetax = actors => {
  const parsedActor = actors.map(actor => ({
      type: actor.type,
      role: actor.role,
      name: actor.name,
      email: actor.email ? actor.email : undefined,
      identifier: actor.identifier ? actor.identifier : undefined,
      organization: actor.organization,
    }))
  return parsedActor
}

//Shreyas channges starts

const fieldsOfScienceToMetaxMethod = fieldsOfScience => {
  // const outputarray = []
  return fieldsOfScience.map(fieldOfScience =>
    fieldOfScience.url)
    //return outputarray
}
//shreyas changes ends
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
        identifier: dir.useCategory
      },
      projectIdentifier: dir.projectIdentifier ? dir.projectIdentifier : undefined
    }))
    : []
  return parsedDirectoryData
}

const filesToMetax = (selectedFiles, existingFiles) => {
  const selectedFileIdentifiers = selectedFiles
    ? selectedFiles.map(sf => sf.identifier)
    : []
  const notOverwrittenExistingFiles = existingFiles
    ? existingFiles.filter(ef => !selectedFileIdentifiers.includes(ef.identifier))
    : []
  const files = [...selectedFiles, ...notOverwrittenExistingFiles]
  const parsedFileData = files
    ? files.map(file => ({
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
    : []
  return parsedFileData
}

const handleSubmitToBackend = (values) => {
  const obj = {
    title: values.title,
    description: values.description,
    identifiers: values.otherIdentifiers,
    // fieldOfScience: values.fieldOfScience ? values.fieldOfScience.url : undefined,
    // shreyas: Add here support for FieldOfScienceArray : We are sending array alltogether starts
    // FieldOfScienceArray: values.FieldOfScienceArray,
    fieldOfScience: fieldsOfScienceToMetaxMethod(values.fieldOfScienceArray),
    // shreyas: Add here support for FieldOfScienceArray ends
    keywords: values.keywords,
    actors: actorsToMetax(values.actors),
    accessType: values.accessType ? values.accessType : undefined,
    restrictionGrounds: values.restrictionGrounds ? values.restrictionGrounds.identifier : undefined,
    embargoDate: values.embargoExpDate,
    license: values.license ? values.license : undefined,
    otherLicenseUrl: values.otherLicenseUrl,
    // Send no values if empty instead of empty values.
    remote_resources:
      values.externalResources.length > 0 ? values.externalResources : [],
    dataCatalog: values.dataCatalog,
    cumulativeState: values.cumulativeState,
    files: filesToMetax(values.selectedFiles, values.existingFiles),
    directories: directoriesToMetax(values.selectedDirectories, values.existingDirectories),
  }
  console.log('Object before sending from fronend to backend :')
  console.table(obj)
  console.log('fieldOfScienceArray before sending from fronend to backend :')
  console.table(obj.fieldOfScienceArray)
  return obj
}

export default handleSubmitToBackend
