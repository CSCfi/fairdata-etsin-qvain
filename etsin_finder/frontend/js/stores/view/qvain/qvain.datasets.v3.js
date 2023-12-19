import { isAbort } from '@/utils/AbortClient'
import QvainDatasets from './qvain.datasets'
import Adapter from './qvain.adapter'

class QvainDatasetsV3 extends QvainDatasets {
  loadDatasets = async () => {
    this.clearError()
    try {
      const url = this.Env.metaxV3Url('datasets')
      const response = await this.promiseManager.add(
        this.client.get(url, {
          params: { pagination: false, only_owned_or_shared: true, ordering: '-created' },
        }),
        'datasets'
      )
      const adapter = new Adapter()
      const data = response.data.map(d => adapter.convertV3ToV2(d)) || []
      const datasets = data.filter(dataset => !dataset.draft_of)
      const datasetDrafts = data.filter(dataset => dataset.draft_of)
      this.attachDrafts(datasets, datasetDrafts)
      this.setDatasets(datasets)
    } catch (error) {
      if (!isAbort(error)) {
        console.error(error)
        this.setError(error?.response?.data || error)
      }
    }
  }
}

export default QvainDatasetsV3
