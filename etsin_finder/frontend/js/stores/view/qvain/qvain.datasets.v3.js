import { override } from 'mobx'
import { isAbort } from '@/utils/AbortClient'
import QvainDatasets from './qvain.datasets'
import Adapter from './qvain.adapter'

class QvainDatasetsV3 extends QvainDatasets {
  loadDatasets = async () => {
    this.clearError()
    try {
      // Get only latest versions of datasets
      const fields = [
        'created',
        'data_catalog',
        'dataset_versions',
        'draft_of',
        'id',
        'metadata_owner',
        'next_draft',
        'persistent_identifier',
        'state',
        'title',
      ]
      const url = this.Env.metaxV3Url('datasets')
      const response = await this.promiseManager.add(
        this.client.get(url, {
          params: {
            pagination: false,
            only_owned_or_shared: true,
            ordering: '-created',
            latest_versions: true,
            fields: fields.join(','),
          },
        }),
        'datasets'
      )
      const adapter = new Adapter()
      const latestDatasets = response.data.map(d => adapter.convertV3ToV2(d))

      // Attach drafts to original datasets
      const allDatasets = latestDatasets.map(d => d.dataset_version_set).flat()
      const datasets = allDatasets.filter(dataset => !dataset.draft_of)
      const datasetDrafts = allDatasets.filter(dataset => dataset.draft_of)
      this.attachDrafts(datasets, datasetDrafts)

      // Set latest versions as "top-level" datasets
      this.setDatasets(latestDatasets)
    } catch (error) {
      if (!isAbort(error)) {
        console.error(error)
        this.setError(error?.response?.data || error)
      }
    }
  }

  @override get datasetGroups() {
    // Return only datasets that aren't a draft of an existing one
    return this.datasets.map(d => {
      const datasets = d.dataset_version_set.filter(v => !v.draft_of)
      if (datasets.length > 0) {
        return datasets
      }
      // If the resulting dataset_versions is empty, return just the dataset. This is unlikely
      // to happen with real data because all V3 datasets have a dataset_versions and
      // datasets with draft_of should be in the same dataset_versions as the original one.
      return [d]
    })
  }
}

export default QvainDatasetsV3
