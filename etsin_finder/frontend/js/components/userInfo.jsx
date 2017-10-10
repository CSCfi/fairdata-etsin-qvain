import React, { Component } from 'react';
import Translate from 'react-translate-component';

export default class UserInfo extends Component {

  logout(event) {
    alert(event.target.innerHTML);
  }

  render() {
    return (
      <div className="userInfo">
        <div className="dropdown">
          <button className="btn btn-transparent dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Matti Meikäläinen
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a className="dropdown-item" href="#">
              Action
            </a>
            <a className="dropdown-item" href="#">
              Another action
            </a>
            <a className="dropdown-item" href="#">
              Something else here
            </a>
          </div>
        </div>
        <button type="button" className="btn btn-transparent" onClick={this.logout}>
          Logout
        </button>
      </div>
    );
  }
}