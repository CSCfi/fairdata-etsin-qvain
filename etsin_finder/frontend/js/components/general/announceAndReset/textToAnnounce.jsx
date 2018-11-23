import React from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'

const TextToAnnounce = (props) => (
  <React.Fragment>
    {props.Stores.Accessibility.navText}
  </React.Fragment>
)

TextToAnnounce.propTypes = {
  Stores: PropTypes.shape({
    Accessibility: PropTypes.shape({
      navText: PropTypes.string
    })
  }).isRequired
}

export default inject('Stores')(observer(TextToAnnounce))
