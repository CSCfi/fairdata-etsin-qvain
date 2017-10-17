import React from 'react';
import Translate from 'react-translate-component';

export default class ErrorPage extends React.Component {
  render() {
    // TODO: Expects all error to be 404s on dataset page.
    // Extend class to handle all kinds of errors.
    // Also, make it prettier.

    return (
      <div>
        <Translate content="error.notFound" />
      </div>
    );
  }
}
