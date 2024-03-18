import { makeObservable, override, action } from 'mobx'
import Packages from '../../packages'
import createFilesStore from '../etsin.files'
import EtsinProcessor from '.'

class FilesProcessor extends EtsinProcessor {
  constructor(Env, useV3) {
    super(Env)
    makeObservable(this)
    this.Packages = new Packages(Env, useV3)
    this.Files = createFilesStore(Env)
    this.filesClient = this.Files.client
    this.packagesClient = this.Packages.client
  }

  @override
  fetch({ dataset, resolved, rejected }) {
    if (!dataset.identifier) return null
    this.Packages.clearPackages()
    const id = dataset.identifier
    const promise = this.Files.openDataset(dataset)
      .then(() => {
        if (resolved) resolved(this.Files)
      })
      .catch(rej => {
        if (rejected) rejected(rej)
      })
    return { id, promise, abort: () => this.filesClient.abort() }
  }

  @action.bound
  fetchPackages({ dataset, resolved, rejected }) {
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
