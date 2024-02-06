import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { observer } from 'mobx-react'
import axios from 'axios'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import urls from '../../../../utils/urls'
import Modal from '../../../general/modal'
import { TableButton, DangerButton } from '../../general/buttons'
import { getResponseError } from '../../utils/responseError'
import { useStores } from '../../utils/stores'

const modalDataTypes = {
  dataset: PropTypes.object.isRequired,
  onlyChanges: PropTypes.bool.isRequired,
  postRemoveCallback: PropTypes.func,
}

export const RemoveModal = () => {
  const {
    QvainDatasets: { removeModal },
    Env: {
      metaxV3Url,
      Flags: { flagEnabled },
    },
  } = useStores()

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!removeModal.data) {
    return null
  }

  PropTypes.checkPropTypes(modalDataTypes, removeModal.data, 'data', 'RemoveModal')

  const {
    close,
    data: { dataset, onlyChanges, postRemoveCallback },
  } = removeModal

  const clearAndClose = () => {
    setError(null)
    setLoading(null)
    close()
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
      let removed = false

      // Delete unpublished changes first
      if (dataset.next_draft) {
        let draftUrl
        if (flagEnabled('QVAIN.METAX_V3.FRONTEND')) {
          draftUrl = metaxV3Url('dataset', dataset.next_draft.identifier)
        } else {
          draftUrl = urls.qvain.dataset(dataset.next_draft.identifier)
        }
        await axios.delete(draftUrl)
        removed = true
      }

      // Delete the actual dataset
      if (!onlyChanges) {
        let url
        if (flagEnabled('QVAIN.METAX_V3.FRONTEND')) {
          url = metaxV3Url('dataset', identifier)
        } else {
          url = urls.qvain.dataset(identifier)
        }
        await axios.delete(url)
        removed = true
      }

      if (removed && postRemoveCallback) {
        postRemoveCallback()
      }
      clearAndClose()
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

export const ErrorMessage = styled.p`
  background-color: #ffebe8;
  color: red;
  border: 1px solid rgba(64, 0, 0, 0.3);
  padding: 0.5em;
`

export default observer(RemoveModal)
