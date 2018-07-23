import React from 'react'
import PropTypes from 'prop-types'

const AvailableTimestamp = props => {
  let content
  const AvailableTime = new Date(props.time)
  if (AvailableTime.getTime() < Date.now()) {
    content = `Available since ${AvailableTime}`
  } else {
    content = `Available on ${AvailableTime}`
  }
  return <div>{content}</div>
}

AvailableTimestamp.propTypes = {
  time: PropTypes.string.isRequired,
}

export default AvailableTimestamp
