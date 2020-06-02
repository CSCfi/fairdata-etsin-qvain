import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import ConfirmClose from '../../general/confirmClose'
import Form from './form'
import SpatialButtons from './SpatialButtons'

class ModalContent extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    translationsRoot: PropTypes.string,
  }

  static defaultProps = {
    translationsRoot: 'qvain.temporalAndSpatial.spatial',
  }

  constructor(props) {
    super(props)
    const { editMode } = this.props.Stores.Qvain.Spatials
    this.translations = {
      title: editMode
        ? `${this.props.translationsRoot}.modal.title.edit`
        : `${this.props.translationsRoot}.modal.title.add`,
    }
    this.state = {
      confirmOpen: false,
    }
  }

  setConfirmOpen = val => {
    this.setState({ confirmOpen: val })
  }

  close = () => {
    const { clearSpatialInEdit } = this.props.Stores.Qvain.Spatials
    clearSpatialInEdit()
    this.setConfirmOpen(false)
  }

  render() {
    const { confirmOpen } = this.state
    return (
      <>
        <Header>
          <Translate content={this.translations.title} />
        </Header>
        <Content>
          <Form />
          <SpatialButtons handleRequestClose={() => this.setConfirmOpen(true)} />

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
  display: flex;
  flex-direction: column;
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
