import React, { Component } from 'react';
import UserInfo from "./userInfo";

export default class SecondNav extends Component {
  alertButton(a) {
    console.log(a.target);
    alert(a.target.innerHTML);
  }
  render() {
    return (
      <div className="top-nav-right">
        <button type="button" className="btn btn-etsin" onClick={this.alertButton}>Lisää aineistoa</button>
        <button type="button" className="btn btn-transparent" onClick={this.alertButton}>EN</button>
        <UserInfo></UserInfo>
      </div>
    );
  }
}