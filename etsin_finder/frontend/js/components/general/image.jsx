import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

export default class Image extends Component {
  constructor(props) {
    super(props)

    this.state = {
      file: props.file,
      alt: props.alt,
    }
  }
  render() {
    return <StyledImg alt={this.state.alt} src={this.state.file} />
  }
}

const StyledImg = styled.img`
  max-width: 100%;
  max-height: 7em;
`

Image.propTypes = {
  file: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
}
