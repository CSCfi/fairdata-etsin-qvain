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
import queryParam from '@/utils/queryParam'

const QvainHeader = () => {
  const {
    Qvain: { original, isNewVersion },
    Locale: { lang },
    Env: {
      history: {
        location
      }
    }
  } = useStores()

  const getLabel = () => {
    const templateIdentifier = queryParam(location, 'template')

    /*If a dataset has a template identifier, it uses an existing dataset 
    as a model: */
    if (templateIdentifier) {
      return 'qvain.titleModelBasedDataset'
    }
    /*If a new version of an existing dataset is created, the condition 
    below is implemented. The condition must come before the condition that 
    is reflected to the value of original, since the new version also has 
    original: */
    if (isNewVersion) {
      return 'qvain.titleNewVersion'
    }
    if (original) {
      return 'qvain.nav.editDataset'
    }
    return 'qvain.nav.createDataset'
  }

  const routes = [
    {
      loadableComponent: QvainDatasetsV2,
      label: 'qvain.nav.home',
      path: '/',
      exact: true,
    },
    {
      loadableComponent: Qvain,
      label: getLabel(),
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
