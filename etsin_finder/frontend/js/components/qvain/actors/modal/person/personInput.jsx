import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'

import { Label } from '../../../general/form'
import { ActorInput, ActorError } from '../../common'

class PersonInput extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    propName: PropTypes.string.isRequired,
    schema: PropTypes.object.isRequired,
    includeType: PropTypes.bool,
    required: PropTypes.bool,
  }

  static defaultProps = {
    includeType: false,
    required: false,
  }

  state = {
    [`${this.props.propName}Error`]: null,
  }

  handleOnBlur = propName => {
    const actor = this.props.Stores.Qvain.Actors.actorInEdit
    const validator = this.props.schema
    const value = actor.person[propName]
    const onError = err => this.setState({ [`${propName}Error`]: err })
    validator
      .validate(value)
      .then(() => onError(undefined))
      .catch(err => onError(err.errors))
  }

  handleUpdateActor = values => {
    const { actorInEdit, updateActor } = this.props.Stores.Qvain.Actors
    const person = { ...actorInEdit.person, ...values }
    updateActor(actorInEdit, { person })
  }

  render() {
    const {
      readonly,
      Actors: { actorInEdit: actor },
    } = this.props.Stores.Qvain
    const { propName, includeType, required } = this.props
    const { [`${this.props.propName}Error`]: error } = this.state
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
          onChange={event => this.handleUpdateActor({ [propName]: event.target.value })}
          onBlur={() => this.handleOnBlur(propName)}
        />
        {error && <ActorError>{error}</ActorError>}
      </>
    )
  }
}

export default inject('Stores')(observer(PersonInput))
