import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { ENTITY_TYPE } from '../../../../../utils/constants'

import PersonInfo from './person/personForm'
import OrgInfo from './org/orgInfo'
import { GroupLabel } from '../common'
import { useStores } from '../../../utils/stores'

export const ActorInfoBase = () => {
  const {
    Qvain: {
      Actors: { actorInEdit: actor },
    },
  } = useStores()
  return (
    <>
      <Translate component={GroupLabel} content="qvain.actors.add.groups.info" />
      {actor.type === ENTITY_TYPE.PERSON && <PersonInfo />}
      <OrgInfo />
    </>
  )
}

export default observer(ActorInfoBase)
