import React, { Component } from 'react';
import Translate from 'react-translate-component';
import LangToggle from './langToggle';

export default class SecondNav extends Component {
  alertButton() {
    console.log(this.target)
  }
  render() {
    return (
      <div className="top-nav-right">
        <button type="button" className="btn btn-etsin" onClick={this.alertButton}>
          <Translate content="addDataset" />
        </button>
        <LangToggle />
      </div>
    );
  }
}
