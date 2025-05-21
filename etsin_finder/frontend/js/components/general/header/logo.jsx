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

import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

const Logo = ({ image, alt }) => (
  <LogoCont to="/">
    <Img alt={alt} src={image} />
  </LogoCont>
)

Logo.propTypes = {
  image: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
}

export default Logo

const LogoCont = styled(NavLink)`
  width: 12em;
`

const Img = styled.img`
  width: 100%;
`
