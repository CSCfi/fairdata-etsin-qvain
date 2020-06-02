import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import ConfirmClose from '../../general/confirmClose'
import Form from './form'
import ProvenanceButtons from './ProvenanceButtons'

class ModalContent extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    editMode: PropTypes.bool
  }

  static defaultProps = {
    editMode: false
  }

  constructor(props) {
    super(props)
    this.translations = {
      title: props.editMode
        ? 'qvain.history.provenance.modal.editTitle'
        : 'qvain.history.provenance.modal.addTitle'
    }
  }

  state = {
    confirmOpen: false
  }

  setConfirmOpen = (val) => {
    this.setState({ confirmOpen: val })
  }

  close = () => {
    const { clearProvenanceInEdit } = this.props.Stores.Qvain.Provenances
    clearProvenanceInEdit()
    this.setConfirmOpen(false)
  }

  render() {
    const { confirmOpen } = this.state
      return (
        <>
          <Header><Translate content={this.translations.title} /></Header>
          <Content>
            <Form />
            <ProvenanceButtons handleRequestClose={() => this.setConfirmOpen(true)} />

            <ConfirmClose
              show={confirmOpen}
              hideConfirm={() => this.setConfirmOpen(false)}
              closeModal={this.close}
            />
          </Content>
        </>
      )
  }
}

const Content = styled.div`
  flex-grow: 1;
  width: 100%;
  overflow: auto;
  margin-bottom: 0.5rem;
`

const Header = styled.h3`
  margin-right: 1.5rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  margin-left: 0rem;
`

export default inject('Stores')(observer(ModalContent))
