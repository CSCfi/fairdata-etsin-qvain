import React, { Component } from 'react'

import Idle from './idle'
import NoticeBar from '../noticeBar'
import Auth from '../../../stores/domain/auth'

/*
  Logs user out if they idle for too long
  and
  Renews session if user is active
*/

// TODO: change renewal time to real time, change idle time to match real time

export default class KeepAlive extends Component {
  state = {
    showNotice: false,
  }
  handleIdle = idle => {
    // user was idle for custom time and is logged in
    if (idle && Auth.userLogged) {
      console.log('you will be logged out in 5s if you dont move')
      this.timeout = setTimeout(() => {
        Auth.logout()
        this.setState({
          showNotice: true,
        })
        console.log('you have been logged out')
      }, 5000)
    }

    // user moved after being idle for custom time and is logged in
    if (!idle && Auth.userLogged) {
      console.log('ok you moved so no')
      clearTimeout(this.timeout)
    }

    // user was idle for custom time but is not logged in
    if (idle && !Auth.userLogged) {
      console.log('user not logged in so just idling')
    }
  }

  renewSession = () => {
    // renew session if user is logged in
    if (Auth.userLogged) {
      Auth.renewSession()
      this.setState({
        showNotice: false,
      })
      console.log('session renewed')
    }
  }

  timeout = null

  render() {
    return (
      <React.Fragment>
        <Idle
          timeout={5000}
          onChange={({ idle }) => this.handleIdle(idle)}
          eventCallback={this.renewSession}
          eventInterval={10000}
        />
        {this.state.showNotice && (
          <NoticeBar
            border
            z="100"
            position="fixed"
            border_color="primary"
            color="white"
            bg="yellow"
            text="You have been logged out due to inactivity"
          />
        )}
      </React.Fragment>
    )
  }
}
