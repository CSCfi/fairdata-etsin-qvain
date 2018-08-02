import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import dateFormat from '../../utils/dateFormat'

const AvailableTimestamp = props => {
  const availableTime = new Date(props.time)
  const isAvailable = () => availableTime.getTime() < new Date().getTime()
  return (
    <div>
      <div>
        {isAvailable() ? (
          <Available>Available since</Available>
        ) : (
          <Available>Available on</Available>
        )}
        <DisplayDate>{dateFormat(availableTime)}</DisplayDate>
      </div>
    </div>
  )
}

const Available = styled.p`
  margin-bottom: 0;
`

const DisplayDate = styled.p`
  font-style: italic;
  font-size: 0.9em;
  margin-bottom: 0;
`

AvailableTimestamp.propTypes = {
  time: PropTypes.string.isRequired,
}

export default AvailableTimestamp
