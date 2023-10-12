import { makeObservable, override, action } from 'mobx'
import Packages from '../../packages'
import createFilesStore from '../etsin.files'
import EtsinProcessor from '.'

class FilesProcessor extends EtsinProcessor {
  constructor(Env) {
    super(Env)
    makeObservable(this)
    this.Packages = new Packages(Env)
    this.Files = createFilesStore(Env)
    this.client = this.Files
  }

  @override
  async fetch({ dataset, resolved, rejected }) {
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
}

export default FilesProcessor
