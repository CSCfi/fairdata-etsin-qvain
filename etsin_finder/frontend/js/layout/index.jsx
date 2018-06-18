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

import KeepAlive from '../components/general/keepAlive'
import ErrorBoundary from '../components/general/errorBoundary'
import Header from './header'
import Footer from './footer'
import Content from './content'

export default class Layout extends Component {
  render() {
    return (
      <ErrorBoundary>
        <KeepAlive />
        <Header />
        <Content contentRef={this.props.contentRef} />
        <Footer />
      </ErrorBoundary>
    )
  }
}

Layout.propTypes = {
  contentRef: PropTypes.func.isRequired,
}
