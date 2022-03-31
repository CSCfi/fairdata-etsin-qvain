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
import Modal from '../general/modal'
import { withStores } from '../../stores/stores'

const customStyles = {
  content: {
    minWidth: '20vw',
    maxWidth: '60vw',
    padding: '2vw',
  },
}

class FrontPage extends Component {
  state = {
    userPermissionErrorModalIsOpen: false,
    userHomeOrganizationErrorModalIsOpen: false,
  }

  constructor(props) {
    super(props)
    this.closeUserPermissionErrorModal = this.closeUserPermissionErrorModal.bind(this)
    this.closeUserHomeOrganizationErrorModal = this.closeUserHomeOrganizationErrorModal.bind(this)
  }

  componentDidMount() {
    const {
      Accessibility,
      Matomo: { recordEvent },
    } = this.props.Stores

    Accessibility.handleNavigation('home')
    // preload search page
    Search.preload()

    // Check the user status, and display modal message if user is not authenticated
    this.checkUserLoginStatus()

    recordEvent('HOME')
  }

  checkUserLoginStatus() {
    const { Auth } = this.props.Stores
    Auth.checkLogin()
      .then(() => {
        // If the user was logged in but does not have a user.name,
        // it means they were verified through HAKA, but do not have a CSC account.
        if (Auth.user.loggedIn && Auth.user.name === undefined) {
          this.setState({
            userPermissionErrorModalIsOpen: true,
          })
          // If the user has a user.name, but not a user.homeOrganizationId,
          // it means they have a CSC account, but no home organization set.
        } else if (Auth.user.name !== undefined && Auth.user.homeOrganizationId === undefined) {
          this.setState({
            userHomeOrganizationErrorModalIsOpen: true,
          })
        }
      })
      .catch(err => {
        console.log('ERROR in checkLogin')
        console.log(err)
      })
  }

  closeUserPermissionErrorModal() {
    const { Auth } = this.props.Stores
    this.setState({
      userPermissionErrorModalIsOpen: false,
    })
    // At this point, the user is "logged in", but not verified.
    // Performing Auth.logout(), ensuring the user is not still logged in with their unverified HAKA-account onRefreshPage
    Auth.logout()
  }

  closeUserHomeOrganizationErrorModal() {
    const { Auth } = this.props.Stores
    this.setState({
      userHomeOrganizationErrorModalIsOpen: false,
    })
    // At this point, the user is "logged in" and has a CSC account, but does not have a home organization set in sui.csc.fi.
    // Performing Auth.logout(), ensuring the user is not still logged in onRefreshPage
    Auth.logout()
  }

  render() {
    return (
      <div className="search-page">
        <Modal
          isOpen={this.state.userPermissionErrorModalIsOpen}
          onRequestClose={this.closeUserPermissionErrorModal}
          customStyles={customStyles}
          contentLabel="LoginUnsuccessfulPermissionError"
        >
          <Translate content="userAuthenticationError.header" component="h2" />
          <Translate content="userAuthenticationError.content" component="p" />
        </Modal>
        <Modal
          isOpen={this.state.userHomeOrganizationErrorModalIsOpen}
          onRequestClose={this.closeUserHomeOrganizationErrorModal}
          customStyles={customStyles}
          contentLabel="LoginUnsuccessfulHomeOrganizationError"
        >
          <Translate content="userHomeOrganizationErrror.header" component="h2" />
          <Translate content="userHomeOrganizationErrror.content" component="p" />
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
  Stores: PropTypes.object.isRequired,
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
export default withStores(FrontPage)
