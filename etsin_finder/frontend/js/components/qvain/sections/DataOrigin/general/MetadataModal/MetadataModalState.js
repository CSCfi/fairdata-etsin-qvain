import getResponseError from '@/components/qvain/utils/responseError'
import { getPASMeta } from '@/stores/view/common.files.items'
import AbortClient, { isAbort } from '@/utils/AbortClient'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'

export default class MetadataModalState {
  client = new AbortClient()

  // File characteristics (PAS Metadata)
  @observable values = {
    fileFormat: undefined,
    formatVersion: undefined,
    encoding: undefined,
    csvDelimiter: undefined,
    csvRecordSeparator: undefined,
    csvQuotingChar: undefined,
    csvHasHeader: undefined,
  }

  @observable formatFetchStatus = 'loading'

  @observable fileChanged = false

  @observable confirmClose = false

  @observable response = null

  @observable loading = false

  @observable formatOptions = []

  @observable fileFormatVersions = []

  @observable formatVersionsMap = {} // Maps a file format to supported format versions

  @observable file = null

  constructor(Stores) {
    this.setFormatVersion = this.setFormatVersion.bind(this)
    this.setEncoding = this.setEncoding.bind(this)
    this.setCsvDelimiter = this.setCsvDelimiter.bind(this)
    this.setCsvRecordSeparator = this.setCsvRecordSeparator.bind(this)
    this.setCsvHasHeader = this.setCsvHasHeader.bind(this)
    this.Stores = Stores
    makeObservable(this)
  }

  @action.bound setResponse(response) {
    this.response = response
  }

  @action.bound setFileChanged(value) {
    this.fileChanged = value
  }

  @action.bound openFile(file) {
    this.file = file
    if (file) {
      const pasObj = file.pasMeta || {}
      this.confirmClose = false
      this.criticalError = false

      const newValues = {
        fileFormat: pasObj.fileFormat ?? '',
        formatVersion: pasObj.formatVersion ?? '',
        encoding: pasObj.encoding ?? '',
        csvDelimiter: pasObj.csvDelimiter ?? '',
        csvRecordSeparator: pasObj.csvRecordSeparator ?? '',
        csvQuotingChar: pasObj.csvQuotingChar ?? '',
        csvHasHeader: pasObj.csvHasHeader ?? '',
      }

      this.values = newValues
      this.fetchformatVersions()
    } else {
      this.values = {
        fileFormat: undefined,
        formatVersion: undefined,
        encoding: undefined,
        csvDelimiter: undefined,
        csvRecordSeparator: undefined,
        csvQuotingChar: undefined,
        csvHasHeader: undefined,
      }
    }
  }

  @action
  setFormatFetchStatus(value) {
    this.formatFetchStatus = value
  }

  getformatVersionOptions() {
    return (this.formatVersionsMap[this.values.fileFormat] || []).map(v => ({
      value: v,
      label: v,
    }))
  }

  dataToV3(data) {
    const { file_format: fileFormat, format_version: formatVersion, ...v3Data } = data
    const formatUrl = this.fileFormatVersions.find(
      v => v.fileFormat === fileFormat && v.formatVersion === (formatVersion || '')
    )?.value
    if (formatUrl) {
      v3Data.file_format_version = {
        url: formatUrl,
      }
    }
    return v3Data
  }

  patchFileCharacteristics(identifier, data) {
    const { original } = this.Stores.Qvain
    const { metaxV3Url } = this.Stores.Env
    const crId = original?.identifier

    const url = metaxV3Url('fileCharacteristics', identifier)
    const request = this.client
      .put(url, this.dataToV3(data), {
        params: { dataset: crId },
        headers: { 'Content-Type': 'application/json' },
      })
      .then(resp => ({
        data: {
          characteristics: resp.data,
        },
      }))
    return request.catch(error => {
      if (!isAbort(error)) {
        throw error
      }
    })
  }

  @action.bound
  setValue(field, option) {
    this.values[field] = option?.value
    this.fileChanged = true
  }

  setFormatVersion(versionOption) {
    this.setValue('formatVersion', versionOption)
  }

  setEncoding(encodingOption) {
    this.setValue('encoding', encodingOption)
  }

  setCsvDelimiter = csvDelimiterOption => {
    this.setValue('csvDelimiter', csvDelimiterOption)
  }

  setCsvRecordSeparator = csvRecordSeparatorOption => {
    this.setValue('csvRecordSeparator', csvRecordSeparatorOption)
  }

  setCsvHasHeader = csvHasHeaderOption => {
    this.setValue('csvHasHeader', csvHasHeaderOption)
  }

  @action.bound setFileFormat(formatOption) {
    this.values.fileFormat = formatOption?.value
    this.values.formatVersion = ''
    this.fileChanged = true
  }

  handleChangeCsvQuotingChar = event => {
    this.setValue('csvQuotingChar', event.target)
  }

  requestClose = () => {
    if (this.loading) {
      return
    }

    if (!this.fileChanged) {
      this.close()
    } else {
      this.showConfirmClose()
    }
  }

  @action.bound showConfirmClose() {
    this.confirmClose = true
  }

  @action.bound hideConfirmClose() {
    this.confirmClose = false
  }

  @action.bound clearResponse() {
    this.response = null
  }

  close = () => {
    this.Stores.Qvain.setMetadataModalFile(null)
  }

  getCharacteristics = () => {
    const characteristics = {
      file_format: this.values.fileFormat,
      format_version: this.values.formatVersion,
      encoding: this.values.encoding,
      csv_has_header: this.values.csvHasHeader,
      csv_delimiter: this.values.csvDelimiter,
      csv_record_separator: this.values.csvRecordSeparator,
      csv_quoting_char: this.values.csvQuotingChar,
    }

    if (!this.isCsv) {
      characteristics.csv_has_header = undefined
      characteristics.csv_delimiter = undefined
      characteristics.csv_record_separator = undefined
      characteristics.csv_quoting_char = undefined
    }

    const nonEmpty = Object.fromEntries(
      Object.entries(characteristics).filter(([, v]) => v != null && v !== '')
    )
    return nonEmpty
  }

  validateMetadata() {
    const { translate } = this.Stores.Locale
    const { fileMetadataSchema } = this.Stores.Qvain.Files
    fileMetadataSchema.validate(this.getCharacteristics(), { strict: true })

    // Additional validation for formatVersion
    const versions = this.formatVersionsMap[this.values.fileFormat] || []

    if (versions.length === 0) {
      if (this.values.formatVersion) {
        throw new Error(translate('qvain.files.metadataModal.errors.formatVersionNotAllowed'))
      }
    } else if (!versions.includes(this.values.formatVersion)) {
      throw new Error(translate('qvain.files.metadataModal.errors.formatVersionRequired'))
    }
  }

  @action.bound setLoading(value) {
    this.loading = value
  }

  saveChanges = async () => {
    if (this.loading) {
      return
    }

    try {
      this.validateMetadata()
    } catch (error) {
      this.setResponse({
        error: error.message,
      })
      return
    }

    try {
      this.setLoading(true)

      const patchPromise = this.patchFileCharacteristics(
        this.file.identifier,
        this.getCharacteristics()
      )
      const response = await patchPromise

      // Update file hierarchy with response data, close modal
      this.Stores.Qvain.Files.applyPASMeta(getPASMeta(response.data))
      this.setFileChanged(false)
      this.close()
    } catch (err) {
      console.error(err)
      this.setResponse({
        error: getResponseError(err),
      })
    } finally {
      this.setLoading(false)
    }
  }

  @computed get isCsv() {
    return this.values.fileFormat === 'text/csv'
  }

  async fetchformatVersions() {
    const { translate } = this.Stores.Locale
    this.setFormatFetchStatus('loading')
    try {
      // Create a list of available versions for each supported file format.
      const fileFormatVersions = await this.Stores.Qvain.ReferenceData.getOptions(
        'file_format_version',
        { client: this.client }
      )

      // get array of available versions for each file format
      const formatVersionsMap = {}
      fileFormatVersions.forEach(formatVersion => {
        const fileFormat = formatVersion.fileFormat
        if (formatVersionsMap[fileFormat] === undefined) {
          formatVersionsMap[fileFormat] = []
        }
        if (formatVersion.formatVersion !== '') {
          formatVersionsMap[fileFormat].push(formatVersion.formatVersion)
        }
      })

      // use natural sort order for version numbers
      const sortArray = arr => arr.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      Object.values(formatVersionsMap).forEach(versions => sortArray(versions))
      const formatOptions = Object.keys(formatVersionsMap)
      sortArray(formatOptions)

      runInAction(() => {
        this.formatOptions = formatOptions.map(v => ({ value: v, label: v }))
        this.formatVersionsMap = formatVersionsMap
        this.fileFormatVersions = fileFormatVersions
      })

      this.setFormatFetchStatus('done')
    } catch (e) {
      if (!isAbort(e)) {
        this.setResponse({
          criticalError: true,
          error: translate('qvain.files.metadataModal.errors.loadingFileFormats'),
        })
      }
      this.setFormatFetchStatus('error')
      throw e
    }
  }
}
