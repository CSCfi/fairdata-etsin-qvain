import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import { Label } from '../../../../general/modal/form'
import { ActorInput, ActorError } from '../../common'
import { useStores } from '../../../../utils/stores'

const PersonInput = ({ propName, schema, includeType, required }) => {
  const {
    Qvain: {
      Actors: { actorInEdit: actor, updateActor },
      readonly,
    },
  } = useStores()
  const [error, setError] = useState()

  const handleOnBlur = () => {
    const validator = schema
    const value = actor.person[propName]
    const onError = err => setError(err)
    validator
      .validate(value)
      .then(() => onError(undefined))
      .catch(err => onError(err.errors))
  }

  const handleUpdateActor = values => {
    const person = { ...actor.person, ...values }
    updateActor(actor, { person })
  }

  const id = `person${propName}Field`

  return (
    <>
      <Label htmlFor={id}>
        <Translate content={`qvain.actors.add.${propName}.label`} /> {required && '*'}
      </Label>
      <Translate
        component={ActorInput}
        type="text"
        id={id}
        attributes={{
          placeholder: includeType
            ? `qvain.actors.add.${propName}.placeholder.${actor.type}`
            : `qvain.actors.add.${propName}.placeholder`,
        }}
        disabled={readonly}
        value={actor.person[propName]}
        onChange={event => handleUpdateActor({ [propName]: event.target.value })}
        onBlur={() => handleOnBlur(propName)}
      />
      {error && <ActorError>{error}</ActorError>}
    </>
  )
}

PersonInput.propTypes = {
  propName: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  includeType: PropTypes.bool,
  required: PropTypes.bool,
}

PersonInput.defaultProps = {
  includeType: false,
  required: false,
}

export default observer(PersonInput)
