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
import Translate from 'react-translate-component'
import counterpart from 'counterpart'
import axios from 'axios'

import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import ContentBox from '../general/contentBox'
import { withStores } from '../../stores/stores'

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
      lang: this.props.Stores.Locale.currentLang,
    }

    this.promises = []
  }

  componentDidMount() {
    this.getValues()
    counterpart.onLocaleChange(this.localeChanged)
  }

  componentWillUnmount() {
    this.promises.forEach(promise => promise.cancel())
    counterpart.offLocaleChange(this.localeChanged)
  }

  getValues() {
    const datasets = axios.get('/es/metax/dataset/_count', {
      query: {
        match_all: {},
      },
    })

    const es = axios.post('/es/metax/dataset/_search', {
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
    this.promises.push(allLoaded)
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
        console.error('Error loading keyvalues')
        this.setState({
          error: err,
        })
      })
  }

  localeChanged = () => {
    this.setState({
      lang: this.props.Stores.Locale.currentLang === 'fi' ? 'en' : 'fi',
    })
  }

  render() {
    const SearchFilters = this.props.Stores.SearchFilters
    return this.state.error ? null : (
      <CustomBox>
        <ValueList>
          <Value>
            {this.state.loaded ? (
              <div>
                <h1>
                  <FiltersLink
                    to={'/datasets'}
                    title={counterpart('home.tooltip.datasets', { locale: this.state.lang })}
                  >
                    {this.state.datasetsNum}
                  </FiltersLink>
                </h1>
                <Translate content="home.key.dataset" fallback="aineistoa" component="p" />
              </div>
            ) : (
              <div>
                <H1Skeleton />
                <PSkeleton />
              </div>
            )}
          </Value>
          <Value>
            {this.state.loaded ? (
              <div>
                <h1>
                  <FiltersLink
                    to={'/datasets'}
                    title={counterpart('home.tooltip.keywords', { locale: this.state.lang })}
                    onClick={() => SearchFilters.toggleKeyword()}
                  >
                    {this.state.keywordsNum}
                  </FiltersLink>
                </h1>
                <Translate content="home.key.keywords" fallback="asiasanaa" component="p" />
              </div>
            ) : (
              <div>
                <H1Skeleton />
                <PSkeleton />
              </div>
            )}
          </Value>
          <Value>
            {this.state.loaded ? (
              <div>
                <h1>
                  <FiltersLink
                    to={'/datasets'}
                    title={counterpart('home.tooltip.fos', { locale: this.state.lang })}
                    onClick={() => SearchFilters.toggleFieldOfScience()}
                  >
                    {this.state.fieldOfScienceNum}
                  </FiltersLink>
                </h1>
                <Translate content="home.key.fos" fallback="tieteenalaa" component="p" />
              </div>
            ) : (
              <div>
                <H1Skeleton />
                <PSkeleton />
              </div>
            )}
          </Value>
          <Value>
            {this.state.loaded ? (
              <div>
                <h1>
                  <FiltersLink
                    to={'/datasets'}
                    title={counterpart('home.tooltip.research', { locale: this.state.lang })}
                    onClick={() => SearchFilters.toggleProject()}
                  >
                    {this.state.researchNum}
                  </FiltersLink>
                </h1>
                <Translate content="home.key.research" fallback="tutkimusprojektia" component="p" />
              </div>
            ) : (
              <div>
                <H1Skeleton />
                <PSkeleton />
              </div>
            )}
          </Value>
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

const H1Skeleton = styled.div`
  display: block;
  width: 4.2em;
  height: 28px;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 7px;
  background-color: transparent; /* ${p => p.theme.color.superlightgray}; */
  border-radius: 3px;
`

const PSkeleton = styled.div`
  display: block;
  width: 4.8em;
  height: 15px;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 5px;
  background-color: transparent; /* ${p => p.theme.color.superlightgray}; */
  border-radius: 3px;
`

const ValueList = styled.ul`
  display: inline-flex;
  justify-content: space-around;
  width: 100%;
`

const Value = styled.li`
  text-align: center;
  h1 {
    margin-bottom: 0;
  }
  p {
    margin-bottom: 0;
    color: ${p => p.theme.color.primary};
  }
  &:nth-of-type(4) {
    display: none;
  }
  &:nth-of-type(3) {
    display: none;
  }
  @media (min-width: ${p => p.theme.breakpoints.sm}) {
    &:nth-of-type(4) {
      display: initial;
    }
  }
  @media (min-width: ${p => p.theme.breakpoints.xs}) {
    &:nth-of-type(3) {
      display: initial;
    }
  }
`

const FiltersLink = styled(Link)`
  font-size: 0.975em;
  &:active {
    transition: 0.1s ease;
    box-shadow: 0px 2px 5px -2px rgba(0, 0, 0, 0.7) inset;
  }
`
