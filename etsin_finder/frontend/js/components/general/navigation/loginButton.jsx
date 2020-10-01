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
    borderColor: PropTypes.string,
    loggedInAsService: PropTypes.string,
  }

  static defaultProps = {
    margin: '0 0 0 0.4em',
    width: undefined,
    fontSize: 'inherit',
    isLoggedInKey: 'userLogged',
    borderColor: '',
    loggedInAsService: '',
  }

  state = {
    loading: false,
    showNotice: false,
    loggedInThrough: '',
  }

  componentDidMount() {
    this.setState({
      loggedInThrough: this.props.loggedInAsService
    })
  }

  logout = () => {
    this.setState(
      {
        showNotice: true,
      },
      () => {
        window.location = `/slo/${this.state.loggedInThrough}`
      }
    )
  }

  redirect = (location, loggedInAsService) => {
    const query = location.search
    this.setState(
      {
        loading: true,
      },
      () => {
        window.location = `/sso/${loggedInAsService}?relay=${location.pathname}${encodeURIComponent(query)}`
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
            <LoginButton
              width={this.props.width}
              margin="0"
              onClick={() => this.redirect(this.props.location, this.props.loggedInAsService)}
              borderColor={this.props.borderColor}
            >
              <LoginText visible={!this.state.loading} fontSize={this.props.fontSize}>
                <Translate content="nav.login" />
              </LoginText>
            </LoginButton>
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
    return (
      <Dropdown buttonComponent={LoginButton} buttonContent={<LoggedInUser />}>
        <DropdownItem onClick={this.logout}>
          <Translate content="nav.logout" />
        </DropdownItem>
      </Dropdown>
    )
  }
}
const Cont = styled.div`
  width: ${p => (p.width ? p.width : '')};
  margin: ${p => (p.margin ? p.margin : '')};
  position: relative;
`

const LoginButton = styled(Button)`
  width: fit-content;
  ${props =>
    props.borderColor &&
    `
  border-color: ${props.theme.color[props.borderColor]};
  :hover {
    border-color: ${props.theme.color[props.borderColor]};
  }
  `}
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
