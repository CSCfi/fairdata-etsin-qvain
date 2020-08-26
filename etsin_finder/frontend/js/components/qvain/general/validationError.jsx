import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

export const ValidationError = styled.p`
  color: red;
  :empty {
    display: none;
  }
`

export const ValidationErrorItem = styled.li`
  color: red;
`

export const ValidationErrorList = styled.ul`
  margin-top: 0.5em;
  color: red;
`

export const ValidationErrors = ({ errors }) => {
  if (!errors || errors.length === 0) {
    return null
  }
  return (
    <ValidationErrorList>
      {errors.map(err => (
        <ValidationErrorItem key={err}>{err}</ValidationErrorItem>
      ))}
    </ValidationErrorList>
  )
}

ValidationErrors.propTypes = {
  errors: PropTypes.array,
}

ValidationErrors.defaultProps = {
  errors: [],
}

export default ValidationError
