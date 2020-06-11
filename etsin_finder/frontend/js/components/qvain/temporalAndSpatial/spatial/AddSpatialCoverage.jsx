import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import Modal from '../../../general/modal'
import Button from '../../../general/button'
import ModalContent from './ModalContent'

class AddSpatialCoverage extends Component {
    static propTypes = {
      Stores: PropTypes.object.isRequired
    }

    close = () => {
      this.props.Stores.Qvain.Spatials.clearSpatialInEdit();
    }

    open = () => {
      const { startNewSpatial } = this.props.Stores.Qvain.Spatials
      startNewSpatial()
    }

    render() {
        const isModalOpen = !!this.props.Stores.Qvain.Spatials.spatialInEdit;
        return (
          <>
            {isModalOpen ? (
              <Modal
                isOpen
                onRequestClose={this.close}
                contentLabel="Add spatial coverage modal"
                customStyles={modalStyle}
              >
                <ModalContent />
              </Modal>
            ) : null}
            <ButtonContainer>
              <AddNewButton type="button" onClick={this.open}>
                <Translate content="qvain.temporalAndSpatial.spatial.addButton" />
              </AddNewButton>
            </ButtonContainer>
          </>
        )
    }
}

const ButtonContainer = styled.div`
  text-align: right;
`
const AddNewButton = styled(Button)`
  margin: 0;
  margin-top: 11px;
`

const modalStyle = {
  content: {
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    position: 'relative',
    minHeight: '85vh',
    maxHeight: '95vh',
    minWidth: '300px',
    maxWidth: '600px',
    margin: '0.5em',
    border: 'none',
    padding: '2em',
    boxShadow: '0px 6px 12px -3px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    paddingLeft: '2em',
    paddingRight: '2em',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}

export default inject('Stores')(observer(AddSpatialCoverage))
