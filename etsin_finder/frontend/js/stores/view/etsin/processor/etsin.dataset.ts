import { action } from 'mobx'
import EtsinProcessor, { type IdFetchParams, type FetchResponse } from '.'
import type Env from '@/stores/domain/env'

export class DatasetProcessorV3 extends EtsinProcessor {
  constructor(Env: Env) {
    super(Env)
  }

  // inherited properties
  // Env : domain.Env
  // client : AbortClient

  getInitialDataset() {
    const initialDatasetJson = document.getElementById('initial-dataset')
    try {
      if (initialDatasetJson) {
        const initialDataset = JSON.parse(initialDatasetJson.textContent)
        // Remove initial dataset so it is refreshed from
        // Metax if user navigates away from dataset and back
        initialDatasetJson.remove()
        return initialDataset
      }
    } catch (err) {
      console.error(err)
    }
  }

  @action.bound fetch({ id, resolved, rejected }: IdFetchParams): FetchResponse {
    const url = this.Env.metaxUrls.dataset(id)

    // If dataset was already provided by the backend, don't fetch it from Metax
    if (!this.Env.Flags.flagEnabled('ETSIN.FORCE_DATASET_FETCH')) {
      const initialDataset = this.getInitialDataset()
      if (initialDataset?.id === id) {
        return { id, promise: resolved(initialDataset), abort: () => {} }
      }
    }

    const tag = `dataset-${id}`
    const promise = this.client
      .get(url, {
        tag,
        params: {
          // These should be the same parameters the backend index views get_dataset logic uses
          include_removed: true,
          expand_catalog: true,
          include_allowed_actions: true,
          include_metrics: true,
        },
      })
      .then((res: any) => {
        resolved(res.data)
      })
      .catch((error: any) => rejected(error))
    return { id, promise, abort: () => this.client.abort(tag) }
  }

  @action.bound
  fetchEmails({ id, resolved, rejected }: IdFetchParams) {
    const url = this.Env.metaxUrls.datasetContact(id)
    const tag = `dataset-${id}-emails`
    const promise = this.client
      .get(url, {
        tag,
        params: {
          include_removed: true,
        },
      })
      .then((res: any) => {
        resolved(res.data)
      })
      .catch((error: any) => rejected(error))
    return { id, promise, abort: () => this.client.abort(tag) }
  }
}

export default DatasetProcessorV3
