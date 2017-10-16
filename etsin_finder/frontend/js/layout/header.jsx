import React from 'react';
import Translate from 'react-translate-component';
import Navi from '../components/navi';
import SecondNav from '../components/secondnav';

export default class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="header">
        <div className="container">
          <div className="row top-logo">
            <div className="container align-left row">
              <img alt="Etsin -logo" src="../../static/images/etsin_logo.png" />
              <p className="slogan">
                <Translate content="slogan" />
              </p>
            </div>
          </div>
          <div className="row top-nav">
            <Navi />
            <SecondNav />
          </div>
        </div>
      </div>
    );
  }
}
