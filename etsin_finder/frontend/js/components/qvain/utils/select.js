import axios from 'axios'
import { METAX_FAIRDATA_ROOT_URL } from '../../../utils/constants'

export const getCurrentValue = (field, options, lang) => {
  let current
  if (field !== undefined && (options || {})[lang] !== undefined) {
    current = options[lang].find(opt => opt.value === field.url)
  }
  if (current === undefined && field !== undefined) {
    let label
    if (field.name !== undefined) {
      label = field.name[lang] || Object.values(field.name)[0]
    } else {
      label = undefined
    }
    current = {
      value: field.url,
      label,
    }
  }
  return current
}

export const onChange = (options, lang, callback, constructFunc) => selection => {
  if (selection !== null) {
    const name = {}
    name[lang] = selection.label
    const otherLocales = Object.keys(options).filter(o => o !== lang)
    if (otherLocales.length > 0) {
      name[otherLocales[0]] = options[otherLocales[0]].find(o => o.value === selection.value).label
    }
    callback(constructFunc(name, selection.value))
  } else {
    callback(undefined)
  }
}

export const getOptions = async (ref, inputValue) => {
  if (!inputValue) return []
  const api = refDataApi(ref)
  const response = await api.get(`_search?size=100&q=*${inputValue}*`)
  return parseRefResponse(response)
}

const refDataApi = ref =>
  axios.create({
    baseURL: `${METAX_FAIRDATA_ROOT_URL}/es/reference_data/${ref}/`,
  })

const parseRefResponse = res => {
  const hits = res.data.hits.hits
  const refsFi = hits.map(hit => ({
    value: hit._source.uri,
    label: hit._source.label.fi || hit._source.label.und,
  })).sort((a, b) => a.label.localeCompare(b.label))
  const refsEn = hits.map(hit => ({
    value: hit._source.uri,
    label: hit._source.label.en || hit._source.label.und,
  })).sort((a, b) => a.label.localeCompare(b.label))
  return {
    en: refsEn,
    fi: refsFi,
  }
}
