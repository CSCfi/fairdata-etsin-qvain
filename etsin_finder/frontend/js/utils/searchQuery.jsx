import axios from 'axios'

const searchQuery = (query, size, pageNum) => (
  new Promise((resolve, reject) => {
    let q = query;
    if (!query) {
      q = '*:*'
    }
    let page = '';
    if (pageNum > 1) {
      page = `&from=${(pageNum - 1) * size}`
    }

    axios.get(`/es/metax/dataset/_search?q=${q}&pretty&size=${size}${page}`)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      });
  })
)

export default searchQuery
