import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { Header, Buttons, CloseButton } from './common'

const PackageCreate = ({ Packages }) => (
  <>
    <Translate component={Header} content="dataset.dl.packages.modal.success.header" />
    <Translate component="p" content="dataset.dl.packages.modal.success.main" />
    <Buttons>
      <CloseButton Packages={Packages} />
    </Buttons>
  </>
)

PackageCreate.propTypes = {
  Packages: PropTypes.object.isRequired,
}

export default observer(PackageCreate)
