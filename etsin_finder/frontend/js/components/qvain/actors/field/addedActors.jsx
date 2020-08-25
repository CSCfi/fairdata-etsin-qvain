import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'

import ActorItem from './actorItem'

export class AddedActorsBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  render() {
    const { actors } = this.props.Stores.Qvain.Actors

    const description = (
      <>
        <Translate component="p" content="qvain.actors.add.help" />
        {actors.length === 0 && (
          <Translate tabIndex="0" component="p" content="qvain.actors.added.noneAddedNotice" />
        )}
      </>
    )

    const ActorList = actors.map(actor => <ActorItem key={actor.uiid} actor={actor} />)

    return (
      <>
        {description}
        {ActorList}
      </>
    )
  }
}

export default inject('Stores')(observer(AddedActorsBase))
