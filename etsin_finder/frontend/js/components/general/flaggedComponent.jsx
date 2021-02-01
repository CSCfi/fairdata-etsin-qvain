import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { useStores } from '../../stores/stores'

const FlaggedComponent = ({ flag, children, whenDisabled }) => {
  const {
    Env: {
      Flags: { flagEnabled },
    },
  } = useStores()

  if (flagEnabled(flag)) {
    return children
  }
  return whenDisabled
}

FlaggedComponent.propTypes = {
  flag: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  whenDisabled: PropTypes.element,
}

FlaggedComponent.defaultProps = {
  whenDisabled: null,
}

export default observer(FlaggedComponent)
