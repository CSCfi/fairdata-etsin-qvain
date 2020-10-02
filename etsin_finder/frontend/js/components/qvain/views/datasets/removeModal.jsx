import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import urls from '../../utils/urls'
import Modal from '../../../general/modal'
import { TableButton, DangerButton } from '../../general/buttons'
import { getResponseError } from '../../utils/responseError'
import Tracking from '../../../../utils/tracking'

class RemoveModal extends Component {
  state = {
    error: null,
    loading: false,
  }

  getRemoveKey = (dataset, onlyChanges) => {
    if (onlyChanges && dataset.next_draft) {
      return 'changes'
    }
    if (dataset.state === 'draft') {
      return 'draft'
    }
    return 'published'
  }

  handleRemove = async () => {
    const { dataset, onlyChanges, postRemoveUpdate, location, onClose, Stores } = this.props
    const { metaxApiV2 } = Stores.Env
    if (onlyChanges && !dataset.next_draft) {
      return // no unpublished changes
    }
    const identifier = onlyChanges ? dataset.next_draft.identifier : dataset.identifier

    try {
      this.setState({ loading: true })

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
        Tracking.trackEvent('Dataset', ' Removed', location.pathname)
      }
      postRemoveUpdate(dataset, onlyChanges)
      onClose()
      this.setState({ error: null })
    } catch (err) {
      this.setState({ error: getResponseError(err) })
      console.error(err)
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    const { dataset, onClose, onlyChanges } = this.props
    if (!dataset) {
      return null
    }
    const removeKey = this.getRemoveKey(dataset, onlyChanges)
    return (
      <Modal isOpen onRequestClose={onClose} contentLabel="removeDatasetModal">
        <Translate component="p" content={`qvain.datasets.remove.confirm.${removeKey}.text`} />
        {this.state.error && <ErrorMessage>{this.state.error}</ErrorMessage>}
        <TableButton id="cancel-remove-dataset" disabled={this.state.loading} onClick={onClose}>
          <Translate content="qvain.datasets.remove.confirm.cancel" />
        </TableButton>
        <DangerButton
          id="confirm-remove-dataset"
          disabled={this.state.loading}
          onClick={() => this.handleRemove()}
        >
          <Translate content={`qvain.datasets.remove.confirm.${removeKey}.ok`} />
        </DangerButton>
      </Modal>
    )
  }
}

RemoveModal.propTypes = {
  dataset: PropTypes.object,
  onlyChanges: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  postRemoveUpdate: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  Stores: PropTypes.object.isRequired,
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

export default withRouter(inject('Stores')(observer(RemoveModal)))
