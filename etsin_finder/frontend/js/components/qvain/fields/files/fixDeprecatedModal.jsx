import React, { useState } from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import axios from 'axios'

import Modal from '../../../general/modal'
import Response from './response'
import { DangerButton, TableButton } from '../../general/buttons'
import { getResponseError } from '../../utils/responseError'
import { useStores } from '../../utils/stores'

const FixDeprecatedModal = () => {
  const {
    Qvain: { original, deprecated, closeFixDeprecatedModal, fixDeprecatedModalOpen, changed },
  } = useStores()
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)

  const fixDeprecated = () => {
    if (!original || !deprecated) {
      return
    }
    setLoading(true)
    setResponse(null)

    const obj = {
      identifier: original.identifier,
    }

    axios
      .post('/api/rpc/datasets/fix_deprecated', obj)
      .then(res => {
        const data = res.data || {}
        setResponse({
          new_version_created: data.new_version_created,
        })
      })
      .catch(err => {
        setResponse({
          error: getResponseError(err),
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleRequestClose = () => {
    if (!loading) {
      closeFixDeprecatedModal()
      setResponse(null)
    }
  }

  return (
    <Modal
      isOpen={fixDeprecatedModalOpen}
      onRequestClose={handleRequestClose}
      contentLabel="fixDeprecatedModal"
    >
      <Translate component="h3" content="qvain.files.fixDeprecatedModal.header" />
      {loading || response ? (
        <Response response={response} requestClose={handleRequestClose} />
      ) : (
        <>
          <Translate component="p" content={'qvain.files.fixDeprecatedModal.help'} />
          {changed && (
            <Translate component="p" content={'qvain.files.fixDeprecatedModal.changes'} />
          )}
        </>
      )}
      {response ? (
        <TableButton onClick={handleRequestClose}>
          <Translate content={'qvain.files.fixDeprecatedModal.buttons.close'} />
        </TableButton>
      ) : (
        <>
          <TableButton disabled={loading} onClick={handleRequestClose}>
            <Translate content={'qvain.files.fixDeprecatedModal.buttons.cancel'} />
          </TableButton>
          <DangerButton disabled={changed || loading} onClick={fixDeprecated}>
            <Translate content={'qvain.files.fixDeprecatedModal.buttons.ok'} />
          </DangerButton>
        </>
      )}
    </Modal>
  )
}

export default observer(FixDeprecatedModal)
