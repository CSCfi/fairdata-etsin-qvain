import axios from 'axios';

const getReferenceData = (referenceData) => axios.get(`https://metax.fairdata.fi/es/reference_data/${referenceData}/_search?size=1000`)

export default getReferenceData;

export const getLocalizedOptions = (field) => getReferenceData(field).then(res => {
  const hits = res.data.hits.hits
  const refsFi = hits.map(hit => ({
    value: hit._source.id,
    label: hit._source.label.fi
  }))
  const refsEn = hits.map(hit => ({
    value: hit._source.id,
    label: hit._source.label.en
  }))
  return {
    en: refsEn,
    fi: refsFi
  }
})
