import React, { Component } from 'react'
import styled from 'styled-components'
import Modal from 'react-modal'
import Button from '../../general/button'
import ContactForm from './contactForm'

const CloseModal = styled.button`
  background: transparent;
  border: none;
  position: absolute;
  top: 0.5em;
  right: 0.5em;
`

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  content: {
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    position: 'relative',
    maxHeight: '80vh',
    minWidth: '20vw',
    maxWidth: '800px',
    margin: '0.5em',
    padding: '3em',
  },
}

export default class Contact extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      recipients: [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }],
    }

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentWillMount() {
    Modal.setAppElement('#root')
  }

  openModal() {
    this.setState({
      open: true,
    })
  }

  closeModal() {
    this.setState({
      open: false,
    })
  }

  render() {
    return (
      <div>
        <Button onClick={this.openModal} noMargin>
          Contact Us!
        </Button>
        <Modal
          isOpen={this.state.open}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Object info"
        >
          <h2>Contact us</h2>
          <CloseModal onClick={this.closeModal}>X</CloseModal>
          <ContactForm recipientsList={this.state.recipients} />
        </Modal>
      </div>
    )
  }
}
