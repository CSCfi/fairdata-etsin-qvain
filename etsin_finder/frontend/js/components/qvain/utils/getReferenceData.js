import axios from 'axios'

import { METAX_FAIRDATA_ROOT_URL } from '../../../utils/constants'

export const getReferenceData = (referenceData, { client = axios } = {}) =>
  client.get(`${METAX_FAIRDATA_ROOT_URL}/es/reference_data/${referenceData}/_search?size=1000`)

export default getReferenceData

export const getLocalizedOptions = (field, { client = axios } = {}) =>
  getReferenceData(field, { client }).then(res => {
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
