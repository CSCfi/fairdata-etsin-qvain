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
import Translate from '@/utils/Translate'

import { Link } from '../button'
import LangToggle from './langToggle'

const Settings = props => (
  <Positioner>
    <Link width="max-content" href={props.helpUrl} rel="noopener noreferrer" target="_blank">
      <Translate content="nav.help" />
    </Link>
    {props.children}
    <LangToggle />
  </Positioner>
)

export default Settings

Settings.defaultProps = {
  helpUrl: undefined,
  children: null,
}

Settings.propTypes = {
  helpUrl: PropTypes.string,
  children: PropTypes.node,
}

const Positioner = styled.div`
  display: none;
  align-items: center;
  @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
    display: flex;
  }
`
