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
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import { Link } from '../general/button'
import DropdownMenu from '../general/navigation/dropdownMenu'
import { LEGACY_QVAIN_URL, FAIRDATA_WEBSITE_URL } from '../../utils/constants'
import MaybeNavLink from '../general/navigation/maybeNavLink'

import EtsinLogo from './etsinLogo'
import Settings from '../general/navigation/settings'
import Navi from '../general/navigation/index'
import MobileNavi from '../general/navigation/mobileNavi'
import Header, { NaviContainer, Right } from '../general/header'
import { Home, Search } from '../../routes'
import { withStores } from '../../stores/stores'

const routes = [
  {
    loadableComponent: Home,
    label: 'nav.home',
    path: '/',
    exact: true,
  },
  {
    loadableComponent: Search,
    label: 'nav.datasets',
    path: '/datasets',
    exact: false,
  },
]

const EtsinHeader = props => {
  const { lang } = props.Stores.Locale
  const { Env } = props.Stores
  const helpUrl = lang === 'fi' ? FAIRDATA_WEBSITE_URL.ETSIN.FI : FAIRDATA_WEBSITE_URL.ETSIN.EN

  const dropDownMenu = () => (
    <DropdownMenu transparent={false} buttonContent={<Translate content="nav.addDataset" />}>
      <CustomContainer>
        <Row>
          <Link
            width="100%"
            margin="0.4em 0em 0.4em 0.4em"
            href={LEGACY_QVAIN_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            Qvain
          </Link>
        </Row>
        <Row>
          <MaybeNavLink width="100%" margin="0.4em 0em 0.4em 0.4em" to={Env.getQvainUrl('')}>
            Qvain Light
          </MaybeNavLink>
        </Row>
      </CustomContainer>
    </DropdownMenu>
  )

  const mobileSettingsExtra = (
    <QvainLinkContainer>
      <TextContainer>
        <Translate content="nav.addDataset" />
      </TextContainer>
      <Row>
        <Link width="100%" href={LEGACY_QVAIN_URL} rel="noopener noreferrer" target="_blank">
          Qvain
        </Link>
        <MaybeNavLink width="50%" to={Env.getQvainUrl('')}>
          Qvain Light
        </MaybeNavLink>
      </Row>
    </QvainLinkContainer>
  )

  return (
    <Header>
      <EtsinLogo />
      <NaviContainer aria-label="primary">
        <Navi routes={routes} />
      </NaviContainer>
      <Right>
        <Settings helpUrl={helpUrl} loginThroughService="etsin">
          {dropDownMenu()}
        </Settings>
      </Right>
      <MobileNavi helpUrl={helpUrl} naviRoutes={routes} loginThroughService="etsin">
        {mobileSettingsExtra}
      </MobileNavi>
    </Header>
  )
}

EtsinHeader.propTypes = {
  Stores: PropTypes.object.isRequired,
}

const CustomContainer = styled.div`
  margin: 0 auto;
  padding: 1em 1.3em;
  max-width: 400px;
  width: 100%;
`

const Row = styled.div`
  display: inline-flex;
  width: 100%;
`

const QvainLinkContainer = styled.div`
  border-bottom: 1px solid ${p => p.theme.color.medgray};
`

const TextContainer = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
`

export default withStores(observer(EtsinHeader))
