{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import Stores from '../../../stores'
import Button from '../button'
import Loader from '../loader'
import NoticeBar from '../noticeBar'
import LoggedInUser from '../loggedInUser'
import { Dropdown, DropdownItem } from '../dropdown'

class Login extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    margin: PropTypes.string,
    width: PropTypes.string,
    isLoggedInKey: PropTypes.string,
    fontSize: PropTypes.string,
  }

  static defaultProps = {
    margin: '0 0 0 0.4em',
    width: undefined,
    fontSize: 'inherit',
    isLoggedInKey: 'userLogged',
  }

  state = {
    loading: false,
    showNotice: false,
  }

  logout = () => {
    this.setState(
      {
        showNotice: true,
      },
      () => {
        window.location = '/slo'
      }
    )
  }

  redirect = location => {
    this.setState(
      {
        loading: true,
      },
      () => {
        window.location = `/sso?relay=${location.pathname}`
      }
    )
  }

  render() {
    if (!Stores.Auth[this.props.isLoggedInKey]) {
      return (
        <React.Fragment>
          <Cont width={this.props.width} margin={this.props.margin}>
            <LoaderCont active={this.state.loading}>
              <Loader active color="white" size="1.1em" spinnerSize="3px" />
            </LoaderCont>
            <LogoutButton
              width={this.props.width}
              margin="0"
              onClick={() => this.redirect(this.props.location)}
            >
              <LoginText visible={!this.state.loading} fontSize={this.props.fontSize}>
                <Translate content="nav.login" />
              </LoginText>
            </LogoutButton>
          </Cont>
          {this.state.showNotice && (
            <NoticeBar
              border
              z="100"
              position="fixed"
              border_color="primary"
              color="white"
              bg="primary"
              duration={4000}
            >
              <Translate content="nav.logoutNotice" />
            </NoticeBar>
          )}
        </React.Fragment>
      )
    }
    {
      /* <Translate content="nav.logout" /> */
    }
    return (
      <Dropdown buttonComponent={LogoutButton} buttonContent={<LoggedInUser />}>
        <DropdownItem onClick={this.logout}>
          <Translate content="nav.logout" />
        </DropdownItem>
      </Dropdown>
    )
  }
  // <DropdownMenu transparent={false} buttonContent={<LoggedInUser />}>
  //   <LogoutButton
  //     color="primary"
  //     onClick={this.logout}
  //     margin={this.props.margin}
  //     width={this.props.width}
  //   >
  //     <Translate content="nav.logout" />
  //   </LogoutButton>
  // </DropdownMenu>
}
const Cont = styled.div`
  width: ${p => (p.width ? p.width : '')};
  margin: ${p => (p.margin ? p.margin : '')};
  position: relative;
`

const LogoutButton = styled(Button)`
  margin: 0 auto;
  width: fit-content;
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
  font-size: ${p => p.fontSize};
`

export default withRouter(inject('Stores')(observer(Login)))
