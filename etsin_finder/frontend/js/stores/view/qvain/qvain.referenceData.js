import axios from 'axios'
import { observable, makeObservable } from 'mobx'

import { METAX_FAIRDATA_ROOT_URL } from '../../../utils/constants'

// Mapping for reference types that aren't a direct '_' -> '-' change
const v2ToV3Mapping = {
  keyword: 'themes',
  field_of_science: 'fields-of-science',
  use_category: 'use-categories',
}

const commonFields = new Set(['value', 'label', 'id', 'parents'])
const extraFields = {
  file_format_version: new Set(['fileFormat', 'formatVersion']),
}

class ReferenceData {
  @observable cache = {}

  constructor(Qvain) {
    this.Qvain = Qvain
    this.Env = Qvain.Env
    this.getOptions = this.getOptions.bind(this)
    this.getLocalizedOptions = this.getLocalizedOptions.bind(this)
    makeObservable(this)
  }

  getV3ReferenceDataType(referenceData) {
    return v2ToV3Mapping[referenceData] || `${referenceData.replaceAll('_', '-')}s`
  }

  esReferenceDataToOptions(data) {
    const hits = data.hits.hits
    return hits.map(hit => ({
      value: hit._source.uri,
      label: hit._source.label,
      id: hit._source.id,
      parents: hit._source.parent_ids || [],
      fileFormat: hit._source.input_file_format,
      formatVersion: hit._source.output_format_version,
    }))
  }

  v3ReferenceDataToOptions(data) {
    const d = data.results || data // data in data.results when pagination enabled
    return d.map(value => ({
      value: value.url,
      label: value.pref_label,
      id: value.id,
      parents: value.broader || [],
      fileFormat: value.file_format,
      formatVersion: value.format_version,
    }))
  }

  getV3Url(referenceData, { searchText }) {
    const type = this.getV3ReferenceDataType(referenceData)
    let url = `${this.Env.metaxV3Url('referenceData', type)}`
    if (searchText == null) {
      url += '?pagination=false'
    } else {
      url += `?pagination=true&limit=100&pref_label=${encodeURIComponent(searchText)}`
    }
    return url
  }

  getV2Url(referenceData, { searchText }) {
    let url = `${METAX_FAIRDATA_ROOT_URL}/es/reference_data/${referenceData}/_search`
    if (searchText == null) {
      url += '?size=1000'
    } else {
      url += `?size=100&q=*${encodeURIComponent(searchText)}*`
    }
    return url
  }

  cleanupExtraFields(referenceData, options) {
    const fields = new Set([...commonFields, ...(extraFields[referenceData] || [])])
    return options.map(option =>
      Object.fromEntries(Object.entries(option).filter(([key]) => fields.has(key)))
    )
  }

  async getOptions(referenceData, { client = axios, searchText } = {}) {
    let url
    if (this.Env.Flags.flagEnabled('QVAIN.METAX_V3.FRONTEND')) {
      url = this.getV3Url(referenceData, { searchText })
    } else {
      url = this.getV2Url(referenceData, { searchText })
    }
    let options = this.cache[url]
    if (options === undefined) {
      const res = await client.get(url)
      if (this.Env.Flags.flagEnabled('QVAIN.METAX_V3.FRONTEND')) {
        options = this.v3ReferenceDataToOptions(res.data)
      } else {
        options = this.esReferenceDataToOptions(res.data)
      }
      options = this.cleanupExtraFields(referenceData, options)
      if (!searchText) {
        this.cache[url] = options
      }
    }

    return options
  }

  async getLocalizedOptions(field, { client = axios, searchText } = {}) {
    const options = await this.getOptions(field, { client, searchText })
    const refsFi = options.map(option => ({
      value: option.value,
      label: option.label.fi,
    }))
    const refsEn = options.map(option => ({
      value: option.value,
      label: option.label.en,
    }))
    return {
      en: refsEn,
      fi: refsFi,
    }
  }
}

export default ReferenceData
