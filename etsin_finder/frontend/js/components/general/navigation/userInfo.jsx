import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

import Stores from '../../../stores'
import Button from '../button'
import Dropdown from '../dropdown'
import Loader from '../loader'

class UserInfo extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  state = {
    loading: false,
  }

  logout = () => {
    Stores.Auth.logout()
  }

  redirect = location => {
    this.setState({
      loading: true,
    })
    window.location = `/sso?relay=${location.pathname}`
  }

  render() {
    if (!Stores.Auth.userLogged) {
      return (
        <div style={{ position: 'relative' }}>
          <LoaderCont active={this.state.loading}>
            <Loader active color="white" size="1.1em" spinnerSize="3px" />
          </LoaderCont>
          <Button
            noMargin
            onClick={() => {
              this.redirect(this.props.location)
            }}
          >
            <LoginText visible={!this.state.loading}>Login</LoginText>
          </Button>
        </div>
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

const LoaderCont = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  visibility: ${p => (p.active ? 'initial' : 'hidden')};
`
const LoginText = styled.span`
  visibility: ${p => (p.visible ? 'initial' : 'hidden')};
`

export default withRouter(inject('Stores')(observer(UserInfo)))
