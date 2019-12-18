import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'

import axios from 'axios'
import Button from '../general/button'
import access from '../../stores/view/access'

class AskForAccess extends Component {
  onClick = () => {
    axios
      .get(`/api/rems/${this.props.cr_id}`)
      .then(res => {
        console.log('OK')
        console.log(res)
        window.open(`https://vm1446.kaj.pouta.csc.fi/application/${res.data}`, '_blank')
      })
      .catch(err => {
        console.log('NOT OK')
        console.log(err)
      })
  }

  render() {
    if (!access.restrictions.allowAskForPermit) {
      return null
    }
    const button = this.props.Stores.Auth.userLogged ? (
      <Button onClick={this.onClick} noMargin>
        <Translate content="dataset.access_permission" />
      </Button>
    ) : (
      <Button disabled noMargin>
        <Translate content="dataset.access_permission" />
      </Button>
    )
    return button
  }
}

AskForAccess.propTypes = {
  cr_id: PropTypes.string.isRequired,
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(AskForAccess))
