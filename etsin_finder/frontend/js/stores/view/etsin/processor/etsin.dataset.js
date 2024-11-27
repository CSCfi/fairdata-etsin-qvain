import { action, makeObservable, override } from 'mobx'
import urls from '@/utils/urls'
import EtsinProcessor from '.'

class DatasetProcessorV2 extends EtsinProcessor {
  constructor(Env) {
    super(Env)
    makeObservable(this)
  }

  // inherited properties
  // Env : domain.Env
  // client : AbortClient

  @override fetch({ id, resolved, rejected }) {
    const url = urls.dataset(id)
    const tag = `dataset-${id}`
    const promise = this.client
      .get(url, {
        tag,
      })
      .then(res => {
        res.data.catalog_record.email_info = res.data.email_info
        resolved(res.data)
      })
      .catch(rej => rejected(rej))
    return { id, promise, abort: () => this.client.abort(tag) }
  }
}

export class DatasetProcessorV3 extends EtsinProcessor {
  constructor(Env) {
    super(Env)
    makeObservable(this)
  }

  // inherited properties
  // Env : domain.Env
  // client : AbortClient

  @override fetch({ id, resolved, rejected }) {
    const url = this.Env.metaxV3Url('dataset', id)
    const tag = `dataset-${id}`
    const promise = this.client
      .get(url, {
        tag,
        params: {
          include_removed: true,
          expand_catalog: true,
          include_allowed_actions: true,
          include_metrics: true,
        },
      })
      .then(res => {
        resolved(res.data)
      })
      .catch(rej => rejected(rej))
    return { id, promise, abort: () => this.client.abort(tag) }
  }

  @action.bound
  fetchEmails({ id, resolved, rejected }) {
    const url = this.Env.metaxV3Url('datasetContact', id)
    const tag = `dataset-${id}-emails`
    const promise = this.client
      .get(url, {
        tag,
        params: {
          include_removed: true,
        },
      })
      .then(res => {
        resolved(res.data)
      })
      .catch(rej => rejected(rej))
    return { id, promise, abort: () => this.client.abort(tag) }
  }
}

export default DatasetProcessorV2
