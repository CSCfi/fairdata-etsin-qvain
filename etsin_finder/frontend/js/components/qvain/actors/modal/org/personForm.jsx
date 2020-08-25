import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { Label } from '../../../general/form'
import {
  personNameSchema,
  personEmailSchema,
  personIdentifierSchema,
} from '../../../utils/formValidation'
import { ActorInput, ActorError } from '../../common'

export class PersonFormBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    nameError: undefined,
    emailError: undefined,
    identifierError: undefined,
  }

  resetErrorMessages = () => {
    this.setState({
      nameError: undefined,
      emailError: undefined,
      identifierError: undefined,
    })
  }

  handleOnBlur = (validator, value, errorSet) => {
    validator
      .validate(value)
      .then(() => errorSet(undefined))
      .catch(err => errorSet(err.errors))
  }

  handleOnNameBlur = () => {
    const actor = this.props.Stores.Qvain.Actors.actorInEdit
    this.handleOnBlur(personNameSchema, actor.person.name, value =>
      this.setState({ nameError: value })
    )
  }

  handleOnEmailBlur = () => {
    const actor = this.props.Stores.Qvain.Actors.actorInEdit
    this.handleOnBlur(personEmailSchema, actor.person.email, value =>
      this.setState({ emailError: value })
    )
  }

  handleOnIdentifierBlur = () => {
    const actor = this.props.Stores.Qvain.Actors.actorInEdit
    this.handleOnBlur(personIdentifierSchema, actor.person.identifier, value =>
      this.setState({ identifierError: value })
    )
  }

  handleUpdateActor = values => {
    const { actorInEdit, updateActor } = this.props.Stores.Qvain.Actors
    const person = { ...actorInEdit.person, ...values }
    updateActor(actorInEdit, { person })
  }

  render() {
    const {
      Actors: { actorInEdit: actor },
      readonly,
    } = this.props.Stores.Qvain
    const { nameError, emailError, identifierError } = this.state

    return (
      <Fragment>
        <Fields>
          <div>
            <Label htmlFor="personNameField">
              <Translate content="qvain.actors.add.name.label" /> *
            </Label>
            <Translate
              component={ActorInput}
              type="text"
              id="personNameField"
              attributes={{ placeholder: `qvain.actors.add.name.placeholder.${actor.type}` }}
              disabled={readonly}
              value={actor.person.name}
              onChange={event => this.handleUpdateActor({ name: event.target.value })}
              onBlur={this.handleOnNameBlur}
            />
            {nameError && <ActorError>{nameError}</ActorError>}
          </div>
          <div>
            <Label htmlFor="personEmailField">
              <Translate content="qvain.actors.add.email.label" />
            </Label>
            <Translate
              component={ActorInput}
              id="personEmailField"
              type="email"
              attributes={{ placeholder: 'qvain.actors.add.email.placeholder' }}
              onChange={event => this.handleUpdateActor({ email: event.target.value })}
              disabled={readonly}
              value={actor.person.email}
              onBlur={this.handleOnEmailBlur}
            />
            {emailError && <ActorError>{emailError}</ActorError>}
          </div>
        </Fields>
        <Label htmlFor="identifierField">
          <Translate content="qvain.actors.add.identifier.label" />
        </Label>
        <Translate
          id="identifierField"
          component={ActorInput}
          type="text"
          disabled={readonly}
          attributes={{ placeholder: 'qvain.actors.add.identifier.placeholder' }}
          onChange={event => this.handleUpdateActor({ identifier: event.target.value })}
          value={actor.person.identifier}
          onBlur={this.handleOnIdentifierBlur}
        />
        {identifierError && <ActorError>{identifierError}</ActorError>}
      </Fragment>
    )
  }
}

const Fields = styled.div`
  display: grid;
  column-gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`

export default inject('Stores')(observer(PersonFormBase))
