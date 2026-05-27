import { action, makeObservable, override, computed } from 'mobx'
import { v4 as uuidv4 } from 'uuid'

import { externalResourceSchema, externalResourceDaasSchema } from './qvain.dataCatalog.schemas'
import { touch } from './track'
import Field from './qvain.field'
import sizeParse from '@/utils/sizeParse'

const FILE_SIZE_UNITS = {
  b: 1,
  byte: 1,
  bytes: 1,
  kb: 1024,
  mb: 1024 ** 2,
  gb: 1024 ** 3,
  tb: 1024 ** 4,
}

export const parseFileSizeToBytes = value => {
  if (!value) {
    return undefined
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(Math.round(value)) : undefined
  }

  const normalized = String(value).trim()
  if (!normalized) {
    return undefined
  }

  const plainNumber = /^\d+(\.\d+)?$/.exec(normalized)
  if (plainNumber) {
    return String(Math.round(Number(normalized)))
  }

  const withUnit = /^(\d+(\.\d+)?)\s*([a-zA-Z]+)$/.exec(normalized)
  if (!withUnit) {
    return normalized
  }

  const numericValue = Number(withUnit[1])
  const unit = withUnit[3].toLowerCase()
  const multiplier = FILE_SIZE_UNITS[unit]

  if (!multiplier || !Number.isFinite(numericValue)) {
    return normalized
  }
  return String(Math.round(numericValue * multiplier))
}

export const formatFileSizeFromBytes = value => {
  if (value === undefined || value === null || value === '') {
    return ''
  }
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return String(value)
  }
  return sizeParse(parsed) || String(value)
}

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
    const isDaasResourceStore = this.translationsRoot === 'qvain.files.daasCatalog'
    const resources = isDaasResourceStore
      ? dataset.daas_resources || dataset.remote_resources
      : dataset.remote_resources
    if (resources) {
      resources.forEach(res => {
        touch(res.use_category)
        touch(res.file_type)
      })
    }
    this.fromBackendBase(resources, Qvain)
  }

  @action
  toBackend = () =>
    this.storage.map(p => ({
      title: p.title,
      data_service: p.dataService?.url,
      use_category: {
        identifier: p.useCategory.url,
      },
      file_type: {
        identifier: p.fileType?.url || undefined,
      },
      byte_size: parseFileSizeToBytes(p.fileSize),
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
    const schema =
      this.translationsRoot === 'qvain.files.daasCatalog'
        ? externalResourceDaasSchema
        : externalResourceSchema
    const { inEdit, save, clearInEdit, setValidationError } = this
    try {
      await schema.validate(inEdit, { strict: true })
      save()
      clearInEdit()
    } catch (e) {
      setValidationError(e.message)
    }
  }

  @action.bound setUseCategory(useCategory) {
    this.inEdit.useCategory = useCategory
  }

  @action setDataService = dataService => {
    this.inEdit.dataService = dataService
  }

  @action.bound setFileType(fileType) {
    this.inEdit.fileType = fileType
  }

  @action.bound setTitleTranslation(translation, language) {
    this.inEdit.title[language] = translation
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

export const FileType = (label, url) => ({
  label,
  url,
})

export const DataService = (label, url) => ({
  label,
  url,
})

export const ExternalResourceModel = data => {
  let dataService = null
  if (typeof data.data_service === 'string') {
    dataService = DataService(null, data.data_service)
  } else if (data.data_service) {
    dataService = DataService(data.data_service.pref_label, data.data_service.identifier)
  }

  return {
    uiid: uuidv4(),
    title: data.title || {},
    fileSize: formatFileSizeFromBytes(data.byte_size ?? data.file_size),
    accessUrl: data.access_url?.identifier || '',
    downloadUrl: data.download_url?.identifier || '',
    dataService,
    useCategory: data.use_category
      ? UseCategory(data.use_category.pref_label, data.use_category.identifier)
      : null,
    fileType: data.file_type
      ? FileType(data.file_type.pref_label, data.file_type.identifier)
      : null,
  }
}

export const ExternalResource = ({
  title = {},
  fileSize = '',
  accessUrl = '',
  downloadUrl = '',
  dataService = null,
  useCategory = null,
  fileType = null,
} = {}) =>
  ExternalResourceModel({
    title,
    byte_size: fileSize,
    access_url: accessUrl,
    download_url: downloadUrl,
    data_service: dataService,
    use_category: useCategory,
    file_type: fileType,
  })

export default ExternalResources
