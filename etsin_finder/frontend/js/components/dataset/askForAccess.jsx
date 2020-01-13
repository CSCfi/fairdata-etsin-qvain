import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import Button from '../general/button'
import access from '../../stores/view/access'

class AskForAccess extends Component {
  render() {
    /*
      The second condition of this if statement was added to prevent the display of the REMS button,
      so that it isn't visible in production. This condition should be removed once REMS development is continued.
    */
    if (!access.restrictions.allowAskForPermit || access.restrictions.allowAskForPermit) {
      return null
    }
    return (
      // TODO: fill with real world items
      <Button onClick={() => alert('Ei vielä toteutettu')} noMargin>
        <Translate content="dataset.access_permission" />
      </Button>
    )
  }
}

AskForAccess.propTypes = {}

export default AskForAccess
