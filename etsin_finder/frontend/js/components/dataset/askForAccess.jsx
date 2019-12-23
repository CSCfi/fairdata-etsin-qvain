import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import { inject, observer } from 'mobx-react'
import axios from 'axios'

import Button from '../general/button'
import REMSButton from './REMSButton'

class AskForAccess extends Component {
  state = {
    applicationState: this.props.Stores.Access.restrictions.applicationState,
  }

  onClick = () => {
    axios
      .get(`/api/rems/${this.props.cr_id}`)
      .then(res => {
        console.log(res)
        window.open(`https://vm1446.kaj.pouta.csc.fi/application/${res.data}`, '_blank')
      })
      .catch(err => {
        console.log(err)
        this.setState({ applicationState: 'Error' })
      })
  }

  render() {
    if (!this.props.Stores.Access.restrictions.showREMSbutton) {
      return null
    }
    const button = this.props.Stores.Auth.userLogged ? (
      <REMSButton applicationState={this.state.applicationState} onClick={this.onClick} />
    ) : (
      <div aria-hidden="true" title={translate('dataset.access_login')}>
        <Button disabled noMargin>
          <Translate content="dataset.access_permission" />
        </Button>
      </div>
    )
    return button
  }
}

AskForAccess.propTypes = {
  cr_id: PropTypes.string.isRequired,
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(AskForAccess))
