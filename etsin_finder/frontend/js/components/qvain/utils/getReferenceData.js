import axios from 'axios'

import { METAX_FAIRDATA_ROOT_URL } from '../../../utils/constants'

const getReferenceData = referenceData =>
  axios.get(`${METAX_FAIRDATA_ROOT_URL}/es/reference_data/${referenceData}/_search?size=1000`)

export default getReferenceData

export const getLocalizedOptions = field =>
  getReferenceData(field).then(res => {
    const hits = res.data.hits.hits
    const refsFi = hits.map(hit => ({
      value: hit._source.uri,
      label: hit._source.label.fi,
    }))
    const refsEn = hits.map(hit => ({
      value: hit._source.uri,
      label: hit._source.label.en,
    }))
    return {
      en: refsEn,
      fi: refsFi,
    }
  })

export const getReferenceDataAsync = (inputValue, lang) =>
  new Promise((resolve, reject) => {
    axios
      .get(
        `${METAX_FAIRDATA_ROOT_URL}/es/reference_data/keyword/_search?size=100&filter_path=hits.hits._source&q=label.${lang}:${inputValue}*`
      )
      .then(res => {
        const data = res.data
        let hits = []

        if ('hits' in data) {
          hits = data.hits.hits
        } else {
          reject()
        }

        const options = hits.map(hit => {
          const option = {
            label: hit._source.label[lang],
            value: hit._source.uri,
            locale: hit._source.label,
          }
          return option
        })
        resolve(options)
      })
      .catch(err => {
        console.error(err)
      })
  })
