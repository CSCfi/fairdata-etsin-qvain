import axios from 'axios';

const getReferenceData = (referenceData) => axios.get(`https://metax.fairdata.fi/es/reference_data/${referenceData}/_search?size=1000`)

export default getReferenceData;
