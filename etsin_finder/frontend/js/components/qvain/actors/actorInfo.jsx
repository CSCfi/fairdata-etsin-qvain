import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import axios from 'axios';
import styled from 'styled-components';
import Translate from 'react-translate-component'
import { createFilter } from 'react-select'
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
import { EntityType } from '../utils/constants'
import { EmptyActor } from '../../../stores/view/qvain'
import { deepCopy } from '../utils/fileHierarchy'
import {
  actorSchema,
  actorNameSchema,
  actorEmailSchema,
  actorIdentifierSchema,
  actorOrganizationSchema
} from '../utils/formValidation'

export class ActorInfoBase extends Component {
  promises = []

  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    orgs: [],
    orgsLang: [],
    nameError: undefined,
    emailError: undefined,
    actorError: undefined,
    identifierError: undefined,
    organizationError: undefined
  }

  componentDidMount = () => {
    this.promises.push(axios.get('https://metax.fairdata.fi/es/organization_data/organization/_search?size=3000')
      .then(res => {
        const { lang } = this.props.Stores.Locale
        const list = res.data.hits.hits;
        const refs = list.map(ref => (
          {
            value: ref._source.code,
            label: ref._source.label,
          }
        ))
        this.setState({ orgs: refs })
        this.setState({ orgsLang: this.getOrgOptionsWithLang(refs, lang) })
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
      })
    );
  }

  componentWillUnmount() {
    this.promises.forEach(promise => promise && promise.cancel && promise.cancel())
  }

  resetErrorMessages = () => {
    this.setState({
      nameError: undefined,
      emailError: undefined,
      actorError: undefined,
      identifierError: undefined,
      organizationError: undefined
    })
  }

  handleSaveActor = (event) => {
    event.preventDefault()
    const { Qvain } = this.props.Stores
    const actor = toJS(Qvain.actorInEdit)
    actorSchema.validate(actor).then(() => {
      Qvain.saveActor(deepCopy(toJS(Qvain.actorInEdit)))
      Qvain.editActor(EmptyActor)
      this.resetErrorMessages()
    }).catch(err => {
      this.setState({ actorError: err.errors })
    })
  }

  handleCancel = (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.editActor(EmptyActor)
    this.resetErrorMessages()
  }

  handleOnBlur = (validator, value, errorSet) => {
    validator.validate(value).then(() => errorSet(undefined)).catch(err => errorSet(err.errors))
  }

  handleOnNameBlur = () => {
    const actor = this.props.Stores.Qvain.actorInEdit
    this.handleOnBlur(actorNameSchema, actor.name, value => this.setState({ nameError: value }))
  }

  handleOnEmailBlur = () => {
    const actor = this.props.Stores.Qvain.actorInEdit
    this.handleOnBlur(actorEmailSchema, actor.email, value => this.setState({ emailError: value }))
  }

  handleOnIdentifierBlur = () => {
    const actor = this.props.Stores.Qvain.actorInEdit
    this.handleOnBlur(actorIdentifierSchema, actor.identifier, value => this.setState({ identifierError: value }))
  }

  handleOnOrganizationBlur = () => {
    const { type, organization } = this.props.Stores.Qvain.actorInEdit
    this.handleOnBlur(
      actorOrganizationSchema,
      { type, organization },
      value => this.setState({ organizationError: value })
    )
  }

  getOrgOptionsWithLang = (orgs, lang) => {
    // From the reference data parse the values with the current lang
    // or und.
    const organizations = orgs.map(org => {
      const orgWithLang = {
        label: org.label[lang] ? org.label[lang] : org.label.und,
        value: org.value
      }
      return orgWithLang
    })
    return organizations
  }

  getOrganizationName = (org, lang) => {
    // Check if org is object. If object then it comes from edit and the
    // values can be uncertain.
    // If the org object contains the current language, return that.
    // If not but contains 'und' language, return that.
    // Else find any language it contains and return that.
    if (typeof org === 'object' && org !== null) {
      if (lang in org) {
        return org[lang]
      }
      if ('und' in org) {
        return org.und
      }
      const langX = Object.keys(org)[0]
      return org[langX]
    }
    return org
  }

  render() {
    const { actorInEdit: actor, readonly } = this.props.Stores.Qvain
    const { lang } = this.props.Stores.Locale
    const {
      orgs,
      orgsLang,
      nameError,
      emailError,
      actorError,
      identifierError,
      organizationError
    } = this.state
    return (
      <Fragment>
        <Label htmlFor="nameField">
          <Translate content="qvain.actors.add.name.label" /> *
        </Label>
        {actor.type === EntityType.PERSON
          ? (
            <Translate
              component={Input}
              type="text"
              id="nameField"
              attributes={{ placeholder: `qvain.actors.add.name.placeholder.${actor.type}` }}
              disabled={readonly}
              value={actor.name}
              onChange={(event) => { actor.name = event.target.value }}
              onBlur={this.handleOnNameBlur}
            />
          )
          : (
            <Translate
              component={SelectOrg}
              name="nameField"
              isDisabled={readonly}
              options={orgsLang}
              inputId="nameField"
              formatCreateLabel={inputValue => (
                <Fragment>
                  <Translate content="qvain.actors.add.newOrganization.label" />
                  <span>: &rsquo;{inputValue}&rsquo;</span>
                </Fragment>
              )}
              attributes={{ placeholder: 'qvain.actors.add.organization.placeholder' }}
              onChange={(selection) => {
                actor.name = orgs.find(org => org.value === selection.value)
                  ? orgs.find(org => org.value === selection.value).label
                  : {
                    [lang]: selection.label,
                    und: selection.label
                  }
                // if selection value ie the org identifier is not in the reference data, then we are adding a new org, so do not define
                // identifier
                if (orgs.filter(opt => opt.value === selection.value).length > 0) {
                  actor.identifier = selection.value
                } else {
                  actor.identifier = ''
                }
              }}
              value={{
                label: this.getOrganizationName(actor.name, lang),
                value: actor.identifier
              }}
              onBlur={this.handleOnNameBlur}
            />
          )}
        {nameError && <ValidationError>{nameError}</ValidationError>}
        <Label htmlFor="emailField">
          <Translate content="qvain.actors.add.email.label" />
        </Label>
        <Translate
          component={Input}
          id="emailField"
          type="email"
          attributes={{ placeholder: 'qvain.actors.add.email.placeholder' }}
          onChange={(event) => { actor.email = event.target.value }}
          disabled={readonly}
          value={actor.email}
          onBlur={this.handleOnEmailBlur}
        />
        {emailError && <ValidationError>{emailError}</ValidationError>}
        <Label htmlFor="identifierField">
          <Translate content="qvain.actors.add.identifier.label" />
        </Label>
        <Translate
          id="identifierField"
          component={Input}
          type="text"
          disabled={orgsLang.find(opt => opt.value === actor.identifier) || readonly}
          attributes={{ placeholder: 'qvain.actors.add.identifier.placeholder' }}
          onChange={(event) => { actor.identifier = event.target.value }}
          value={actor.identifier}
          onBlur={this.handleOnIdentifierBlur}
        />
        {identifierError && <ValidationError>{identifierError}</ValidationError>}
        <Label htmlFor="orgField">
          <Translate content={`qvain.actors.add.organization.label.${actor.type.toLowerCase()}`} />
          {actor.type === EntityType.PERSON && ' *'}
        </Label>
        <Translate
          component={SelectOrg}
          name="orgField"
          isDisabled={readonly}
          options={orgsLang}
          inputId="orgField"
          formatCreateLabel={inputValue => (
            <Fragment>
              <Translate content="qvain.actors.add.newOrganization.label" />
              <span>: &rsquo;{inputValue}&rsquo;</span>
            </Fragment>
          )}
          attributes={{ placeholder: 'qvain.actors.add.organization.placeholder' }}
          onChange={(selection) => {
            actor.organization = orgs.find(org => org.value === selection.value)
              ? orgs.find(org => org.value === selection.value).label
              : {
                [lang]: selection.label,
                und: selection.label
              }
          }}
          onBlur={this.handleOnOrganizationBlur}
          value={{
            label: this.getOrganizationName(actor.organization, lang),
            value: this.getOrganizationName(actor.organization, lang)
          }}
          filterOption={createFilter({ ignoreAccents: false })}
        />
        {organizationError && <ValidationError>{organizationError}</ValidationError>}
        {actorError && <ActorValidationError>{actorError}</ActorValidationError>}
        <Translate
          disabled={readonly}
          component={CancelButton}
          onClick={this.handleCancel}
          content="qvain.actors.add.cancel.label"
        />
        <Translate
          disabled={readonly}
          component={SaveButton}
          onClick={this.handleSaveActor}
          content="qvain.actors.add.save.label"
        />
      </Fragment>
    );
  }
}

const ActorValidationError = styled(ValidationError)`
  margin-top: 40px;
  margin-bottom: 40px;
`;

const SelectOrg = styled(CreatableSelect)`
  margin-bottom: 20px;
`

export default inject('Stores')(observer(ActorInfoBase));
