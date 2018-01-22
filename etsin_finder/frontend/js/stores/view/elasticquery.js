import { observable, action } from 'mobx'
import axios from 'axios'
import Locale from './language'

const fields = [
  'title.*',
  'description.*',
  'creator.name.*',
  'contributor.name.*',
  'publisher.name.*',
  'rights_holder.name.*',
  'curator.name.*',
  'keyword',
  'access_rights.license.title.*',
  'access_rights.type.identifier.*',
  'access_rights.type.pref_label.*',
  'theme.pref_label.*',
  'field_of_science.pref_label.*',
  'project.pref_label.*',
  'urn_identifier',
  'preferred_identifier',
  'other_identifier.notation',
  'other_identifier.type.pref_label.*',
]

class ElasticQuery {
  @observable filter = []
  @observable sorting = ''
  @observable search = ''
  @observable pageNum = 1
  @observable results = { hits: [], total: 0, aggregations: [] }
  @observable loading = 0

  @action
  updateSearch = newSearch => {
    this.search = newSearch
  }

  @action
  updateSorting = newSorting => {
    this.sorting = newSorting
  }

  @action
  updatePageNum = newPage => {
    this.pageNum = newPage
  }

  @action
  updateFilter = (term, key) => {
    const index = this.filter.findIndex(i => i.term === term && i.key === key)
    if (index !== -1) {
      this.filter.splice(index, 1)
    } else {
      this.filter.push({ term, key })
    }
  }

  @action
  queryES = () => {
    let queryObject
    const query = this.search
    const filters = []
    for (let i = 0; i < this.filter.length; i += 1) {
      filters.push({ term: { [this.filter[i].term]: this.filter[i].key } })
    }

    if (query) {
      queryObject = {
        bool: {
          must: [
            {
              multi_match: {
                query,
                type: 'cross_fields',
                minimum_should_match: '75%',
                operator: 'and',
                analyzer: Locale.currentLang === 'fi' ? 'finnish' : 'english',
                fields,
              },
            },
          ],
        },
      }
    } else {
      // No user search query, fetch all docs, change this to use aggregations and sorting and pagenum
      queryObject = {
        bool: {
          must: [
            {
              match_all: {},
            },
          ],
        },
      }
    }
    // adding filters if they are set
    if (filters.length > 0) {
      queryObject.bool.filter = filters
    }

    // toggle loader
    this.loading = 1

    axios
      .post('/es/metax/dataset/_search', {
        size: 20,
        query: queryObject,
        sort: ['_score'], // Sort by hit score
        // Return only the following fields in source attribute to minimize traffic
        _source: [
          'urn_identifier',
          'title.*',
          'description.*',
          'access_rights.type.identifier',
          'access_rights.license.identifier',
        ],
        highlight: {
          // pre_tags: ['<b>'], # default is <em>
          // post_tags: ['</b>'],
          fields: {
            'description.*': {},
            'title.*': {},
            // Add here more fields if highlights from other fields are required
          },
        },
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
      .then(res => {
        this.results = {
          hits: res.data.hits.hits,
          total: res.data.hits.total,
          aggregations: res.data.aggregations,
        }
        this.loading = 0
        console.log('-- QUERY DONE ---')
      })
  }
}

export default new ElasticQuery()
