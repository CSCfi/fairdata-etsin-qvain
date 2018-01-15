import React, { Component } from 'react';

export default class UserInfo extends Component {
  logout() {
    alert(this.target.innerHTML);
  }

  render() {
    return (
      <div className="userInfo">
        <div className="dropdown">
          <button className="btn btn-transparent dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Matti Meikäläinen
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a className="dropdown-item" href="#a">
              Action
            </a>
            <a className="dropdown-item" href="#b">
              Another action
            </a>
            <a className="dropdown-item" href="#c">
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
