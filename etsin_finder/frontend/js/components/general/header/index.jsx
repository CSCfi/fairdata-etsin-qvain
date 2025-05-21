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

const Header = ({ children }) => (
  <HeaderBar>
    <Positioner>{children}</Positioner>
  </HeaderBar>
)

Header.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Header

const HeaderBar = styled.div`
  width: 100%;
  height: 4em;
  background-color: white;
  color: ${p => p.theme.color.dark};
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
`

const Positioner = styled.div.attrs({
  className: 'container',
})`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const NaviContainer = styled.nav`
  margin-left: auto;
  display: none;
  justify-content: center;
  align-items: center;
  height: 100%;
  @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
    display: flex;
    margin: 0 auto;
  }
`

export const Right = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
`
