import { makeObservable, override } from 'mobx'
import urls from '@/utils/urls'
import EtsinProcessor from '.'

class RelationsProcessor extends EtsinProcessor {
  constructor(Env) {
    super(Env)
    makeObservable(this)
  }

  // inherited properties
  // Env
  // client : AbortClient

  @override fetch({ id, resolved, rejected }) {
    const url = urls.common.relatedDatasets(id)
    const tag = `relations-${id}`
    const promise = this.client
      .get(url, { tag })
      .then(res => resolved(res.data))
      .catch(rejected)

    return { id, promise, abort: () => this.client.abort(tag) }
  }
}

export default RelationsProcessor
