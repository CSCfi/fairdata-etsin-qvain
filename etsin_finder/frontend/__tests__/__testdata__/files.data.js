const parseIntParam = param => {
  const val = parseInt(param)
  if (isNaN(val)) {
    return undefined
  }
  return val
}

class FilesMock {
  /* Mock Metax file endpoints

  Usage steps:
  - Create file tree using setFilesFromPaths
  - Call registerHandler(mockAdapter) to register the endpoint
  - To add files to a dataset, use setDatasetFiles
  */
  constructor() {
    this.directoryHandler = this.directoryHandler.bind(this)
  }

  filesByPath = {} // File objects by pathname

  datasetFiles = {} // Map of dataset ids to list of file names in dataset

  setFilesFromPaths(filePaths) {
    // Create file tree from list of file names
    const entries = filePaths.map(path => [
      path,
      {
        id: `id-${path}`, // an uuid in Metax
        storage_identifier: `storage-identifier-${path}`,
        pathname: path,
        filename: path.split('/').slice(-1)[0],
        size: 1024,
        storage_service: 'ida',
        csc_project: 'testproject',
        checksum: 'sha256:1234abcdf00f',
        frozen: '2025-08-06T10:12:34Z',
        modified: '2025-08-06T10:12:34Z',
        pas_process_running: false,
      },
    ])
    this.filesByPath = Object.fromEntries(entries)
  }

  setDatasetFiles(datasetFiles) {
    this.datasetFiles = datasetFiles
  }

  directoryHandler(config) {
    // Mock Metax directories endpoint.
    // Uses allFilePaths and datasetFiles to determine
    // what files exist in the project and which files are
    // in the dataset.

    const params = new URL(config.url).searchParams
    const pagination = params.get('pagination') !== 'false'

    const dirPath = params.get('path')
    if (!(typeof dirPath === 'string' && dirPath.startsWith('/') && dirPath.endsWith('/'))) {
      return [400, `Expected path query param that starts and ends with "/". Path=${dirPath}`]
    }

    const dataset = params.get('dataset')
    const includeAll = params.get('include_all') === 'true'
    const excludeDataset = params.get('exclude_dataset') === 'true'

    const offset = parseIntParam(params.get('offset')) || 0
    const limit = parseIntParam(params.get('limit')) || 20


    // Optionally filter files belonging to dataset
    let filteredFilePaths = Object.keys(this.filesByPath)
    if (dataset && !includeAll) {
      const datasetFileNames = this.datasetFiles[dataset] || []
      if (excludeDataset) {
        filteredFilePaths = filteredFilePaths.filter(path => !datasetFileNames.includes(path))
      } else {
        filteredFilePaths = filteredFilePaths.filter(path => datasetFileNames.includes(path))
      }
    }

    // Find all files matching path, return relative paths
    const containedPaths = filteredFilePaths
      .filter(path => path.startsWith(dirPath))
      .map(path => path.substring(dirPath.length))

    // Exclude files that are in subdirectories
    const fileNames = containedPaths.filter(path => !path.includes('/'))

    // Determine unique subdirectory names
    const directoryNames = [
      ...new Set(
        containedPaths.filter(path => path.includes('/')).map(path => path.split('/', 1)[0])
      ),
    ]

    const files = fileNames.map(name => this.filesByPath[dirPath + name])

    const getDirectory = name => {
      let pathname = dirPath + name
      if (pathname !== '/') {
        pathname += '/'
      }
      const subFiles = filteredFilePaths
        .filter(path => path.startsWith(pathname))
        .map(path => this.filesByPath[path])
      return {
        storage_service: 'ida',
        csc_project: 'testproject',
        name,
        pathname,
        file_count: subFiles.length,
        size: subFiles.reduce((sum, file) => sum + file.size, 0),
        created: '2025-08-06T10:12:34Z', // in Metax, timestamp of oldest file
        modified: '2025-08-06T10:12:34Z', // in Metax, timestamp of newest file
      }
    }

    const results = {
      directory: getDirectory(''),
      directories: directoryNames.map(getDirectory),
      files,
    }
    if (pagination) {
      return [200, this.paginate(results, offset, limit)]
    }
    return [200, results]
  }

  paginate(results, offset, limit) {
    // Paginate result directories and files together
    let remaining = limit
    let offs = offset
    let directories = []
    let files = []
    while (remaining > 0 && offs < results.directories.length) {
      directories.push(results.directories[offs])
      offs += 1
      remaining -= 1
    }
    offs -= results.directories.length
    while (remaining > 0 && offs < results.files.length) {
      files.push(results.files[offs])
      offs += 1
      remaining -= 1
    }
    return {
      count: results.directories.length + results.files.length,
      results: {
        ...results,
        directories,
        files,
      },
    }
  }

  registerHandler(mockAdapter) {
    // Currently handles only the /v3/directories endpoint since that's the one Etsin-Qvain uses
    mockAdapter.onGet(/https:\/\/metaxv3\/v3\/directories/).reply(this.directoryHandler)
  }
}

export default FilesMock
