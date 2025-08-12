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

import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from '@/utils/Translate'
import { useStores } from '../../../utils/stores'

const Navi = ({ routes }) => {
  const {
    Accessibility: { announce },
    Locale: { translate },
  } = useStores()

  return routes.map(route => (
    <NavItem
      key={route.path}
      end={route.end}
      to={route.path}
      onPointerOver={() => {
        if (route.loadableComponent) {
          route.loadableComponent.preload()
        }
      }}
      onClick={() => {
        announce(translate('changepage', { page: translate(route.label) }))
      }}
    >
      <Translate content={route.label} />
    </NavItem>
  ))
}

Navi.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      loadableComponent: PropTypes.elementType,
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      end: PropTypes.bool,
    })
  ).isRequired,
}

export default observer(Navi)

const NavItem = styled(NavLink)`
  margin: 0 1.5em;
  color: ${p => p.theme.color.dark};
  text-transform: uppercase;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
  text-decoration: none;
  &.active {
    color: ${p => p.theme.color.primary};
    &::after {
      content: '';
      position: absolute;
      display: block;
      border: 8px solid transparent;
      border-bottom: 8px solid ${p => p.theme.color.primary};
      bottom: 0;
      right: 0;
      left: 0;
      margin-left: auto;
      margin-right: auto;
      width: 16px;
    }
  }
  &:hover {
    color: ${p => p.theme.color.primary};
  }
`
