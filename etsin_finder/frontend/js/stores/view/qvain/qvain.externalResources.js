import { action, makeObservable, override, computed } from 'mobx'
import { v4 as uuidv4 } from 'uuid'

import { externalResourceSchema } from './qvain.dataCatalog.schemas'
import { touch } from './track'
import Field from './qvain.field'

class ExternalResources extends Field {
  constructor(Qvain) {
    super(Qvain, ExternalResource, ExternalResourceModel, 'externalResources')
    makeObservable(this)
    this.reset()
  }

  translationsRoot = 'qvain.files.remoteResources'

  schema = externalResourceSchema

  @action
  fromBackend = (dataset, Qvain) => {
    if (dataset.remote_resources) {
      dataset.remote_resources.forEach(res => {
        touch(res.use_category)
      })
    }
    this.fromBackendBase(dataset.remote_resources, Qvain)
  }

  @action
  toBackend = () =>
    this.storage.map(p => ({
      title: p.title,
      use_category: {
        identifier: p.useCategory.url,
      },
      access_url: {
        identifier: p.accessUrl || undefined,
      },
      download_url: {
        identifier: p.downloadUrl || undefined,
      },
    }))

  @override
  reset() {
    super.reset()
  }

  @override clearInEdit() {
    super.clearInEdit()
  }

  @override async validateAndSave() {
    await super.validateAndSave()
  }

  @action setUseCategory = useCategory => {
    this.inEdit.useCategory = useCategory
  }

  @computed
  get resourceExists() {
    return !!this.storage.find(item => item.uiid === this.inEdit?.uiid)
  }
}

export const UseCategory = (name, url) => ({
  name,
  url,
})

export const ExternalResourceModel = data => ({
  uiid: uuidv4(),
  title: data.title || '',
  accessUrl: data.access_url?.identifier || '',
  downloadUrl: data.download_url?.identifier || '',
  useCategory: data.use_category
    ? UseCategory(data.use_category.pref_label, data.use_category.identifier)
    : null,
})

export const ExternalResource = ({
  title = '',
  accessUrl = '',
  downloadUrl = '',
  useCategory = null,
} = {}) =>
  ExternalResourceModel({
    title,
    access_url: accessUrl,
    download_url: downloadUrl,
    use_category: useCategory,
  })

export default ExternalResources
