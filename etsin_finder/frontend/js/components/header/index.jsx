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
import translate from 'counterpart'

import { FAIRDATA_WEBSITE_URL } from '../../utils/constants'
import MaybeExternalLink from '../general/navigation/maybeExternalLink'

import LoginButton from '../general/navigation/loginButton'
import EtsinLogo from './etsinLogo'
import Settings from '../general/navigation/settings'
import Navi from '../general/navigation/index'
import MobileNavi from '../general/navigation/mobileNavi'
import Header, { NaviContainer, Right } from '../general/header'
import { MobileOnly, DesktopOnly } from '../general/header/mediaHelpers'
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

const QvainLink = styled(MaybeExternalLink)`
  white-space: nowrap;
`

const EtsinHeader = props => {
  const { lang, currentLang } = props.Stores.Locale
  const { Env, Matomo } = props.Stores
  const helpUrl = lang === 'fi' ? FAIRDATA_WEBSITE_URL.ETSIN.FI : FAIRDATA_WEBSITE_URL.ETSIN.EN

  const mobileSettingsExtra = (
    <QvainLink to={Env.getQvainUrl('')}>
      <Translate content="nav.addDataset" />
    </QvainLink>
  )

  const registerMatomo = () => {
    Matomo.recordEvent('CREATE_EDIT')
  }

  return (
    <Header>
      <EtsinLogo />
      <NaviContainer aria-label="primary">
        <Navi routes={routes} />
      </NaviContainer>
      <Right>
        <Settings helpUrl={helpUrl} loginThroughService="etsin">
          <MaybeExternalLink to={Env.getQvainUrl('')} onClick={registerMatomo}>
            <Translate content="nav.addDataset" />
          </MaybeExternalLink>
        </Settings>
        <DesktopOnly>
          <LoginButton loginThroughService="etsin" />
        </DesktopOnly>
      </Right>
      <MobileOnly>
        <MobileNavi helpUrl={helpUrl} naviRoutes={routes} loginThroughService="etsin">
          {mobileSettingsExtra}
        </MobileNavi>
      </MobileOnly>
      <span className="sr-only" aria-live="assertive">
        {/* For screen readers only. If the language is changed in the Store, Announce the new language. */}
        {translate('general.state.changedLang', {
          lang:
            currentLang === 'fi'
              ? translate('qvain.general.lang.fi')
              : translate('qvain.general.lang.en'),
        })}
      </span>
    </Header>
  )
}

EtsinHeader.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default withStores(observer(EtsinHeader))
