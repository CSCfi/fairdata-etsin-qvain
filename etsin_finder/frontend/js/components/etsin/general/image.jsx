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
