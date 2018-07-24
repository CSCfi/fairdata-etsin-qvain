import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import Button from '../general/button'
import access from '../../stores/view/access'

class AskForAccess extends Component {
  render() {
    if (!access.restrictions.allowAskForAccess) {
      return null
    }
    return (
      // TODO: fill with real world items
      <Button onClick={() => alert('Hae käyttölupaa')} noMargin>
        <Translate content="dataset.access_permission" />
      </Button>
    )
  }
}

AskForAccess.propTypes = {}

export default AskForAccess
