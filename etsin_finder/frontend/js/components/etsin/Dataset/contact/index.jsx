{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import translate from 'counterpart'
import Translate from 'react-translate-component'

import { InvertedButton } from '../../general/button'
import Splash from '../../general/splash'
import ContactForm from './contactForm'
import Modal from '../../../general/modal'

const Notice = styled.p`
  margin-bottom: 0;
  color: ${p => p.theme.color.error};
  font-style: italic;
`

const customStyles = {
  content: {
    minWidth: '20vw',
    maxWidth: '60vw',
    padding: '2vw',
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

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(newProps) {
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
      if (emails[o]) {
        if (o !== 'CONTRIBUTOR') {
          recipients.push({ label: translate(recipientLabels[o]), value: o })
        }
      }
    }
    return recipients
  }

  openModal() {
    this.setState({
      open: true,
    })
  }

  closeModal(e, sent = false) {
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
      <>
        <InvertedButton onClick={this.openModal}>
          <Translate content="dataset.contact.send" />
        </InvertedButton>
        <Modal
          isOpen={this.state.open}
          onRequestClose={this.closeModal}
          customStyles={customStyles}
          contentLabel="Contact"
        >
          <h2>
            <Translate content="dataset.contact.contact" />
          </h2>
          {/* TEMPORARY: rems won't be needed in contact later. */}
          {this.props.isRems && (
            <Notice>
              <Translate content="dataset.contact.access" />
            </Notice>
          )}
          <ContactForm
            close={this.closeModal}
            datasetID={this.props.datasetID}
            recipientsList={this.state.recipients}
            translations={this.state.translations}
          />
        </Modal>
        <Splash visible={this.state.splash}>
          <Translate content="dataset.contact.success" component="h1" aria-live="assertive" />
        </Splash>
      </>
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
  // TEMPORARY: rems check won't be needed in contact later.
  isRems: PropTypes.bool.isRequired,
  datasetID: PropTypes.string.isRequired,
}
