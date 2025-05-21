import { useState } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'

import Modal from '../../../../../../general/modal'
import { ConfirmClose } from '../../../../../general/modal/confirmClose'
import { TableButton } from '../../../../../general/buttons'
import FileForm from './fileForm'
import DirectoryForm from './directoryForm'
import { useStores } from '../../../../../utils/stores'

const FormModal = () => {
  const {
    Qvain: {
      Files: { inEdit, setInEdit },
    },
  } = useStores()
  const [changed, setChanged] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)

  const requestClose = () => {
    if (!changed) {
      close()
    } else {
      showConfirmClose()
    }
  }

  const showConfirmClose = () => {
    setConfirmClose(true)
  }

  const hideConfirmClose = () => {
    setConfirmClose(false)
  }

  const close = () => {
    setInEdit(null)
    setChanged(false)
    hideConfirmClose()
  }

  if (!inEdit) {
    return null
  }

  return (
    <Modal contentLabel="formModal" isOpen onRequestClose={requestClose} customStyles={modalStyles}>
      <h3>
        <FontAwesomeIcon icon={faFile} style={{ marginRight: '1rem' }} />
        <ItemPath item={inEdit} />
        {changed && '*'}
      </h3>

      {inEdit.type === 'directory' && (
        <DirectoryForm setChanged={setChanged} requestClose={requestClose} />
      )}
      {inEdit.type === 'file' && <FileForm setChanged={setChanged} requestClose={requestClose} />}
      <ConfirmClose show={confirmClose} onCancel={hideConfirmClose} onConfirm={close} />
    </Modal>
  )
}

const ItemPath = ({ item }) => item.path.substring(1).split('/').join(' / ')

export const modalStyles = {
  content: {
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    position: 'relative',
    minWidth: '32vw',
    width: '30em',
    maxWidth: '30em',
    margin: '0.5em',
    border: 'none',
    padding: '2em',
    boxShadow: '0px 6px 12px -3px rgba(0, 0, 0, 0.15)',
    overflow: 'auto',
  },
  overlay: {
    zIndex: '100',
  },
}

export const AutoWidthTableButton = styled(TableButton)`
  width: auto;
`

export default observer(FormModal)
