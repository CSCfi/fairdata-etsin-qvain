import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Modal from 'react-modal'
import translate from 'counterpart'
import Translate from 'react-translate-component'
import { InvertedButton } from '../../general/button'
import Splash from '../../general/splash'
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

    const recipients = this.buildRecipients(props.emails)
    const translations = translate('dataset.contact')

    this.state = {
      open: false,
      splash: false,
      recipients,
      translations,
    }

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentWillMount() {
    Modal.setAppElement('#root')
  }

  componentWillReceiveProps(newProps) {
    const recipients = this.buildRecipients(newProps.emails)
    const translations = translate('dataset.contact')

    this.setState({
      translations,
      recipients,
    })
  }

  buildRecipients(emails) {
    const recipientLabels = {
      CONTRIBUTOR: 'dataset.contributor.snglr',
      CREATOR: 'dataset.creator.snglr',
      CURATOR: 'dataset.curator',
      PUBLISHER: 'dataset.publisher',
      RIGHTS_HOLDER: 'dataset.rights_holder',
    }
    const recipients = []
    for (const o in emails) {
      if (emails[o]) recipients.push({ label: translate(recipientLabels[o]), value: o })
    }
    return recipients
  }

  openModal() {
    this.setState({
      open: true,
    })
  }

  closeModal(e, sent = true) {
    console.log('sent', sent)
    this.setState(
      {
        splash: sent,
        open: false,
      },
      () => {
        if (sent) {
          setTimeout(() => {
            this.setState({
              splash: false,
            })
          }, 1200)
        }
      }
    )
  }

  render() {
    return (
      <div>
        <InvertedButton onClick={this.openModal}>
          <Translate content="dataset.contact.send" />
        </InvertedButton>
        <Modal
          isOpen={this.state.open}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Contact"
        >
          <h2>
            <Translate content="dataset.contact.contact" />
          </h2>
          <CloseModal onClick={this.closeModal}>X</CloseModal>
          <ContactForm
            close={this.closeModal}
            datasetID={this.props.datasetID}
            recipientsList={this.state.recipients}
            translations={this.state.translations}
          />
        </Modal>
        <Splash visible={this.state.splash}>
          <Translate content="dataset.contact.success" component="h1" />
        </Splash>
      </div>
    )
  }
}

Contact.propTypes = {
  emails: PropTypes.shape({
    CONTRIBUTOR: PropTypes.bool,
    CREATOR: PropTypes.bool,
    CURATOR: PropTypes.bool,
    PUBLISHER: PropTypes.bool,
    RIGHTS_HOLDER: PropTypes.bool,
  }).isRequired,
  datasetID: PropTypes.string.isRequired,
}
