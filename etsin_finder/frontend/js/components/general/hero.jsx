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

import PropTypes from 'prop-types'
import styled from 'styled-components'

const HeroBanner = ({ className, children }) => (
  <Hero className={className}>
    <Center>{children}</Center>
  </Hero>
)

const Hero = styled.div`
  width: 100%;
  min-height: 200px;
  /* display: flex;
  align-items: center;
  justify-content: center; */
  position: relative;
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    min-height: 300px;
  }
  &.hero-primary {
    background-color: ${props => props.theme.color.primary};
    color: white;
  }
  &.hero-full {
    width: 100%;
  }
`

const Center = styled.div`
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
`

HeroBanner.defaultProps = {
  className: '',
}

HeroBanner.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default HeroBanner
