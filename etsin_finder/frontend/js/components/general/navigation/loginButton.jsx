import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import Stores from '../../../stores'
import Button from '../button'
import Loader from '../loader'

class Login extends Component {
  static defaultProps = {
    margin: '0 0 0 0.4em',
    width: undefined,
  }
  static propTypes = {
    location: PropTypes.object.isRequired,
    margin: PropTypes.string,
    width: PropTypes.string,
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
    if (location.search) {
      window.location = `${location.search}&sso`
    } else {
      window.location = '?sso'
    }
  }

  render() {
    if (!Stores.Auth.userLogged) {
      return (
        <Cont width={this.props.width}>
          <LoaderCont active={this.state.loading}>
            <Loader active color="white" size="1.1em" spinnerSize="3px" />
          </LoaderCont>
          <LoginButton
            width={this.props.width}
            margin={this.props.margin}
            onClick={() => {
              this.redirect(this.props.location)
            }}
          >
            <LoginText visible={!this.state.loading}>
              <Translate content="nav.login" />
            </LoginText>
          </LoginButton>
        </Cont>
      )
    }
    return (
      <LoginButton
        color="error"
        onClick={this.logout}
        margin={this.props.margin}
        width={this.props.width}
      >
        <Translate content="nav.logout" />
      </LoginButton>
    )
  }
}
const Cont = styled.div`
  width: ${p => (p.width ? p.width : '')};
  position: relative;
`

const LoginButton = styled(Button)`
  white-space: nowrap;
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

export default withRouter(inject('Stores')(observer(Login)))
