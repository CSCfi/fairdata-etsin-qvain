import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import { ENTITY_TYPE } from '../../../utils/constants'

import PersonInfo from './personForm'
import OrgInfo from './orgInfo'
import { GroupLabel } from './common'

export const ActorInfoBase = (props) => {
  const {
    Actors: { actorInEdit: actor },
  } = props.Stores.Qvain
  return (
    <>
      <Translate component={GroupLabel} content="qvain.actors.add.groups.info" />
      {actor.type === ENTITY_TYPE.PERSON && <PersonInfo />}
      <OrgInfo />
    </>
  )
}

ActorInfoBase.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(ActorInfoBase))
