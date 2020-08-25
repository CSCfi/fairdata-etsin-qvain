import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import ValidationError from '../../general/validationError'

const ActorErrors = ({ actorError, loadingFailed }) => (
  <>
    {actorError && <ValidationError>{actorError}</ValidationError>}
    {loadingFailed && (
      <Translate
        component={ValidationError}
        content={'qvain.actors.errors.loadingReferencesFailed'}
      />
    )}
  </>
)

ActorErrors.propTypes = {
  actorError: PropTypes.array,
  loadingFailed: PropTypes.bool,
}

ActorErrors.defaultProps = {
  actorError: null,
  loadingFailed: false,
}

export default ActorErrors
