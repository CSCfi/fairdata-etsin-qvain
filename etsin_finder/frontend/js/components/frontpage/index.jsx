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
import Translate from 'react-translate-component'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Search } from '../../routes'
import SearchBar from '../search/searchBar'
import HeroBanner from '../general/hero'
import KeyValues from './keyValues'
import Accessibility from '../../stores/view/accessibility'
import Tracking from '../../utils/tracking'
import Modal from '../general/modal'
import Auth from '../../stores/domain/auth'

import Stores from '../../stores'

const customStyles = {
  content: {
      minWidth: '20vw',
      maxWidth: '800px',
      padding: '3em',
  },
}

export default class FrontPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userPermissionErrorModalIsOpen: false
    }

    this.closeModal = this.closeModal.bind(this)
  }

  componentDidMount() {
    Accessibility.handleNavigation('home')
    Tracking.newPageView('Etsin | Tutkimusaineistojen hakupalvelu', this.props.location.pathname)
    // preload search page
    Search.preload()

    // TimeOut to check the user status, and display modal message if user is not authenticated
    setTimeout(() => {
      this.checkUserLoginStatus()
    }, 1000)
  }

  checkUserLoginStatus() {
    // If the user has a user.commonName, but not a user.name, it means they were verified through HAKA, but do not have a CSC account.
    if (Stores.Auth.user.commonName !== undefined && Stores.Auth.user.name === undefined) {
      this.setState({
        userPermissionErrorModalIsOpen: true
      })
    }
  }

  closeModal() {
    this.setState({
      userPermissionErrorModalIsOpen: false
    })
    // At this point, the user is "logged in", but not verified.
    // Performing Auth.logout(), ensuring the user is not still logged in with their unverified HAKA-account onRefreshPage
    Auth.logout()
  }

  render() {
    return (
      <div className="search-page">
        <Modal
          isOpen={this.state.userPermissionErrorModalIsOpen}
          onRequestClose={this.closeModal}
          customStyles={customStyles}
        >
          <Translate content="userAuthenticationError.header" component="h2" />
          <Translate content="userAuthenticationError.content" component="p" />
        </Modal>
        <HeroBanner className="hero-primary">
          <div className="container">
            <section className="text-center">
              <h1>
                <Translate content="home.title" />
              </h1>
              <SearchBar />
            </section>
          </div>
        </HeroBanner>
        <div className="container">
          <div className="regular-row">
            <TextHolder>
              <KeyValues />
              <article>
                <section>
                  <Translate content="home.title1" component="h2" />
                  <Translate content="home.para1" component="p" unsafe />
                </section>
                <section>
                  <Translate content="home.title2" component="h2" />
                  <Translate content="home.para2" component="p" unsafe />
                </section>
              </article>
            </TextHolder>
          </div>
        </div>
      </div>
    )
  }
}

FrontPage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
}

const TextHolder = styled.div`
  max-width: 50rem;
  margin: 0 auto;
  p {
    white-space: pre-line;
  }
`
