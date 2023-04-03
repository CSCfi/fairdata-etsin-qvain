import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { DOWNLOAD_API_REQUEST_STATUS } from '@/utils/constants'

import Modal from '../../../../../general/modal'
import PackageCreate from './packageCreate'
import PackagePending from './packagePending'
import PackageSuccess from './packageSuccess'

const modalContent = Packages => {
  const status = Packages.get(Packages.packageModalPath)?.status
  if (status === DOWNLOAD_API_REQUEST_STATUS.SUCCESS) {
    return <PackageSuccess Packages={Packages} />
  }

  if (
    status === DOWNLOAD_API_REQUEST_STATUS.PENDING ||
    status === DOWNLOAD_API_REQUEST_STATUS.STARTED
  ) {
    return <PackagePending Packages={Packages} />
  }

  return <PackageCreate Packages={Packages} />
}

const PackageModal = ({ Packages }) => (
  <Modal
    isOpen={!!Packages.packageModalPath}
    contentLabel="confirm-package-creation"
    customStyles={modalStyle}
    onRequestClose={Packages.closePackageModal}
  >
    {modalContent(Packages)}
  </Modal>
)

PackageModal.propTypes = {
  Packages: PropTypes.object.isRequired,
}

const modalStyle = {
  content: {
    minWidth: '300px',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
  },
}

export default observer(PackageModal)
