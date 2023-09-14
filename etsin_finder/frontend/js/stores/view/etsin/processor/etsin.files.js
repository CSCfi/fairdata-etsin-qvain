import { makeObservable, override, action } from 'mobx'
import Packages from '../../packages'
import Files from '../../files'
import EtsinProcessor from '.'

const QueryFields = {
  file: [
    'file_path',
    'file_name',
    'file_format',
    'identifier',
    'byte_size',
    'open_access',
    'file_format',
    'file_characteristics',
    'checksum_value',
  ],
  directory: ['directory_path', 'directory_name', 'identifier', 'file_count', 'byte_size'],
}

class FilesProcessor extends EtsinProcessor {
  constructor(Env) {
    super(Env)
    makeObservable(this)
    this.Packages = new Packages(Env)
    this.Files = new Files()
    this.client = this.Files
  }

  @override
  async fetch({ catalogRecord, resolved, rejected }) {
    if (!catalogRecord) return null
    this.Packages.clearPackages()
    const id = catalogRecord.identifier
    const promise = this.Files.openDataset(catalogRecord)
      .then(() => {
        if (resolved) resolved(this.Files)
      })
      .catch(rej => {
        if (rejected) rejected(rej)
      })
    return { id, promise, abort: () => this.client.abort() }
  }

  @action.bound
  async fetchPackages({ catalogRecord, resolved, rejected }) {
    try {
      await this.Packages.fetch(catalogRecord.identifier)
      if (resolved) resolved(this.Packages)
    } catch (e) {
      console.log('failed to fetch packages:', e)
      if (rejected) rejected(e)
    }
  }

  @action.bound
  fetchFolderData(id, crID) {
    const fileFields = QueryFields.file.join(',')
    const dirFields = QueryFields.directory.join(',')
    return new Promise((resolve, reject) => {
      this.client
        .get(
          `/api/files/${crID}?dir_id=${id}&file_fields=${fileFields}&directory_fields=${dirFields}`
        )
        .then(res => {
          this.Files.directories.push({ id, results: res.data })
          resolve(res.data)
        })
        .catch(error => {
          this.Files.directories.push({ id, error })
          reject(error)
        })
    })
  }
}

export default FilesProcessor
