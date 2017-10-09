import React, { Component } from 'react';
import { FormattedMessage } from "react-intl";
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
          <FormattedMessage
            id="link.addDataset"
            defaultMessage="Add Dataset"
            description="Link to adding Dataset"
          />
        </button>
        <LangToggle />
        <UserInfo></UserInfo>
      </div>
    );
  }
}