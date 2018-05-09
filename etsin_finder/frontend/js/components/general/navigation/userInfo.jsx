import React, { Component } from 'react'

export default class UserInfo extends Component {
  logout() {
    alert(this.target.innerHTML)
  }

  render() {
    return (
      <div className="userInfo">
        <div className="dropdown">
          <button
            className="btn btn-transparent dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
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
    )
  }
  /* <a
    href={
      document.getElementById('root').hasAttribute('is_auth')
        ? '#'
        : this.props.location.pathname + '?sso'
    }
  >
    {document.getElementById('root').hasAttribute('is_auth') ? 'Logout' : 'Login'}
  </a>
  <p>
    The user is{document.getElementById('root').hasAttribute('is_auth') ? '' : ' not'}{' '}
    logged in. Use incognito mode to test login repeatedly.
  </p> */
}
