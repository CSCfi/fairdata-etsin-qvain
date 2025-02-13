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
import PropTypes from 'prop-types'

import Translate from '@/utils/Translate'
import Idle from './idle'
import NoticeBar from '../noticeBar'
import Auth from '../../../stores/domain/auth'

/*
  Logs user out if they idle for too long
  Renews session if user is active
*/

// TODO: change renewal time to real time, change idle time to match real time

export default class KeepAlive extends Component {
  timeout = null

  static propTypes = {
    loginThroughService: PropTypes.string,
  }

  static defaultProps = {
    loginThroughService: '',
  }

  state = {
    showNotice: false,
    loggedInThroughService: '',
  }

  componentDidMount() {
    this.setState({
      loggedInThroughService: this.props.loginThroughService,
    })
  }

  handleIdle = idle => {
    // User was idle for custom time and is logged in
    if (idle && Auth.userLogged) {
      this.timeout = setTimeout(() => {
        // Auth.logout()
        window.location = `/logout/${this.state.loggedInThroughService}`
        this.setState({
          showNotice: true,
        })
      }, 28800000)
    }

    // user moved after being idle for custom time and is logged in
    if (!idle && Auth.userLogged) {
      clearTimeout(this.timeout)
    }
  }

  renewSession = () => {
    // renew session if user is logged in
    if (Auth.userLogged) {
      Auth.renewSession()
      this.setState({
        showNotice: false,
      })
    }
  }

  render() {
    return (
      <>
        <Idle
          timeout={540000}
          onChange={({ idle }) => this.handleIdle(idle)}
          eventCallback={this.renewSession}
          eventInterval={60000}
        />
        {this.state.showNotice && (
          <NoticeBar
            border
            z="100"
            position="fixed"
            border_color="primary"
            color="white"
            bg="yellow"
          >
            <Translate content="general.state.inactiveLogout" />
          </NoticeBar>
        )}
      </>
    )
  }
}
