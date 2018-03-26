import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ErrorBoundary from 'Components/general/errorBoundary'
import Header from './header'
import Footer from './footer'
import Content from './content'

export default class Layout extends Component {
  render() {
    return (
      <ErrorBoundary>
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
