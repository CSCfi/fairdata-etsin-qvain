import React from 'react';
import Translate from 'react-translate-component';
import HeroBanner from './hero'

export default class ErrorPage extends React.Component {
  render() {
    // TODO: Expects all error to be 404s on dataset page.
    // Extend class to handle all kinds of errors.
    // Also, make it prettier.

    return (
      <HeroBanner className="hero-primary">
        <div className="container">
          <h1 className="text-center">
            <Translate content="error.notFound" />
          </h1>
        </div>
      </HeroBanner>
    );
  }
}
