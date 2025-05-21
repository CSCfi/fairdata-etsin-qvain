import PropTypes from 'prop-types'
import Translate from '@/utils/Translate'
import ValidationError, { ValidationErrors } from '../../../general/errors/validationError'

const ActorErrors = ({ actorError, loadingFailed }) => (
  <>
    {actorError && <ValidationErrors errors={actorError} />}
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
