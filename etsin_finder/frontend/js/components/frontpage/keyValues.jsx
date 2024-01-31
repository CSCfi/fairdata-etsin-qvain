{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { Component } from 'react'
import styled from 'styled-components'

import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import ContentBox from '../general/contentBox'
import { withStores } from '@/stores/stores'
import AbortClient, { isAbort } from '@/utils/AbortClient'
import FilterValue, { ValueList } from './FilterValue'

class KeyValues extends Component {
  constructor(props) {
    super(props)

    this.state = {
      datasetsNum: 0,
      keywordsNum: 0,
      fieldOfScienceNum: 0,
      researchNum: 0,
      loaded: false,
      error: false,
    }

    this.client = new AbortClient()
  }

  componentDidMount() {
    this.getValues()
  }

  componentWillUnmount() {
    this.client.abort()
  }

  getValues() {
    const datasets = this.client.get('/es/metax/dataset/_count', {
      query: {
        match_all: {},
      },
    })

    const es = this.client.post('/es/metax/dataset/_search', {
      aggs: {
        // label.en and label.fi always have same cardinality
        // for keywords, use the english field
        distinct_keywords: { cardinality: { field: 'all_keywords_en' } },
        distinct_fieldsofscience: {
          cardinality: { field: 'field_of_science.pref_label.en.keyword' },
        },
        distinct_projects: { cardinality: { field: 'project_name_en.keyword' } },
      },
    })

    const allLoaded = Promise.all([datasets, es])
    allLoaded
      .then(res => {
        this.setState({
          datasetsNum: res[0].data.count,
          keywordsNum: res[1].data.aggregations.distinct_keywords.value,
          fieldOfScienceNum: res[1].data.aggregations.distinct_fieldsofscience.value,
          researchNum: res[1].data.aggregations.distinct_projects.value,
          loaded: true,
        })
      })
      .catch(err => {
        console.log(err)
        if (isAbort(err)) {
          return
        }
        console.error('Error loading keyvalues')
        this.setState({
          error: err,
        })
      })
  }

  render() {
    const SearchFilters = this.props.Stores.SearchFilters
    if (this.state.error) {
      return null
    }
    return (
      <CustomBox>
        <ValueList>
          <FilterValue
            loaded={this.state.loaded}
            to="/datasets"
            label="home.key.dataset"
            tooltip="home.tooltip.datasets"
            value={this.state.datasetsNum}
          />
          <FilterValue
            loaded={this.state.loaded}
            to="/datasets"
            label="home.key.keywords"
            tooltip="home.tooltip.keywords"
            value={this.state.keywordsNum}
            onClick={() => SearchFilters.toggleKeyword()}
          />
          <FilterValue
            loaded={this.state.loaded}
            to="/datasets"
            label="home.key.fos"
            tooltip="home.tooltip.fos"
            value={this.state.fieldOfScienceNum}
            onClick={() => SearchFilters.toggleFieldOfScience()}
          />
          <FilterValue
            loaded={this.state.loaded}
            to="/datasets"
            label="home.key.research"
            tooltip="home.tooltip.research"
            value={this.state.researchNum}
            onClick={() => SearchFilters.toggleProject()}
          />
        </ValueList>
      </CustomBox>
    )
  }
}

KeyValues.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default withStores(observer(KeyValues))

const CustomBox = styled(ContentBox)`
  margin-bottom: 2em;
`
