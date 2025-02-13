import React, { useState } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import axios from 'axios'
import Translate from '@/utils/Translate'

import Modal from '@/components/general/modal'
import { DangerButton, TableButton } from '@/components/qvain/general/buttons'
import { useStores } from '@/stores/stores'

const ClearMetadataModal = () => {
  const {
    Qvain: {
      readonly,
      clearMetadataModalFile,
      setClearMetadataModalFile,
      Files: { applyClearPASMeta },
      original,
    },
    Env: { metaxV3Url },
  } = useStores()
  const [loading, setLoading] = useState(false)

  const clearFileCharacteristics = async () => {
    const { identifier } = clearMetadataModalFile
    const crId = original?.identifier

    setLoading(true)
    try {
      const url = metaxV3Url('fileCharacteristics', identifier)
      await axios.delete(url, { params: { dataset: crId } })
      applyClearPASMeta({})
      close()
    } finally {
      setLoading(false)
    }
  }

  const close = () => {
    if (loading) {
      return
    }
    setClearMetadataModalFile(undefined)
  }

  if (!clearMetadataModalFile) {
    return null
  }

  return (
    <Modal
      contentLabel="clearMetadataModal"
      isOpen
      onRequestClose={close}
      customStyles={modalStyles}
    >
      <Translate
        content="qvain.files.metadataModal.clear.header"
        component="h3"
        style={{ marginBottom: 0 }}
      />
      <Translate
        content="qvain.files.metadataModal.clear.help"
        component="p"
        with={{ file: clearMetadataModalFile.name }}
      />
      <Buttons>
        <TableButton disabled={loading} onClick={close}>
          <Translate content={'qvain.files.metadataModal.clear.cancel'} />
        </TableButton>
        <DangerButton disabled={loading || readonly} onClick={clearFileCharacteristics}>
          <Translate content={'qvain.files.metadataModal.clear.confirm'} />
        </DangerButton>
      </Buttons>
    </Modal>
  )
}

const Buttons = styled.div`
  margin-top: 1rem;
`

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

export default observer(ClearMetadataModal)
