import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import { ENTITY_TYPE } from '../../../../../utils/constants'

import PersonInfo from './person/personForm'
import OrgInfo from './org/orgInfo'
import { ModalLabel, FieldGroup } from '@/components/qvain/general/V2'
import { useStores } from '../../../utils/stores'

export const ActorInfoBase = () => {
  const {
    Qvain: {
      Actors: { actorInEdit: actor },
    },
  } = useStores()
  return (
    <FieldGroup>
      <Translate component={ModalLabel} content="qvain.actors.add.groups.info" />
      {actor.type === ENTITY_TYPE.PERSON && <PersonInfo />}
      <OrgInfo />
    </FieldGroup>
  )
}

export default observer(ActorInfoBase)
