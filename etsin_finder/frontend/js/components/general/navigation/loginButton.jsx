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
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import Stores from '../../../stores'
import Button from '../button'
import Loader from '../loader'
import NoticeBar from '../noticeBar'
import LoggedInUser from '../loggedInUser'
import { Dropdown, DropdownItem } from '../dropdown'
import { withStores } from '../../../stores/stores'

class Login extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    margin: PropTypes.string,
    width: PropTypes.string,
    isLoggedInKey: PropTypes.string,
    fontSize: PropTypes.string,
    borderColor: PropTypes.string,
    loginThroughService: PropTypes.string,
  }

  static defaultProps = {
    margin: '0 0 0 0.4em',
    width: undefined,
    fontSize: 'inherit',
    isLoggedInKey: 'userLogged',
    borderColor: '',
    loginThroughService: '',
  }

  state = {
    loading: false,
    showNotice: false,
    loggedInThroughService: '',
  }

  componentDidMount() {
    this.setState({
      loggedInThroughService: this.props.loginThroughService,
    })

    window.addEventListener('pageshow', this.pageShowHandler)
  }

  componentWillUnmount() {
    window.removeEventListener('pageshow', this.pageShowHandler)
  }

  pageShowHandler = () => {
    this.setState({ loading: false })
  }

  redirectToLogin = (location, loginThroughService) => {
    const query = location.search
    this.setState(
      {
        loading: true,
      },
      () => {
        window.location = `/login/${loginThroughService}?relay=${
          location.pathname
        }${encodeURIComponent(query)}`
      }
    )
  }

  logout = () => {
    this.setState(
      {
        showNotice: true,
      },
      () => {
        window.location = `/logout/${this.state.loggedInThroughService}`
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
              onClick={() =>
                this.redirectToLogin(this.props.location, this.props.loginThroughService)
              }
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
  white-space: nowrap;
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

export default withRouter(withStores(observer(Login)))
