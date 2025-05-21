import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'
import { ROLE } from '../../../../../utils/constants'
import { ModalLabel, FieldGroup } from '@/components/qvain/general/V2'
import RoleCheckbox from './roleCheckbox'
import { useStores } from '../../../utils/stores'

export const ActorRolesBase = () => {
  const {
    Qvain: {
      Actors: { actorInEdit: actor, otherActorsHaveRole },
    },
  } = useStores()

  return (
    <FieldGroup>
      <Translate component={ModalLabel} content="qvain.actors.add.groups.roles" />
      <List>
        <RoleCheckbox role={ROLE.CREATOR} help={'(min. 1)'} required />
        <RoleCheckbox
          disabled={otherActorsHaveRole(actor, ROLE.PUBLISHER)}
          role={ROLE.PUBLISHER}
          help="(max. 1)"
          required
        />
        <RoleCheckbox role={ROLE.CURATOR} />
        <RoleCheckbox role={ROLE.RIGHTS_HOLDER} />
        <RoleCheckbox role={ROLE.CONTRIBUTOR} />
        {actor.roles.includes(ROLE.PROVENANCE) && <RoleCheckbox role={ROLE.PROVENANCE} disabled />}
      </List>
    </FieldGroup>
  )
}

export const List = styled.ul`
  padding: 0px;
  margin: 0;
  line-height: 1;
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-auto-flow: row;
`

export default observer(ActorRolesBase)
