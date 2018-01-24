import React from 'react';
import Translate from 'react-translate-component';

import Navi from '../components/general/navigation';
import ErrorBoundary from '../components/general/errorBoundary'

export default class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="header">
        <ErrorBoundary>
          <div className="container">
            <div className="row top-logo">
              <div className="container align-left row">
                <img alt="Etsin -logo" src="../../static/images/etsin_logo.png" />
                <p className="slogan">
                  <Translate content="slogan" />
                </p>
              </div>
            </div>
            <Navi />
          </div>
        </ErrorBoundary>
      </div>
    );
  }
}
