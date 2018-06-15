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
import { inject, observer } from 'mobx-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faAngleDown from '@fortawesome/fontawesome-free-solid/faAngleDown'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { mix } from 'polished'

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
        aggregation: { en: 'organization_name_en', fi: 'organization_name_fi' },
        term: { en: 'organization_name_en.keyword', fi: 'organization_name_fi.keyword' },
      },
      creator: {
        title: { en: 'Creator', fi: 'Tekijä' },
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
        aggregation: { en: 'project_name_en', fi: 'project_name_fi' },
        term: { en: 'project_name_en.keyword', fi: 'project_name_fi.keyword' },
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
      <Section>
        <FilterCategory onClick={this.toggleFilter}>
          {this.titleName}
          <FontAwesomeIcon icon={faAngleDown} size="2x" />
        </FilterCategory>
        <FilterItems className={this.state.open ? 'open' : ''}>
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
        </FilterItems>
      </Section>
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

const Section = styled.div`
  margin-bottom: 4px;
`

const FilterCategory = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${p => p.theme.color.dark};
  border-radius: 0;
  width: 100%;
  text-align: left;
  border: 2px solid ${p => p.theme.color.lightgray};
  border-bottom: none;
  padding: 1em 1.5em;
  background-color: ${p => p.theme.color.lightgray};
  font-weight: 700;
  transition: all 0.3s ease;
  margin: 0;
  svg {
    pointer-events: none;
    height: 0.7em;
    display: flex;
    align-items: center;
  }
  &:focus,
  &:hover {
    outline: none;
    background-color: ${p => mix(0.9, p.theme.color.lightgray, 'black')};
    border-color: ${p => mix(0.9, p.theme.color.lightgray, 'black')};
  }
  &:focus + .filter-items,
  &:hover + .filter-items {
    border-color: ${p => mix(0.9, p.theme.color.lightgray, 'black')};
  }
`

const FilterItems = styled.div`
  border: 2px solid ${p => p.theme.color.lightgray};
  padding: 0em 1em;
  max-height: 0px;
  overflow: hidden;
  transition: all 0.3s ease;
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    transition: all 0.3s ease;
    li {
      max-height: 0;
      overflow: hidden;
      transition: all 0.3s ease;
      button:hover {
        text-decoration: underline;
        cursor: pointer;
      }
      button.active {
        background: ${p => p.theme.color.primary};
        color: ${p => p.theme.color.white};
      }
    }
  }
  &.open {
    max-height: 1000px;
    padding: 1em 1em;
    li {
      max-height: 140px;
    }
  }
  button {
    background: transparent;
    border: none;
    padding: 0.3em 0.8em;
    border-radius: 0.7em;
    margin: 0 0 5px 0;
    color: ${p => p.theme.color.dark};
    text-align: left;
    &:focus {
      outline: none;
      color: ${p => p.theme.color.primary};
      text-decoration: underline;
    }
  }
`
