import React, { Component } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

export default class SkipToContent extends Component {
  render() {
    return (
      <STC onClick={this.props.callback}>
        <Translate content="stc" />
      </STC>
    )
  }
}

const STC = styled.button`
  background: ${p => p.theme.color.primary};
  color: white;
  max-height: 0;
  width: 100%;
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

SkipToContent.propTypes = {
  callback: PropTypes.func.isRequired,
}
