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

export function parseOrganization(organization) {
  const out = []
  const { name, identifier, email } = organization
  out.push({ name, identifier, email })
  if ('is_part_of' in organization) {
    out.push(...parseOrganization(organization.is_part_of))
  }
  return out
}
