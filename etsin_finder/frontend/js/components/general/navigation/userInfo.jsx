import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

import Stores from '../../../stores'
import Button from '../button'
import Dropdown from '../dropdown'

class UserInfo extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
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

  redirect = location => {
    console.log(location)
    if (location.search) {
      window.location = `${location.search}&sso`
    } else {
      window.location = '?sso'
    }
  }

  render() {
    if (!Stores.Auth.userLogged) {
      return (
        <Button
          noMargin
          onClick={() => {
            this.redirect(this.props.location)
          }}
        >
          Login
        </Button>
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

export default withRouter(inject('Stores')(observer(UserInfo)))
