import PropTypes from 'prop-types'
import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import Modal from '../../../../general/modal'
import { ConfirmClose } from '../../../general/modal/confirmClose'
import { useStores } from '../../../utils/stores'
import Tabs from './Tabs'
import Invite from './Invite'
import Members from './Members'
import Loader from '../../../../general/loader'
import ConfirmRemove from './ConfirmRemove'

const modalDataTypes = {
  dataset: PropTypes.object.isRequired,
}

export const ShareModal = () => {
  const {
    QvainDatasetsV2: {
      share: {
        modal,
        tabs,
        confirmClose,
        setConfirmClose,
        isInviting,
        hasUnsentInvite,
        isLoadingPermissions,
        permissionLoadError,
      },
    },
  } = useStores()

  if (!modal.data) {
    return null
  }

  PropTypes.checkPropTypes(modalDataTypes, modal.data, 'data', 'ShareModal')

  const { close } = modal

  const requestClose = () => {
    if (isInviting) {
      return
    }
    if (hasUnsentInvite) {
      setConfirmClose(true)
    } else {
      close()
    }
  }

  let selectedTab = null

  if (permissionLoadError) {
    selectedTab = (
      <Translate component={Error} content="qvain.datasets.share.errors.loadingPermissions" />
    )
  } else if (isLoadingPermissions) {
    selectedTab = <Loader active size="6rem " />
  } else if (tabs.active === 'invite') {
    selectedTab = <Invite />
  } else {
    selectedTab = <Members />
  }

  return (
    <Modal
      isOpen
      onRequestClose={requestClose}
      contentLabel="shareDatasetModal"
      customStyles={modalStyles}
    >
      <Translate component={Title} content="qvain.datasets.share.title" />
      <Tabs />
      {selectedTab && <TabContent>{selectedTab}</TabContent>}
      <ConfirmClose
        show={confirmClose}
        onCancel={() => setConfirmClose(false)}
        onConfirm={close}
        warning="qvain.datasets.share.invite.confirm.warning"
        confirm="qvain.datasets.share.invite.confirm.confirm"
        cancel="qvain.datasets.share.invite.confirm.cancel"
      />
      <ConfirmRemove />
    </Modal>
  )
}

export const modalStyles = {
  content: {
    position: 'relative',
    minWidth: '32vw',
    width: '40em',
    maxWidth: '40em',
    minHeight: '30em',
    padding: '1.5rem 0',
    display: 'flex',
    flexDirection: 'column',
  },
}

const TabContent = styled.div`
  padding: 0 3rem 0 3rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

const Title = styled.h3`
  text-align: center;
`

const Error = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${p => p.theme.color.error};
`

export const ErrorMessage = styled.p`
  background-color: #ffebe8;
  color: red;
  border: 1px solid rgba(64, 0, 0, 0.3);
  padding: 0.5em;
`

export default observer(ShareModal)
