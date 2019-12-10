import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import axios from 'axios'
import Button from '../general/button'
import access from '../../stores/view/access'

class AskForAccess extends Component {
  onClick = () => {
    axios
      .get(`/api/rems/${this.props.cr_id}`)
      .then(console.log('OK'))
      .catch(console.log('NOT OK'))
  }

  render() {
    if (!access.restrictions.allowAskForPermit) {
      return null
    }
    return (
      // TODO: fill with real world items
      <Button onClick={this.onClick} noMargin>
        <Translate content="dataset.access_permission" />
      </Button>
    )
  }
}

AskForAccess.propTypes = {
  cr_id: PropTypes.string.isRequired,
}

export default AskForAccess
