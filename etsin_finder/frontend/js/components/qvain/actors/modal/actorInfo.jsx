import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { ENTITY_TYPE } from '../../../../utils/constants'

import PersonInfo from './org/personForm'
import OrgInfo from './org/orgInfo'
import { GroupLabel } from '../common'

export const ActorInfoBase = ({
  Stores: {
    Qvain: {
      Actors: { actorInEdit: actor },
    },
  },
}) => (
  <>
    <Translate component={GroupLabel} content="qvain.actors.add.groups.info" />
    {actor.type === ENTITY_TYPE.PERSON && <PersonInfo />}
    <OrgInfo />
  </>
)

ActorInfoBase.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(ActorInfoBase))
