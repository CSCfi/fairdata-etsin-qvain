import { useState } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import Translate from '@/utils/Translate'
import { Label } from '@/components/qvain/general/modal/form'
import { ActorInput, ActorError } from '../../common'
import { useStores } from '@/stores/stores'
import { InfoText, FieldGroup, Required } from '@/components/qvain/general/V2'

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
      .validate(value, { strict: true })
      .then(() => onError(undefined))
      .catch(err => onError(err.errors))
  }

  const handleUpdateActor = values => {
    const person = { ...actor.person, ...values }
    updateActor(actor, { person })
  }

  const id = `person${propName}Field`

  return (
    <FieldGroup>
      <Label htmlFor={id}>
        <Translate content={`qvain.actors.add.${propName}.label`} />
        {required && <Required>*</Required>}
      </Label>
      <Translate
        component={ActorInput}
        type="text"
        id={id}
        disabled={readonly}
        value={actor.person[propName]}
        onChange={event => handleUpdateActor({ [propName]: event.target.value })}
        onBlur={handleOnBlur}
      />
      <Translate
        weight={2}
        component={InfoText}
        content={
          includeType
            ? `qvain.actors.add.${propName}.infoText.${actor.type.toLowerCase()}`
            : `qvain.actors.add.${propName}.infoText`
        }
      />
      {error && <ActorError>{error}</ActorError>}
    </FieldGroup>
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
