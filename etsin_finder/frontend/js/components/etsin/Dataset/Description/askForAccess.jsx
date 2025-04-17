import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import REMSButton from './REMSButton'
import { withStores } from '@/utils/stores'
import AccessModal from './AccessModal'

export class AskForAccess extends Component {
  state = {
    applicationState: this.props.Stores.Access.restrictions.applicationState,
    loading: false,
  }

  onClick = () => {
    const {
      Etsin: {
        EtsinDataset: { setShowAccessModal },
      },
    } = this.props.Stores
    setShowAccessModal(true)
  }

  render() {
    const { Env } = this.props.Stores
    if (!Env.Flags.flagEnabled('ETSIN.REMS')) {
      return null
    }
    if (!this.props.Stores.Access.restrictions.showREMSbutton) {
      return null
    }
    return (
      <>
        <REMSButton
          loading={this.state.loading}
          applicationState={this.state.applicationState}
          onClick={this.onClick}
        />
        <AccessModal />
      </>
    )
  }
}

AskForAccess.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default withStores(observer(AskForAccess))
