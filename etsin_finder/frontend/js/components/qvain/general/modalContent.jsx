import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { ConfirmClose } from './confirmClose'
import ModalButtons from './modalButtons'

class ModalContent extends Component {
  static propTypes = {
    Store: PropTypes.object.isRequired,
    Field: PropTypes.object.isRequired,
    Form: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ]).isRequired,
    handleSave: PropTypes.func.isRequired,
    translationsRoot: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    const { editMode } = this.props.Field
    this.translations = {
      title: editMode
        ? `${this.props.translationsRoot}.modal.title.edit`
        : `${this.props.translationsRoot}.modal.title.add`,
        buttons: {
          cancel: `${this.props.translationsRoot}.modal.buttons.cancel`,
          save: `${this.props.translationsRoot}.modal.buttons.save`,
          editSave: `${this.props.translationsRoot}.modal.buttons.editSave`,
        },
      }
    this.state = {
      confirmOpen: false,
    }
  }

  setConfirmOpen = val => {
    this.setState({ confirmOpen: val })
  }

  close = () => {
    const { clearInEdit } = this.props.Field
    clearInEdit()
    this.setConfirmOpen(false)
  }

  render() {
    const { confirmOpen } = this.state
    const { Store, Field, handleSave, Form, translationsRoot, language } = this.props
    const { readonly } = Store

    return (
      <>
        <Header>
          <Translate content={this.translations.title} />
        </Header>
        <Content>
          <Form Store={Store} Field={Field} translationsRoot={translationsRoot} language={language} />
          <ModalButtons
            handleRequestClose={() => this.setConfirmOpen(true)}
            translations={this.translations}
            readonly={readonly}
            handleSave={() => handleSave(Field)}
            Field={Field}
          />
          <ConfirmClose
            show={confirmOpen}
            onCancel={() => this.setConfirmOpen(false)}
            onConfirm={this.close}
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

export default ModalContent
