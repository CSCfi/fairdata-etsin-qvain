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
import withCustomProps from '@/utils/withCustomProps'

const SplashBg = withCustomProps(styled.div)`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
  transition: ${props => (props.visible ? '0s ease' : '0.8s ease-in')};
  color: white;
  background-color: ${props => props.theme.color.primary};
  opacity: ${props => (props.visible ? 0.97 : 0)};
  pointer-events: none;
  z-index: 20;
`

const Splash = props => <SplashBg {...props}>{props.children}</SplashBg>

Splash.defaultProps = {
  children: <span />,
}

Splash.propTypes = {
  children: PropTypes.element,
  visible: PropTypes.bool.isRequired,
}

export default Splash
