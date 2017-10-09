import React, { Component } from 'react';
import UserInfo from "./userInfo";
import { FormattedMessage } from "react-intl";

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
        <button type="button" className="btn btn-transparent" onClick={this.alertButton}>
          EN
        </button>
        <UserInfo></UserInfo>
      </div>
    );
  }
}