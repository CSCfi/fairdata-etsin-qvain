import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

export const ValidationError = ({ children }) => (
  <Translate content={children} component={ValidationErrorText} />
)

ValidationError.propTypes = {
  children: PropTypes.node,
}

ValidationError.defaultProps = {
  children: null,
}

export const ValidationErrorText = styled.p`
  color: ${props => props.theme.color.redText};
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
        <Translate key={err} content={err} component={ValidationErrorItem} />
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
