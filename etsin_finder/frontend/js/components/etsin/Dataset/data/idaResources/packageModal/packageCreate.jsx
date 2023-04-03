import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import NotificationEmail from './notificationEmail'
import { Header, Buttons, CancelButton, CreatePackageButton } from './common'

const PackageCreate = ({ Packages }) => (
  <>
    <Translate component={Header} content="dataset.dl.packages.modal.generate.header" />
    <Translate component="p" content="dataset.dl.packages.modal.generate.main" />
    <Translate component="p" content="dataset.dl.packages.modal.generate.additional" />
    <NotificationEmail Packages={Packages} />
    <Buttons>
      <CancelButton Packages={Packages} />
      <CreatePackageButton Packages={Packages} />
    </Buttons>
  </>
)

PackageCreate.propTypes = {
  Packages: PropTypes.object.isRequired,
}

export default observer(PackageCreate)
