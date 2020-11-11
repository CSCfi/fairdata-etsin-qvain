import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { ENTITY_TYPE } from '../../../../../utils/constants'
import { GroupLabel } from '../common'
import ActorRadio from './actorRadio'

export const ActorTypeSelectBase = () => (
  <Fieldset>
    <Translate component={GroupLabel} content="qvain.actors.add.groups.type" />
    <List>
      <ActorRadio role={ENTITY_TYPE.PERSON} />
      <ActorRadio role={ENTITY_TYPE.ORGANIZATION} />
    </List>
  </Fieldset>
)

export const List = styled.ul`
  padding: 0px;
  margin: 0;
  list-style-type: none;
  display: flex;
  margin: -0.5rem;
  width: 100%;
`

const Fieldset = styled.fieldset`
  border: none;
`

export default ActorTypeSelectBase
