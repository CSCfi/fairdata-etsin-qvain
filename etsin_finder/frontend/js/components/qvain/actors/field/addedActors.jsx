import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import ActorItem from './actorItem'
import { useStores } from '../../utils/stores'

export const AddedActorsBase = () => {
  const Stores = useStores()
  const { actors } = Stores.Qvain.Actors

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

export default observer(AddedActorsBase)
