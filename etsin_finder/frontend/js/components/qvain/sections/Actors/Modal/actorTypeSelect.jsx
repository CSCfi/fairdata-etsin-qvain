import styled from 'styled-components'
import Translate from '@/utils/Translate'
import { ENTITY_TYPE } from '@/utils/constants'
import { ModalLabel, FieldGroup } from '@/components/qvain/general/V2'
import ActorRadio from './actorRadio'

export const ActorTypeSelectBase = () => (
  <FieldGroup>
    <Translate component={ModalLabel} content="qvain.actors.add.groups.type" />
    <List>
      <ActorRadio role={ENTITY_TYPE.PERSON} />
      <ActorRadio role={ENTITY_TYPE.ORGANIZATION} />
    </List>
  </FieldGroup>
)

export const List = styled.ul`
  padding: 0px;
  margin: 0;
  list-style-type: none;
  display: flex;
  margin-top: -0.5rem;
  margin-left: -0.5rem;
  width: 100%;
`

export default ActorTypeSelectBase
