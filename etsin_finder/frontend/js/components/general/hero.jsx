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
    background-color: ${({ theme }) => theme.ui.hero.primaryBackgroundColor};
    background-image: ${({ theme }) => theme.ui.hero.primaryBackgroundImage};
    background-size: ${({ theme }) => theme.ui.hero.primaryBackgroundSize};
    background-position: ${({ theme }) => theme.ui.hero.primaryBackgroundPosition};
    background-repeat: no-repeat;
    overflow: hidden;
    color: white;
  }
  &.hero-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.ui.hero.gradientBlend} 0%,
      ${({ theme }) => theme.ui.hero.gradientBlend} 44%,
      rgba(6, 20, 75, 0.82) 58%,
      rgba(6, 20, 75, 0.36) 68%,
      rgba(6, 20, 75, 0) 76%
    );
    opacity: ${({ theme }) => theme.ui.hero.gradientOverlayOpacity};
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
  z-index: 1;
`

HeroBanner.defaultProps = {
  className: '',
}

HeroBanner.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default HeroBanner
