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

import { observer } from 'mobx-react'

import QvainLogo from './qvainLogo'
import Settings from '../../../general/navigation/settings'
import Navi from '../../../general/navigation'
import MobileNavi from '../../../general/navigation/mobileNavi'
import LoginButton from '../../../general/navigation/loginButton'
import { FAIRDATA_WEBSITE_URL } from '../../../../utils/constants'
import Header, { NaviContainer, Right } from '../../../general/header'
import { MobileOnly, DesktopOnly } from '../../../general/header/mediaHelpers'
import { Qvain, QvainDatasetsV2 } from '../../../../routes'
import { useStores } from '../../utils/stores'

const QvainHeader = () => {
  const {
    Qvain: { original },
    Locale: { lang },
  } = useStores()

  const routes = [
    {
      loadableComponent: QvainDatasetsV2,
      label: 'qvain.nav.home',
      path: '/',
      exact: true,
    },
    {
      loadableComponent: Qvain,
      label: original ? 'qvain.nav.editDataset' : 'qvain.nav.createDataset',
      path: '/dataset',
      exact: false,
    },
  ]

  const helpUrl = lang === 'fi' ? FAIRDATA_WEBSITE_URL.QVAIN.FI : FAIRDATA_WEBSITE_URL.QVAIN.EN
  return (
    <Header>
      <QvainLogo />
      <NaviContainer aria-label="primary">
        <Navi routes={routes} />
      </NaviContainer>
      <Right>
        <Settings helpUrl={helpUrl} loginThroughService="qvain" />
        <DesktopOnly>
          <LoginButton loginThroughService="qvain" />
        </DesktopOnly>
      </Right>
      <MobileOnly>
        <MobileNavi helpUrl={helpUrl} naviRoutes={routes} loginThroughService="qvain" />
      </MobileOnly>
    </Header>
  )
}

export default observer(QvainHeader)
