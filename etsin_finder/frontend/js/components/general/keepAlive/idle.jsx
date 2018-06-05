import { Component } from 'react'
import PropTypes from 'prop-types'

const eventsChanged = (yeoldevents, yonnewevents) =>
  yeoldevents.sort().toString() !== yonnewevents.sort().toString()

export default class Idle extends Component {
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

  handleChange(idle) {
    this.props.onChange({ idle })
    this.setState({ idle })
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

  attachEvents() {
    this.props.events.forEach(event => {
      window.addEventListener(event, this.handleEvent, true)
    })
  }

  timeout = null
  keepAlive = new Date().getTime()

  render() {
    return this.props.render(this.state)
  }
}
