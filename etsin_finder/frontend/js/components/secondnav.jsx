import React, { Component } from 'react';
import Translate from 'react-translate-component';
import UserInfo from "./userInfo";
import LangToggle from "./langToggle";

export default class SecondNav extends Component {
  alertButton(a) {
    console.log(a.target);
    alert(a.target.innerHTML);
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