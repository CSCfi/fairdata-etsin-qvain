import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import axios from 'axios';
import styled from 'styled-components';
import Translate from 'react-translate-component'
import CreatableSelect from 'react-select/lib/Creatable'
import {
  SaveButton,
  CancelButton
} from '../general/buttons'
import {
  Input,
  Label,
} from '../general/form'
import ValidationError from '../general/validationError'
import { EntityType, EmptyParticipant } from '../../../stores/view/qvain'
import { deepCopy } from '../utils/fileHierarchy'
import {
  participantSchema,
  participantNameSchema,
  participantEmailSchema,
  participantIdentifierSchema,
  participantOrganizationSchema
} from '../utils/formValidation'

export class ParticipantInfoBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    orgs: {
      en: [],
      fi: []
    },
    nameError: undefined,
    emailError: undefined,
    participantError: undefined,
    identifierError: undefined,
    organizationError: undefined
  }

  componentDidMount = () => {
    axios.get('https://metax.fairdata.fi/es/organization_data/organization/_search?size=1000')
      .then(res => {
        const list = res.data.hits.hits;
        const refsEn = list.map(ref => (
          {
            value: ref._source.code,
            label: ref._source.label.und,
          }
          ))
        const refsFi = list.map(ref => (
          {
            value: ref._source.code,
            label: ref._source.label.fi,
          }
          ))
        this.setState({
          orgs: {
            en: refsEn,
            fi: refsFi
          }
        })
      })
      .catch(error => {
        if (error.response) {
          // Error response from Metax
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // No response from Metax
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  }

  resetErrorMessages = () => {
    this.setState({
      nameError: undefined,
      emailError: undefined,
      participantError: undefined,
      identifierError: undefined,
      organizationError: undefined
    })
  }

  handleSave = (event) => {
    event.preventDefault()
    const { Qvain } = this.props.Stores
    const participant = toJS(Qvain.participantInEdit)
    participantSchema.validate(participant).then(() => {
      Qvain.addParticipant(deepCopy(toJS(Qvain.participantInEdit)))
      Qvain.editParticipant(EmptyParticipant)
      this.resetErrorMessages()
    }).catch(err => {
      this.setState({ participantError: err.errors })
    })
  }

  handleCancel = (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.editParticipant(EmptyParticipant)
  }

  handleOnBlur = (validator, value, errorSet) => {
    validator.validate(value).then(() => errorSet(undefined)).catch(err => errorSet(err.errors))
  }

  handleOnNameBlur = () => {
    const participant = this.props.Stores.Qvain.participantInEdit
    this.handleOnBlur(participantNameSchema, participant.name, value => this.setState({ nameError: value }))
  }

  handleOnEmailBlur = () => {
    const participant = this.props.Stores.Qvain.participantInEdit
    this.handleOnBlur(participantEmailSchema, participant.email, value => this.setState({ emailError: value }))
  }

  handleOnIdentifierBlur = () => {
    const participant = this.props.Stores.Qvain.participantInEdit
    this.handleOnBlur(participantIdentifierSchema, participant.identifier, value => this.setState({ identifierError: value }))
  }

  handleOnOrganizationBlur = () => {
    const { type, organization } = this.props.Stores.Qvain.participantInEdit
    this.handleOnBlur(
      participantOrganizationSchema,
      { type, organization },
      value => this.setState({ organizationError: value })
    )
  }

  render() {
    const participant = this.props.Stores.Qvain.participantInEdit
    const { lang } = this.props.Stores.Locale
    const {
      orgs,
      nameError,
      emailError,
      participantError,
      identifierError,
      organizationError
    } = this.state
    return (
      <Fragment>
        <Label htmlFor="nameField">
          <Translate content="qvain.participants.add.name.label" /> *
        </Label>
        {participant.type === EntityType.PERSON
          ? (
            <Translate
              component={Input}
              type="text"
              id="nameField"
              attributes={{ placeholder: `qvain.participants.add.name.placeholder.${participant.type}` }}
              value={participant.name}
              onChange={(event) => { participant.name = event.target.value }}
              onBlur={this.handleOnNameBlur}
            />
          )
          : (
            <Translate
              component={SelectOrg}
              name="nameField"
              id="nameField"
              options={orgs[lang]}
              formatCreateLabel={inputValue => (
                <Fragment>
                  <Translate content="qvain.participants.add.newOrganization.label" />
                  <span>: &rsquo;{inputValue}&rsquo;</span>
                </Fragment>
              )}
              attributes={{ placeholder: 'qvain.participants.add.organization.placeholder' }}
              onChange={(selection) => {
                participant.name = selection.label
                // if selection value ie the org identifier is not in the reference data, then we are adding a new org, so do not define
                // identifier
                if (orgs[lang].filter(opt => opt.value === selection.value).length > 0) {
                  participant.identifier = selection.value
                  participant.name = selection.label
                }
              }}
              value={{ label: participant.name, value: participant.identifier }}
              onBlur={this.handleOnNameBlur}
            />
            )}
        {nameError && <ValidationError>{nameError}</ValidationError>}
        <Label htmlFor="emailField">
          <Translate content="qvain.participants.add.email.label" />
        </Label>
        <Translate
          component={Input}
          id="emailField"
          type="email"
          attributes={{ placeholder: 'qvain.participants.add.email.placeholder' }}
          onChange={(event) => { participant.email = event.target.value }}
          value={participant.email}
          onBlur={this.handleOnEmailBlur}
        />
        {emailError && <ValidationError>{emailError}</ValidationError>}
        <Label htmlFor="identifierField">
          <Translate content="qvain.participants.add.identifier.label" />
        </Label>
        <Translate
          id="identifierField"
          component={Input}
          type="text"
          disabled={orgs[lang].find(opt => opt.value === participant.identifier)}
          attributes={{ placeholder: 'qvain.participants.add.identifier.placeholder' }}
          onChange={(event) => { participant.identifier = event.target.value }}
          value={participant.identifier}
          onBlur={this.handleOnIdentifierBlur}
        />
        {identifierError && <ValidationError>{identifierError}</ValidationError>}
        <Label htmlFor="orgField">
          <Translate content={`qvain.participants.add.organization.label.${participant.type.toLowerCase()}`} />
          {participant.type === EntityType.PERSON && ' *'}
        </Label>
        <Translate
          component={SelectOrg}
          name="orgField"
          id="orgField"
          options={orgs[lang]}
          formatCreateLabel={inputValue => (
            <Fragment>
              <Translate content="qvain.participants.add.newOrganization.label" />
              <span>: &rsquo;{inputValue}&rsquo;</span>
            </Fragment>
          )}
          attributes={{ placeholder: 'qvain.participants.add.organization.placeholder' }}
          onChange={(selection) => { participant.organization = selection.label }}
          onBlur={this.handleOnOrganizationBlur}
          value={{ label: participant.organization, value: participant.organization }}
        />
        {organizationError && <ValidationError>{organizationError}</ValidationError>}
        {participantError && <ParticipantValidationError>{participantError}</ParticipantValidationError>}
        <Translate
          component={CancelButton}
          onClick={this.handleCancel}
          content="qvain.participants.add.cancel.label"
        />
        <Translate
          component={SaveButton}
          onClick={this.handleSave}
          content="qvain.participants.add.save.label"
        />
      </Fragment>
    );
  }
}

const ParticipantValidationError = styled(ValidationError)`
  margin-top: 40px;
  margin-bottom: 40px;
`;

const SelectOrg = styled(CreatableSelect)`
  margin-bottom: 20px;
`

export default inject('Stores')(observer(ParticipantInfoBase));
