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

import React from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import HeroBanner from '../general/hero'
import { withStores } from '../../stores/stores'

class ErrorPage extends React.Component {
  componentDidMount() {
    const { Accessibility } = this.props.Stores
    if (this.props.error.type === 'cscloginrequired') {
      Accessibility.handleNavigation('loginRequired')
    } else {
      Accessibility.handleNavigation('error')
    }
  }

  render() {
    // TODO: Expects all error to be 404s on dataset page.
    // Extend class to handle all kinds of errors.
    // Also, make it prettier.

    return (
      <HeroBanner className="hero-primary hero-full">
        <section className="container text-center" aria-live="polite">
          {this.props.error.type === 'cscloginrequired' && (
            <Translate content="error.cscLoginRequired" component="h1" />
          )}
          {this.props.error.type === 'notfound' && (
            <Translate content="error.notLoaded" component="h1" />
          )}
          {this.props.error.type === 'error' && (
            <Translate content="error.notLoaded" component="h1" />
          )}
          {this.props.error === undefined && <Translate content="error.undefined" component="h1" />}
        </section>
      </HeroBanner>
    )
  }
}

ErrorPage.propTypes = {
  Stores: PropTypes.object.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  error: PropTypes.shape({
    type: PropTypes.string,
  }).isRequired,
}

export default withRouter(withStores(ErrorPage))
