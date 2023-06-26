import { makeObservable, override } from 'mobx'
import urls from '@/utils/urls'
import AbortClient from "@/utils/AbortClient"
import EtsinProcessor from '.'

class RelationsProcessor extends EtsinProcessor {
  constructor() {
    super()
    makeObservable(this)
    this.client = new AbortClient()
  }

  @override fetch({ id, resolved, rejected }) {
    const url = urls.common.relatedDatasets(id)
    const tag = `relations-${id}`
    const promise = this.client
    .get(url, { tag })
    .then((res) => resolved(res.data))
    .catch(rejected)

    return {id, promise , abort: () => this.client.abort(tag)}
  }
}

export default RelationsProcessor
