import axios from 'axios'

const queryES = (query) => {
  // Handle user search query

  let queryObject;
  if (query) {
    queryObject = {
      multi_match: {
        query,
        fields: [
          'title.*',
          'description.*',
          'creator.name.*',
          'contributor.name.*',
          'publisher.name.*',
          'rights_holder.name.*',
          'curator.name.*',
          'keyword',
          'access_rights.license.pref_label.*',
          'access_rights.type.identifier.*',
          'access_rights.type.pref_label.*',
          'theme.pref_label.*',
          'field_of_science.pref_label.*',
          'project.pref_label.*',
          'urn_identifier',
          'preferred_identifier',
          'other_identifier.notation',
          'other_identifier.type.pref_label.*',
        ],
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
