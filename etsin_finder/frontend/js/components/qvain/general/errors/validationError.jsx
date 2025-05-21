import styled from 'styled-components'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

export const isAlreadyTranslated = children => {
  if (Array.isArray(children)) {
    return children[0]?.includes(' ')
  }
  if (typeof children === 'string') {
    return children.includes(' ')
  }
  return false
}

export const ValidationError = ({ children }) => {
  if (!children || children?.length === 0) return null
  if (isAlreadyTranslated(children)) {
    return <ValidationErrorText>{children}</ValidationErrorText>
  }
  if (Array.isArray(children)) {
    // If children is a list of validation errors, use only first item.
    // Ideally the 'ValidationErrors' component should be used instead for lists.
    return <Translate key={children[0]} content={children[0]} component={ValidationErrorText} />
  }
  return <Translate key={children} content={children} component={ValidationErrorText} />
}

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
  if (errors?.length === 0) {
    return null
  }

  return (
    <ValidationErrorList>
      {errors.map(
        err => err && <Translate key={err} content={err} component={ValidationErrorItem} />
      )}
    </ValidationErrorList>
  )
}

ValidationErrors.propTypes = {
  errors: PropTypes.array,
}

ValidationErrors.defaultProps = {
  errors: [],
}

export default observer(ValidationError)
