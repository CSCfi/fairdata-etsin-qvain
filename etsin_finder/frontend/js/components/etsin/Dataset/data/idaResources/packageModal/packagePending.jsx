import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import NotificationEmail from './notificationEmail'
import { Header, Buttons, CloseButton, SubmitEmailButton } from './common'
import FlaggedComponent from '../../../../../general/flaggedComponent'

const PackageCreate = ({ Packages }) => (
  <>
    <Translate component={Header} content="dataset.dl.packages.modal.pending.header" />
    <Translate component="p" content="dataset.dl.packages.modal.pending.main" />
    <NotificationEmail Packages={Packages} />
    <Buttons>
      <CloseButton Packages={Packages} />
      <FlaggedComponent flag="DOWNLOAD_API_V2.EMAIL.FRONTEND">
        <SubmitEmailButton Packages={Packages} />
      </FlaggedComponent>
    </Buttons>
  </>
)

PackageCreate.propTypes = {
  Packages: PropTypes.object.isRequired,
}

export default observer(PackageCreate)
