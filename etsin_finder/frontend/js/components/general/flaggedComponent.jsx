import PropTypes from 'prop-types'
import { useStores } from '../../stores/stores'

const FlaggedComponent = ({ flag, children, whenDisabled }) => {
  const {
    Env: { [flag]: flagValue },
  } = useStores()
  if (flagValue) {
    return children
  }
  return whenDisabled
}

FlaggedComponent.propTypes = {
  flag: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  whenDisabled: PropTypes.element.isRequired,
}

export default FlaggedComponent
