import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

import dateFormat from '../../utils/dateFormat'

class DateFormat extends Component {
  render() {
    return <span>{dateFormat(this.props.date)}</span>
  }
}

DateFormat.propTypes = {
  date: PropTypes.string.isRequired,
}

export default inject('Stores')(observer(DateFormat))
