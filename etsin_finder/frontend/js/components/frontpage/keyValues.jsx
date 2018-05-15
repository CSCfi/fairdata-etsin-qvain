import React, { Component } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import ContentBox from '../general/contentBox'

export default class KeyValues extends Component {
  state = {
    datasetsNum: 9504,
    keywordsNum: 2989,
    fieldOfScienceNum: 117,
    researchNum: 590,
  }

  render() {
    return (
      <CustomBox>
        <Value>
          <h1>{this.state.datasetsNum}</h1>
          <Translate content="home.key.dataset" fallback="Aineistoa" component="p" />
        </Value>
        <Value>
          <h1>{this.state.keywordsNum}</h1>
          <Translate content="home.key.keywords" fallback="Asiasanaa" component="p" />
        </Value>
        <Value>
          <h1>{this.state.fieldOfScienceNum}</h1>
          <Translate content="home.key.fos" fallback="Tieteenalaa" component="p" />
        </Value>
        <Value>
          <h1>{this.state.researchNum}</h1>
          <Translate content="home.key.research" fallback="Tutkimusprojektia" component="p" />
        </Value>
      </CustomBox>
    )
  }
}

const CustomBox = styled(ContentBox)`
  margin-bottom: 2em;
  display: inline-flex;
  justify-content: space-around;
  width: 100%;
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
