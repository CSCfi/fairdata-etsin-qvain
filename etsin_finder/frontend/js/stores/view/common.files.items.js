// TODO: always create observables for Directory, File, Project?

// Create prefixed keys from file/directory identifiers. Makes it possible to have
// files and directories in the same array without risk of id conflicts.
export const dirKey = dir => `dir:${dir.id || dir.directory_path || dir.pathname}` // v2 || v2 alternative || v3
export const fileKey = file => `file:${file.id}`
export const dirIdentifierKey = dir => `dir:${dir.identifier || dir.directory_path || dir.pathname}` // v2 || v2 alternative || v3
export const fileIdentifierKey = file => `file:${file.identifier}`

// properties common to directories and files
const Item = metaxItem => ({
  id: metaxItem.id, // internal metax id
  identifier: metaxItem.identifier || metaxItem.file_storage_identifier || metaxItem.id, // v2 || v3
  key: null,
  title: metaxItem.title || metaxItem.dataset_metadata?.title || '', // v2 || v3
  description: metaxItem.description || metaxItem.dataset_metadata?.description, // v2 || v3
  useCategory: metaxItem.dataset_metadata?.use_category?.url, // v3
  serviceCreated: metaxItem.service_created || metaxItem.storage_service, // v2 || v3
  parent: null,
  path: null,
  index: null, // sorting index of item
  byteSize: 0,
  added: false,
  removed: false,
  existing: false,
  error: false,
  originalMetadata: metaxItem.dataset_metadata, // v3
})

export const Directory = (metaxDir, args) => ({
  ...Item(metaxDir),
  id: metaxDir.id || metaxDir.directory_path, // v2 || v3,
  identifier: metaxDir.identifier || metaxDir.pathname, // v2 || v3,
  key: dirKey(metaxDir),
  name: metaxDir.directory_name || metaxDir.name, // actual directory name, v2 || v3
  path: metaxDir.directory_path || metaxDir.pathname, // v2 || v3
  fileCount: metaxDir.file_count,
  existingByteSize: 0,
  existingFileCount: 0,
  addedChildCount: 0,
  removedChildCount: 0,
  directChildCount: null,
  existingDirectChildCount: null,
  pagination: {
    fileCountsPromise: null,
    existingFileCountsPromise: null,
    offsets: {},
    counts: {},
    fullyLoaded: false,
  },
  loading: false,
  type: 'directory',
  directories: [],
  files: [],
  filterText: '',
  ...args,
})

// PAS metadata is updated separately using an RPC call.
export const getPASMeta = metaxFile => {
  const characteristics = metaxFile.file_characteristics || metaxFile.characteristics || {}
  const pasMeta = {}
  if (characteristics.file_format !== undefined) { // v2
    pasMeta.fileFormat = characteristics.file_format
  }
  if (characteristics.format_version !== undefined) { // v2
    pasMeta.formatVersion = characteristics.format_version
  }
  const fileFormatVersion = characteristics.file_format_version // v3
  if (fileFormatVersion) {
    pasMeta.fileFormat = fileFormatVersion.file_format
    pasMeta.formatVersion = fileFormatVersion.format_version
  }
  if (characteristics.encoding !== undefined) {
    pasMeta.encoding = characteristics.encoding
  }
  if (characteristics.csv_delimiter !== undefined) {
    pasMeta.csvDelimiter = characteristics.csv_delimiter
  }
  if (characteristics.csv_record_separator !== undefined) {
    pasMeta.csvRecordSeparator = characteristics.csv_record_separator
  }
  if (characteristics.csv_quoting_char !== undefined) {
    pasMeta.csvQuotingChar = characteristics.csv_quoting_char
  }
  if (characteristics.csv_has_header !== undefined) {
    pasMeta.csvHasHeader = characteristics.csv_has_header
  }
  return pasMeta
}

export const File = (metaxFile, args) => ({
  ...Item(metaxFile),
  key: fileKey(metaxFile),
  name: metaxFile.file_name || metaxFile.filename, // actual filename, v2 || v3
  path: metaxFile.file_path || metaxFile.pathname, // v2 || v3
  checksum: metaxFile.checksum,
  type: 'file',
  fileType: metaxFile.dataset_metadata?.file_type?.url, // v3
  pasMeta: getPASMeta(metaxFile),
  ...args,
})

// Project root, similar to a directory but cannot be added/removed or opened/closed.
export const Project = (projectIdentifier, identifier, args) => ({
  projectIdentifier,
  identifier,
  directories: [],
  files: [],
  loading: false,
  type: 'project',
  addedChildCount: 0,
  removedChildCount: 0,
  pagination: {
    fileCountsPromise: null,
    existingFileCountsPromise: null,
    offsets: {},
    counts: {},
    fullyLoaded: false,
  },
  ...args,
})

export const hasMetadata = item => {
  if (item.description || item.useCategory || (item.title && item.title !== item.name)) {
    return true
  }
  if (item.type === 'file' && item.fileType) {
    return true
  }
  return false
}

export const hasPASMetadata = file => {
  const pasMeta = file.pasMeta
  if (file.type !== 'file' || !pasMeta) {
    return false
  }
  if (
    pasMeta.description ||
    pasMeta.fileFormat ||
    pasMeta.formatVersion ||
    pasMeta.encoding ||
    pasMeta.csvDelimiter ||
    pasMeta.csvRecordSeparator ||
    pasMeta.csvQuotingChar ||
    pasMeta.csvHasHeader
  ) {
    return true
  }
  return false
}

export const getItemsByKey = dir => {
  const itemsByKey = {}
  for (const d of dir.directories) {
    itemsByKey[dirKey(d)] = d
  }
  for (const f of dir.files) {
    itemsByKey[fileKey(f)] = f
  }
  return itemsByKey
}
