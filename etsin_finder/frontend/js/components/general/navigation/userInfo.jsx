import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import Stores from '../../../stores'
import Button, { Link } from '../button'
import Dropdown from '../dropdown'

class UserInfo extends Component {
  state = {
    loggedin: Stores.Auth.loggedin,
  }

  componentWillMount() {
    this.checkLogin()
  }

  checkLogin = () => {
    Stores.Auth.checkLogin()
  }

  logout = () => {
    Stores.Auth.logout()
  }

  render() {
    if (!this.state.loggedin) {
      return (
        <Link margin="0em 1em" href={`${window.location.href}?sso`}>
          Login
        </Link>
      )
    }
    return (
      <div className="userInfo">
        <Dropdown>
          <P>{Stores.Auth.user.name}</P>
          <Button color="error" onClick={this.logout} br="0" noMargin padding="0.6em 1em">
            Logout
          </Button>
        </Dropdown>
      </div>
    )
  }
}

const P = styled.p`
  margin-bottom: 0;
  padding: 0.6em 1em;
  text-align: center;
`

export default withRouter(UserInfo)
