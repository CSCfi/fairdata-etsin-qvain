import { action } from 'mobx'
import Packages from '../../packages'
import createFilesStore, { EtsinFiles } from '../etsin.files'
import EtsinProcessor, { type DatasetFetchParams, type FetchResponse } from '.'
import type Env from '@/stores/domain/env'
import type AbortClient from '@/utils/AbortClient'

class FilesProcessor extends EtsinProcessor {
  Packages: Packages
  Files: EtsinFiles
  filesClient: AbortClient
  packagesClient: AbortClient

  constructor(Env: Env) {
    super(Env)
    this.Packages = new Packages(Env)
    this.Files = createFilesStore(Env)
    this.filesClient = this.Files.client
    this.packagesClient = this.Packages.client
  }

  @action.bound
  fetch({ dataset, resolved, rejected }: DatasetFetchParams): FetchResponse {
    if (!dataset.identifier) return null
    this.Packages.clearPackages()
    const id = dataset.identifier
    const promise = this.Files.openDataset(dataset)
      .then(() => {
        if (resolved) resolved(this.Files)
      })
      .catch(error => {
        if (rejected) rejected(error)
      })
    return { id, promise, abort: () => this.filesClient.abort() }
  }

  @action.bound
  fetchPackages({ dataset, resolved, rejected }: DatasetFetchParams): FetchResponse {
    const id = dataset.identifier
    const promise = this.Packages.fetch(id)
      .then(() => {
        if (resolved) resolved(this.Packages)
      })
      .catch(e => {
        console.log('failed to fetch packages:', e)
        if (rejected) rejected(e)
      })
    return { id, promise, abort: () => this.packagesClient.abort() }
  }
}

export default FilesProcessor
