import React, { Component } from 'react'
import Idle from './idle'
import Auth from '../../../stores/domain/auth'

/*
  Logs user out if they idle for too long
  and
  Renews session if user is active
*/

// TODO: change renewal time to real time, change idle time to match real time

export default class KeepAlive extends Component {
  handleIdle = idle => {
    if (idle && Auth.userLogged) {
      console.log('you will be logged out in 5s if you dont move')
      this.timeout = setTimeout(() => {
        Auth.logout()
        console.log('you have been logged out')
      }, 5000)
    }
    if (!idle && Auth.userLogged) {
      console.log('ok you moved so no')
      clearTimeout(this.timeout)
    }
    if (idle && !Auth.userLogged) {
      console.log('user not logged in so just idling')
    }
  }

  renewSession = () => {
    if (Auth.userLogged) {
      Auth.renewSession()
      console.log('session renewed')
    } else {
      console.log('tried to renew session but not logged in')
    }
  }

  timeout = null

  render() {
    return (
      <Idle
        timeout={5000}
        onChange={({ idle }) => this.handleIdle(idle)}
        eventCallback={this.renewSession}
        eventInterval={10000}
      />
    )
  }
}
