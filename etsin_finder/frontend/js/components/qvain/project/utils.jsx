import React from 'react'
import PropTypes from 'prop-types'

import ValidationError from '../general/validationError'


export const ErrorMessages = ({ errors }) => {
  if (!errors.length) return null
  return (
    <ValidationError>
      { errors.map(error => error) }
    </ValidationError>
  )
}

ErrorMessages.propTypes = {
  errors: PropTypes.array,
}

ErrorMessages.defaultProps = {
  errors: []
}
