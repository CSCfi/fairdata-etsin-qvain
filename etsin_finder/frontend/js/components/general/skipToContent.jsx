import React, { Component } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'

const STC = styled.button`
  background: rgb(77, 179, 231);
  color: white;
  max-height: 0;
  margin: 0;
  padding: 0;
  border: none;
  letter-spacing: 2px;
  transition: 0.2s ease;
  &:focus {
    text-decoration: underline;
    padding: 0.5em;
    max-height: 3em;
  }
`

export default class SkipToContent extends Component {
  render() {
    return (
      <STC onClick={this.props.callback}>
        <Translate content="stc" />
      </STC>
    )
  }
}
