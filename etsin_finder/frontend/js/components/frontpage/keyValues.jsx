import React, { Component } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import axios from 'axios'

import ContentBox from '../general/contentBox'

export default class KeyValues extends Component {
  constructor(props) {
    super(props)

    this.state = {
      datasetsNum: 0,
      keywordsNum: 0,
      fieldOfScienceNum: 0,
      researchNum: 0,
      loaded: false,
      error: true,
    }
  }

  componentDidMount() {
    this.getValues()
  }

  getValues() {
    const datasets = axios.get('/es/metax/dataset/_count', {
      query: {
        match_all: {},
      },
    })

    const es = axios.post('/es/metax/dataset/_search', {
      aggs: {
        distinct_keywords: { cardinality: { field: 'theme.identifier.keyword' } },
        distinct_fieldsofscience: {
          cardinality: { field: 'field_of_science.identifier.keyword' },
        },
        distinct_projects: { cardinality: { field: 'is_output_of.name.keyword' } },
      },
    })

    Promise.all([datasets, es])
      .then(res => {
        console.log('keyvalues', res)
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

  render() {
    return this.state.error ? null : (
      <div>
        <CustomBox>
          <Value>
            {this.state.loaded ? (
              <div>
                <h1>{this.state.datasetsNum}</h1>
                <Translate content="home.key.dataset" fallback="Aineistoa" component="p" />
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
                <h1>{this.state.keywordsNum}</h1>
                <Translate content="home.key.keywords" fallback="Asiasanaa" component="p" />
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
                <h1>{this.state.fieldOfScienceNum}</h1>
                <Translate content="home.key.fos" fallback="Tieteenalaa" component="p" />
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
                <h1>{this.state.researchNum}</h1>
                <Translate content="home.key.research" fallback="Tutkimusprojektia" component="p" />
              </div>
            ) : (
              <div>
                <H1Skeleton />
                <PSkeleton />
              </div>
            )}
          </Value>
        </CustomBox>
      </div>
    )
  }
}

const CustomBox = styled(ContentBox)`
  margin-bottom: 2em;
  display: inline-flex;
  justify-content: space-around;
  width: 100%;
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

const Value = styled.div`
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
