import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import Modal from '../../../../general/modal'
import { useStores } from '../../../utils/stores'
import {
  DangerButton as BaseDangerButton,
  DangerCancelButton as BaseCancelButton,
} from '../../../general/buttons'
import Loader from '../../../../general/loader'
import { Checkbox } from '../../../general/modal/form'

export const ShareModal = () => {
  const {
    QvainDatasets: {
      share: {
        userPermissionToRemove,
        cancelRemoveUserPermission,
        confirmRemoveUserPermission,
        isRemovingUserPermission,
        permissionChangeError,
        loseAccessIfRemoved,
      },
    },
  } = useStores()

  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setChecked(false) // reset when user changes
  }, [userPermissionToRemove])

  const confirmIsDisabled = loseAccessIfRemoved && !checked

  if (!userPermissionToRemove) {
    return null
  }

  const loading = isRemovingUserPermission(userPermissionToRemove)
  const requestClose = () => {
    if (!loading) {
      cancelRemoveUserPermission()
    }
  }

  return (
    <Modal
      isOpen
      contentLabel="remove-user-editor-permission"
      onRequestClose={requestClose}
      customStyles={confirmModalStyles}
    >
      <Translate
        component={Text}
        content="qvain.datasets.share.remove.warning"
        with={{ user: userPermissionToRemove.uid }}
      />
      {permissionChangeError && (
        <Translate component={Error} content="qvain.datasets.share.members.updateError" />
      )}
      {loseAccessIfRemoved && (
        <SelfRemoveWarning>
          <Translate
            component="label"
            content="qvain.datasets.share.remove.loseAccessWarning"
            htmlFor="remove-self-check"
          />
          <Checkbox
            id="remove-self-check"
            checked={checked}
            disabled={loading}
            onChange={e => setChecked(e.target.checked)}
          />
        </SelfRemoveWarning>
      )}
      <ConfirmButtonContainer>
        <Translate
          component={CancelButton}
          content="qvain.datasets.share.remove.cancel"
          disabled={loading}
          onClick={requestClose}
        />
        <DangerButton disabled={loading || confirmIsDisabled} onClick={confirmRemoveUserPermission}>
          <Translate content="qvain.datasets.share.remove.confirm" />
          {loading && (
            <LoaderWrapper>
              <Loader active size="12pt" spinnerSize="0.15em" />
            </LoaderWrapper>
          )}
        </DangerButton>
      </ConfirmButtonContainer>
    </Modal>
  )
}

const Error = styled.div`
  color: ${p => p.theme.color.error};
  margin: 0.5rem 0;
  text-align: center;
`

const LoaderWrapper = styled.div`
  margin: 0 0 0 0.5rem;
`

const confirmModalStyles = {
  content: {
    position: 'relative',
    width: '30em',
    padding: '1.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
  },
}

const SelfRemoveWarning = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
  margin: 0.5rem;
  margin-right: 1.5rem;
  text-align: center;

  & > * {
    min-width: 1.2rem;
  }
`

const ConfirmButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, max(8em, 10em));
  gap: 1rem 0.5rem;
  justify-content: center;
`

const Text = styled.p`
  margin-right: 1.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
`

const DangerButton = styled(BaseDangerButton)`
  margin: 0;
  line-height: 1;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CancelButton = styled(BaseCancelButton)`
  margin: 0;
  line-height: 1;
  padding: 0.75rem 1rem;
`

export default observer(ShareModal)
