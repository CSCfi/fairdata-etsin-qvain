import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Image = ({ alt, file }) => <StyledImg alt={alt} src={file} />

const StyledImg = styled.img`
  max-width: 100%;
  max-height: 7em;
`

Image.propTypes = {
  file: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
}

export default Image
