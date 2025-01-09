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
      const allDatasets = latestDatasets
        .map(d => (d.dataset_version_set.length > 0 ? d.dataset_version_set : [d]))
        .flat()
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
    // Group datasets by version sets
    const datasetVersions = this.datasets.map(d =>
      d.dataset_version_set.length > 0 ? d.dataset_version_set : [d]
    )
    // Remove versions that are removed or drafts of an existing dataset
    return datasetVersions
      .map(versions => versions.filter(v => !v.draft_of && !v.date_removed))
      .filter(versions => versions.length > 0)
  }

  @override removeDataset(dataset) {
    dataset.date_removed = new Date() // datasets that have date_removed are ignored in the list
  }
}

export default QvainDatasetsV3
