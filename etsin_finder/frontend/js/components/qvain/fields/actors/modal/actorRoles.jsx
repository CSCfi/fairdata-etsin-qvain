import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { ROLE } from '../../../../../utils/constants'
import { GroupLabel } from '../common'
import RoleCheckbox from './roleCheckbox'
import { useStores } from '../../../utils/stores'

export const ActorRolesBase = () => {
  const {
    Qvain: {
      Actors: { actorInEdit: actor, otherActorsHaveRole },
    },
  } = useStores()

  return (
    <Fieldset>
      <Translate component={GroupLabel} content="qvain.actors.add.groups.roles" />
      <List>
        <RoleCheckbox role={ROLE.CREATOR} help={'(min 1)'} />
        <RoleCheckbox
          disabled={otherActorsHaveRole(actor, ROLE.PUBLISHER)}
          role={ROLE.PUBLISHER}
          help="(max 1)"
          required
        />
        <RoleCheckbox role={ROLE.CURATOR} />
        <RoleCheckbox role={ROLE.RIGHTS_HOLDER} />
        <RoleCheckbox role={ROLE.CONTRIBUTOR} />
        {actor.roles.includes(ROLE.PROVENANCE) && <RoleCheckbox role={ROLE.PROVENANCE} disabled />}
      </List>
    </Fieldset>
  )
}

export const List = styled.ul`
  padding: 0px;
  margin: 0;
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-auto-flow: row;
`

const Fieldset = styled.fieldset`
  border: none;
`

export default observer(ActorRolesBase)
