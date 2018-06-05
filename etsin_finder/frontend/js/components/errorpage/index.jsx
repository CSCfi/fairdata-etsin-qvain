import React from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

import HeroBanner from '../general/hero'

export default class ErrorPage extends React.Component {
  render() {
    // TODO: Expects all error to be 404s on dataset page.
    // Extend class to handle all kinds of errors.
    // Also, make it prettier.

    return (
      <HeroBanner className="hero-primary hero-full">
        <div className="container text-center" aria-live="polite">
          {this.props.error.type === 'notfound' && (
            <Translate content="error.notFound" component="h1" />
          )}
          {this.props.error.type === 'error' && (
            <Translate content="error.notLoaded" component="h1" />
          )}
        </div>
      </HeroBanner>
    )
  }
}

ErrorPage.propTypes = {
  error: PropTypes.shape({
    type: PropTypes.string,
  }).isRequired,
}
