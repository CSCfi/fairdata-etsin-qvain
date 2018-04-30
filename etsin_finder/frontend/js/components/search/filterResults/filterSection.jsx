import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faAngleDown from '@fortawesome/fontawesome-free-solid/faAngleDown'
import PropTypes from 'prop-types'

import checkDataLang from '../../../utils/checkDataLang'
import ElasticQuery from '../../../stores/view/elasticquery'
import FilterItem from './filterItem'

class FilterSection extends Component {
  constructor(props) {
    super(props)

    // TODO: should this be in an app-level storage?
    this.aggregations = {
      organization: {
        title: { en: 'Organization', fi: 'Organisaatio' },
        aggregation: { und: 'organization' },
        term: { und: 'organization_name.keyword' },
      },
      creator: {
        title: { en: 'Creator', fi: 'Luoja' },
        aggregation: { und: 'creator' },
        term: { und: 'creator_name.keyword' },
      },
      field_of_science: {
        title: { en: 'Field of Science', fi: 'Tieteenala' },
        aggregation: { en: 'field_of_science_en', fi: 'field_of_science_fi' },
        term: {
          en: 'field_of_science.pref_label.en.keyword',
          fi: 'field_of_science.pref_label.fi.keyword',
        },
      },
      keyword: {
        title: { en: 'Keyword', fi: 'Avainsana' },
        aggregation: { en: 'keyword_en', fi: 'keyword_fi' },
        term: { en: 'theme.label.en.keyword', fi: 'theme.label.fi.keyword' },
      },
      infrastructure: {
        title: { en: 'Research Infra', fi: 'Tutkimusinfra' },
        aggregation: { en: 'infrastructure_en', fi: 'infrastructure_fi' },
        term: {
          en: 'infrastructure.pref_label.en.keyword',
          fi: 'infrastructure.pref_label.fi.keyword',
        },
      },
      project: {
        title: { en: 'Project', fi: 'Projekti' },
        aggregation: { und: 'project' },
        term: { und: 'project_name.keyword' },
      },
      file_type: {
        title: { en: 'File Type', fi: 'Tiedostotyyppi' },
        aggregation: { en: 'file_type_en', fi: 'file_type_fi' },
        term: {
          en: 'file_type.pref_label.en.keyword',
          fi: 'file_type.pref_label.fi.keyword',
        },
      },
    }
    this.state = {
      open: false,
    }
  }

  toggleFilter = () => {
    this.setState({
      open: !this.state.open,
    })
  }

  render() {
    if (ElasticQuery.results.total === 0) {
      return null
    }
    if (this.aggregations[this.props.aggregation] !== undefined) {
      // Figure out languages
      const { currentLang } = this.props.Stores.Locale
      const title = this.aggregations[this.props.aggregation].title
      const aggregation = this.aggregations[this.props.aggregation].aggregation
      const term = this.aggregations[this.props.aggregation].term
      this.titleName = checkDataLang(title, currentLang)
      this.aggregationName = checkDataLang(aggregation, currentLang)
      this.termName = checkDataLang(term, currentLang)
    }

    // Don't render unknown or empty
    if (
      this.aggregations[this.props.aggregation] === undefined ||
      ElasticQuery.results.aggregations[this.aggregationName] === 'undefined' ||
      ElasticQuery.results.aggregations[this.aggregationName].buckets.length <= 0
    ) {
      return ''
    }

    return (
      <div className="filter-section">
        <button className="filter-category" onClick={this.toggleFilter}>
          {this.titleName}
          <FontAwesomeIcon icon={faAngleDown} size="2x" />
        </button>
        <div className={`filter-items ${this.state.open ? 'open' : ''}`}>
          <ul>
            {ElasticQuery.results.aggregations[this.aggregationName].buckets.map(item => (
              <FilterItem
                key={item.key}
                item={item}
                aggregationName={this.aggregationName}
                term={this.termName}
                tabIndex={this.state.open ? '0' : '-1'}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default inject('Stores')(observer(FilterSection))

FilterSection.propTypes = {
  aggregation: PropTypes.string.isRequired,
  Stores: PropTypes.shape({
    Locale: PropTypes.shape({
      currentLang: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}
