import axios from 'axios'

const queryES = (query) => {
  // Handle user search query
  let queryObject;
  if (query) {
    queryObject = {
      multi_match: {
        query,
        fields: ['title.en', 'title.fi'], // todo
      },
    }
  } else {
    // No user search query, fetch all docs
    queryObject = {
      match_all: {},
    }
  }

  const request = axios.post('/es/metax/dataset/_search', {
    size: 20,
    query: queryObject,
    aggregations: {
      organization: {
        terms: {
          field: 'organization_name.keyword',
        },
      },
      creator: {
        terms: {
          field: 'creator_name.keyword',
        },
      },
      field_of_science_en: {
        terms: {
          field: 'field_of_science.pref_label.en.keyword',
        },
      },
      field_of_science_fi: {
        terms: {
          field: 'field_of_science.pref_label.fi.keyword',
        },
      },
      keyword_en: {
        terms: {
          field: 'theme.label.en.keyword',
        },
      },
      keyword_fi: {
        terms: {
          field: 'theme.label.fi.keyword',
        },
      },
    },
  })

  return request
}

export default queryES
