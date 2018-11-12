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
import FilterItem from './filterItem'

class FilterSection extends Component {
  constructor(props) {
    super(props)

    // TODO: should this be in an app-level storage?
    this.aggregations = {
      access_type: {
        title: { en: 'Access', fi: 'Saatavuus' },
        aggregation: { en: 'access_type_en', fi: 'access_type_fi' },
        term: { en: 'access_rights.access_type.pref_label.en.keyword', fi: 'access_rights.access_type.pref_label.fi.keyword' },
      },
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
        aggregation: { en: 'all_keywords_en', fi: 'all_keywords_fi' },
        term: { en: 'all_keywords_en', fi: 'all_keywords_fi' },
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
      data_catalog: {
        title: { en: 'Data Catalog', fi: 'Datakatalogi' },
        aggregation: { en: 'data_catalog_en', fi: 'data_catalog_fi' },
        term: { en: 'data_catalog.en', fi: 'data_catalog.fi' },
      },
    }

    this.state = {
      open: false,
    }
  }

  componentWillMount() {
    this.checkActive()
  }

  toggleFilter = () => {
    this.setState({
      open: !this.state.open,
    })
  }

  checkIfValid = () => {
    if (this.aggregations[this.props.aggregation] !== undefined) {
      const { title, aggregation, term } = this.aggregations[this.props.aggregation]
      this.titleName = checkDataLang(title)
      this.aggregationName = checkDataLang(aggregation)
      this.termName = checkDataLang(term)
    }
    if (
      this.aggregations[this.props.aggregation] === undefined ||
      this.props.Stores.ElasticQuery.results.aggregations[this.aggregationName] === 'undefined' ||
      this.props.Stores.ElasticQuery.results.aggregations[this.aggregationName].buckets.length <= 0
    ) {
      return false
    }
    return true
  }

  // opens the section if it contains an active filter
  checkActive = () => {
    if (this.checkIfValid()) {
      this.props.Stores.ElasticQuery.results.aggregations[this.aggregationName].buckets.map(a => {
        if (!this.state.open) {
          const active =
            this.props.Stores.ElasticQuery.filter.filter(
              item => item.term === this.termName && item.key === a.key
            ).length > 0
          if (active) {
            this.setState({
              open: true,
            })
            return true
          }
        }
        return false
      })
    }
  }

  render() {
    if (this.props.Stores.ElasticQuery.results.total === 0) {
      return null
    }

    // Don't render unknown or empty
    if (!this.checkIfValid()) {
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
            {this.props.Stores.ElasticQuery.results.aggregations[this.aggregationName].buckets.map(
              item => (
                <FilterItem
                  key={item.key}
                  item={item}
                  aggregationName={this.aggregationName}
                  term={this.termName}
                  tabIndex={this.state.open ? '0' : '-1'}
                />
              )
            )}
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
    ElasticQuery: PropTypes.object.isRequired,
  }).isRequired,
}

const Section = styled.div`
  margin-bottom: 4px;
`

// TODO: Better filter styles and animation
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
