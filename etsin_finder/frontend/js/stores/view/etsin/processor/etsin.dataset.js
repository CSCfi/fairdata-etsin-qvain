import { makeObservable, override } from 'mobx'
import urls from '@/utils/urls'
import AbortClient from "@/utils/AbortClient"
import EtsinProcessor from '.'

class DatasetProcessorV2 extends EtsinProcessor {
  constructor() {
    super()
    makeObservable(this)
    this.client = new AbortClient()
  }

  @override fetch({ id, resolved, rejected }) {
    // this.Packages.clearPackages()
    const url = urls.dataset(id)
    const tag = `dataset-${id}`
    const promise = this.client
      .get(url, {
        tag
      })
      .then(res => {
        res.data.catalog_record.email_info = res.data.email_info
        resolved(res.data)
      })
      .catch(rej => rejected(rej))
      return {id, promise, abort: () => this.client.abort(tag)}
  }
}

export default DatasetProcessorV2
