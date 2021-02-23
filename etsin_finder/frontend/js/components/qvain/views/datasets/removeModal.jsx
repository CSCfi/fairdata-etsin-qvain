import React, { useState } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import urls from '../../utils/urls'
import Modal from '../../../general/modal'
import { TableButton, DangerButton } from '../../general/buttons'
import { getResponseError } from '../../utils/responseError'
import { useStores } from '../../../../utils/stores'

export const RemoveModal = ({ dataset, onlyChanges, postRemoveUpdate, onClose }) => {
  const {
    Env: { metaxApiV2 },
  } = useStores()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const clearAndClose = () => {
    setError(null)
    setLoading(null)
    onClose()
  }

  const getRemoveKey = () => {
    if (onlyChanges && dataset.next_draft) {
      return 'changes'
    }
    if (dataset.state === 'draft') {
      return 'draft'
    }
    return 'published'
  }

  const handleRemove = async () => {
    if (onlyChanges && !dataset.next_draft) {
      return // no unpublished changes
    }
    const identifier = onlyChanges ? dataset.next_draft.identifier : dataset.identifier

    try {
      setLoading(true)

      // Delete unpublished changes first
      if (dataset.next_draft) {
        let draftUrl = urls.v1.dataset(dataset.next_draft.identifier)
        if (metaxApiV2) {
          draftUrl = urls.v2.dataset(dataset.next_draft.identifier)
        }
        await axios.delete(draftUrl)
      }

      // Delete the actual dataset
      if (!onlyChanges) {
        let url = urls.v1.dataset(identifier)
        if (metaxApiV2) {
          url = urls.v2.dataset(identifier)
        }
        await axios.delete(url)
      }
      postRemoveUpdate(dataset, onlyChanges)
      onClose()
      setError(null)
    } catch (err) {
      setError(getResponseError(err))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!dataset) {
    return null
  }
  const removeKey = getRemoveKey()

  return (
    <Modal isOpen onRequestClose={clearAndClose} contentLabel="removeDatasetModal">
      <Translate component="p" content={`qvain.datasets.remove.confirm.${removeKey}.text`} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <TableButton id="cancel-remove-dataset" disabled={loading} onClick={clearAndClose}>
        <Translate content="qvain.datasets.remove.confirm.cancel" />
      </TableButton>
      <DangerButton id="confirm-remove-dataset" disabled={loading} onClick={() => handleRemove()}>
        <Translate content={`qvain.datasets.remove.confirm.${removeKey}.ok`} />
      </DangerButton>
    </Modal>
  )
}

RemoveModal.propTypes = {
  dataset: PropTypes.object,
  onlyChanges: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  postRemoveUpdate: PropTypes.func.isRequired,
}

RemoveModal.defaultProps = {
  dataset: null,
  onlyChanges: false,
}

export const ErrorMessage = styled.p`
  background-color: #ffebe8;
  color: red;
  border: 1px solid rgba(64, 0, 0, 0.3);
  padding: 0.5em;
`

export default withRouter(observer(RemoveModal))
