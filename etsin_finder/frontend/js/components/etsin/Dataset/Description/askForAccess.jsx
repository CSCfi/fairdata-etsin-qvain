import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import { observer } from 'mobx-react'
import axios from 'axios'

import Button from '@/components/etsin/general/button'
import REMSButton from './REMSButton'
import { REMS_URL } from '@/utils/constants'
import { withStores } from '@/utils/stores'
import urls from '@/utils/urls'

export class AskForAccess extends Component {
  state = {
    applicationState: this.props.Stores.Access.restrictions.applicationState,
    loading: false,
  }

  onClick = () => {
    this.setState({ loading: true })
    axios
      .get(urls.rems(this.props.cr_id))
      .then(res => {
        console.log(res)
        window.open(`${REMS_URL}/application/${res.data}`, '_blank')
      })
      .catch(err => {
        console.log(err)
        this.setState({ applicationState: 'disabled' })
      })
      .finally(() => {
        this.setState({ loading: false })
      })
  }

  render() {
    if (!this.props.Stores.Access.restrictions.showREMSbutton) {
      return null
    }
    const button = this.props.Stores.Auth.userLogged ? (
      <REMSButton
        loading={this.state.loading}
        applicationState={this.state.applicationState}
        onClick={this.onClick}
      />
    ) : (
      <div aria-hidden="true" title={translate('dataset.access_login')}>
        <Button id="disabled-rems-button" disabled noMargin>
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

export default withStores(observer(AskForAccess))
