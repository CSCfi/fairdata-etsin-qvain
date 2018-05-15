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
      this.timeout = setTimeout(() => {
        Auth.logout()
        this.setState({
          showNotice: true,
        })
      }, 30000)
    }

    // user moved after being idle for custom time and is logged in
    if (!idle && Auth.userLogged) {
      clearTimeout(this.timeout)
    }

    // user was idle for custom time but is not logged in
    if (idle && !Auth.userLogged) {
      console.log('user idle')
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

  timeout = null

  render() {
    return (
      <React.Fragment>
        <Idle
          timeout={30000}
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
