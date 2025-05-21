import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { useStores } from '../../../utils/stores'

const TextToAnnounce = ({ location }) => {
  const { Accessibility } = useStores()
  return <>{Accessibility[location]}</>
}
TextToAnnounce.propTypes = {
  location: PropTypes.string.isRequired,
}

export default observer(TextToAnnounce)
