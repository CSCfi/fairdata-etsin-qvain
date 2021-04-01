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

import { Component } from 'react'
import PropTypes from 'prop-types'

const eventsChanged = (oldEvents, newEvents) => {
  const olde = oldEvents.sort().toString()
  const newe = newEvents.sort().toString()
  return olde !== newe
}

export default class Idle extends Component {
  timeout = null

  keepAlive = new Date().getTime()

  static propTypes = {
    defaultIdle: PropTypes.bool,
    render: PropTypes.func,
    onChange: PropTypes.func,
    eventInterval: PropTypes.number,
    eventCallback: PropTypes.func,
    timeout: PropTypes.number,
    events: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    defaultIdle: false,
    render: () => null,
    onChange: () => {},
    eventInterval: 60000,
    eventCallback: () => {},
    timeout: 1000,
    events: ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'],
  }

  state = {
    idle: this.props.defaultIdle,
  }

  componentDidMount() {
    this.attachEvents()
    this.setTimeout()
  }

  componentDidUpdate(prevProps) {
    if (eventsChanged(prevProps.events, this.props.events)) {
      this.removeEvents()
      this.attachEvents()
    }
  }

  componentWillUnmount() {
    this.removeEvents()
    clearTimeout(this.timeout)
  }

  handleEvent = () => {
    if (this.state.idle) {
      this.handleChange(false)
    }
    // custom event to fire between a set duration of time
    if (new Date().getTime() - this.keepAlive > this.props.eventInterval) {
      this.props.eventCallback()
      this.keepAlive = new Date().getTime()
    }
    clearTimeout(this.timeout)
    this.setTimeout()
  }

  handleChange(idle) {
    this.props.onChange({ idle })
    this.setState({ idle })
  }

  setTimeout() {
    this.timeout = setTimeout(() => {
      this.handleChange(true)
    }, this.props.timeout)
  }

  removeEvents() {
    this.props.events.forEach(event => {
      window.removeEventListener(event, this.handleEvent, true)
    })
  }

  attachEvents() {
    this.props.events.forEach(event => {
      window.addEventListener(event, this.handleEvent, true)
    })
  }

  render() {
    return this.props.render(this.state)
  }
}
