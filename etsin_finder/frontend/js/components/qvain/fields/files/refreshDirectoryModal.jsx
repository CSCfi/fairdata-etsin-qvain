import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import axios from 'axios'

import Modal from '../../../general/modal'
import Response from './response'
import { getResponseError } from '../../utils/responseError'
import { DangerButton, TableButton } from '../../general/buttons'
import { useStores } from '../../utils/stores'

const RefreshDirectoryModal = ({ onClose, directory }) => {
  const {
    Qvain: { original, changed, isCumulative },
  } = useStores()

  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)

  const refreshDirectoryContent = () => {
    const identifier = directory
    if (!original) {
      // only published datasets can be refreshed with the RPC
      return
    }
    setResponse(null)
    setLoading(true)

    const obj = {
      cr_identifier: original.identifier,
      dir_identifier: identifier,
    }
    axios
      .post('/api/rpc/datasets/refresh_directory_content', obj)
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
      onClose()
      setResponse(null)
    }
  }

  const cumulativeKey = isCumulative ? 'cumulative' : 'noncumulative'
  return (
    <Modal
      isOpen={!!directory}
      onRequestClose={handleRequestClose}
      contentLabel="refreshDirectoryModal"
    >
      <Translate component="h3" content="qvain.files.refreshModal.header" />
      {loading || response ? (
        <Response response={response} requestClose={handleRequestClose} />
      ) : (
        <>
          <Translate component="p" content={`qvain.files.refreshModal.${cumulativeKey}`} />
          {changed && <Translate component="p" content={'qvain.files.refreshModal.changes'} />}
        </>
      )}
      {response ? (
        <TableButton onClick={handleRequestClose}>
          <Translate content={'qvain.files.refreshModal.buttons.close'} />
        </TableButton>
      ) : (
        <>
          <TableButton disabled={loading} onClick={handleRequestClose}>
            <Translate content={'qvain.files.refreshModal.buttons.cancel'} />
          </TableButton>
          <DangerButton disabled={changed || loading} onClick={() => refreshDirectoryContent()}>
            <Translate content={'qvain.files.refreshModal.buttons.ok'} />
          </DangerButton>
        </>
      )}
    </Modal>
  )
}

RefreshDirectoryModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  directory: PropTypes.string,
}

RefreshDirectoryModal.defaultProps = {
  directory: null,
}

export default observer(RefreshDirectoryModal)
