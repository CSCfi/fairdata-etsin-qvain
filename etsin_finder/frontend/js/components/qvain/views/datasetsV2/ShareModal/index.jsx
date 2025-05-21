import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import Modal from '../../../../general/modal'
import { ConfirmClose } from '../../../general/modal/confirmClose'
import { useStores } from '../../../utils/stores'
import Tabs from './Tabs'
import Invite from './Invite'
import Members from './Members'
import Loader from '../../../../general/loader'
import InviteResults from './InviteResults'
import ConfirmRemove from './ConfirmRemove'

const modalDataTypes = {
  dataset: PropTypes.object.isRequired,
}

const getSelectedTab = ({ share }) => {
  const { tabs, isLoadingPermissions, permissionLoadError } = share

  if (permissionLoadError) {
    return <Translate component={Error} content="qvain.datasets.share.errors.loadingPermissions" />
  }
  if (isLoadingPermissions) {
    return <Loader active size="6rem " />
  }
  if (tabs.active === 'invite') {
    return <Invite />
  }
  return <Members />
}

const getModalContent = ({ share }) => {
  const { confirmClose, setConfirmClose, inviteResults, modal } = share

  if (inviteResults) {
    return (
      <TabContent>
        <InviteResults />
      </TabContent>
    )
  }

  const selectedTab = getSelectedTab({ share })
  return (
    <>
      <Tabs />
      {selectedTab && <TabContent>{selectedTab}</TabContent>}
      <ConfirmClose
        show={confirmClose}
        onCancel={() => setConfirmClose(false)}
        onConfirm={modal.close}
        warning="qvain.datasets.share.invite.confirm.warning"
        confirm="qvain.datasets.share.invite.confirm.confirm"
        cancel="qvain.datasets.share.invite.confirm.cancel"
      />
    </>
  )
}

export const ShareModal = () => {
  const {
    QvainDatasets: { share },
  } = useStores()

  const { modal, requestCloseModal } = share

  if (!modal.data) {
    return null
  }

  PropTypes.checkPropTypes(modalDataTypes, modal.data, 'data', 'ShareModal')

  return (
    <Modal
      isOpen
      onRequestClose={requestCloseModal}
      contentLabel="shareDatasetModal"
      customStyles={modalStyles}
    >
      <Translate component={Title} content="qvain.datasets.share.title" />
      {getModalContent({ share })}
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
  border-bottom: 1px solid ${p => p.theme.color.medgray};
  padding-bottom: 0.5rem;
  margin-bottom: 0;
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
