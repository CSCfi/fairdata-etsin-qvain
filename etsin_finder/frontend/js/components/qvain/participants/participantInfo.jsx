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
import { EntityType, EmptyParticipant } from '../../../stores/view/qvain'
import { deepCopy } from '../utils/fileHierarchy'

export class ParticipantInfoBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    organizationsEn: [{ value: '', label: '' }],
    organizationsFi: [{ value: '', label: '' }]
  }

  componentDidMount = () => {
    axios.get('https://metax.fairdata.fi/es/organization_data/organization/_search?size=1000')
      .then(res => {
        const list = res.data.hits.hits;
        const refsEn = list.map(ref => (
          {
            value: ref._source.label.und,
            label: ref._source.label.und,
          }
          ))
        const refsFi = list.map(ref => (
          {
            value: ref._source.label.und,
            label: ref._source.label.fi,
          }
          ))
        this.setState({ organizationsEn: refsEn })
        this.setState({ organizationsFi: refsFi })
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

  handleSave = (event) => {
    event.preventDefault()
    const { Qvain } = this.props.Stores
    Qvain.addParticipant(deepCopy(toJS(Qvain.participantInEdit)))
    Qvain.editParticipant(EmptyParticipant)
  }

  handleCancel = (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.editParticipant(EmptyParticipant)
  }

  render() {
    const participant = this.props.Stores.Qvain.participantInEdit
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
              // placeholder={participant.type === EntityType.PERSON ? 'First And Last Name' : 'Name'}
              value={participant.name}
              onChange={(event) => { participant.name = event.target.value }}
            />
          )
          : (
            <Translate
              component={SelectOrg}
              name="nameField"
              id="nameField"
              options={
                this.props.Stores.Locale.lang === 'en'
                ? this.state.organizationsEn
                : this.state.organizationsFi
              }
              formatCreateLabel={inputValue => (
                <Fragment>
                  <Translate content="qvain.participants.add.newOrganization.label" />
                  <span>: &rsquo;{inputValue}&rsquo;</span>
                </Fragment>
              )}
              attributes={{ placeholder: 'qvain.participants.add.organization.placeholder' }}
              onChange={(selection) => { participant.organization = selection.label }}
              value={{ label: participant.name, value: participant.name }}
            />
            )}

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
        />
        <Label htmlFor="identifierField">
          <Translate content="qvain.participants.add.identifier.label" />
        </Label>
        <Translate
          id="identifierField"
          component={Input}
          type="text"
          attributes={{ placeholder: 'qvain.participants.add.identifier.placeholder' }}
          onChange={(event) => { participant.identifier = event.target.value }}
          value={participant.identifier}
        />
        <Label htmlFor="orgField">
          <Translate content={`qvain.participants.add.organization.label.${participant.type.toLowerCase()}`} />
          {participant.type === EntityType.PERSON && ' *'}
        </Label>
        <Translate
          component={SelectOrg}
          name="orgField"
          id="orgField"
          options={
            this.props.Stores.Locale.lang === 'en'
            ? this.state.organizationsEn
            : this.state.organizationsFi
          }
          formatCreateLabel={inputValue => (
            <Fragment>
              <Translate content="qvain.participants.add.newOrganization.label" />
              <span>: &rsquo;{inputValue}&rsquo;</span>
            </Fragment>
          )}
          attributes={{ placeholder: 'qvain.participants.add.organization.placeholder' }}
          onChange={(selection) => { participant.organization = selection.label }}
          value={{ label: participant.organization, value: participant.organization }}
        />
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

const SelectOrg = styled(CreatableSelect)`
  margin-bottom: 20px;
`

export default inject('Stores')(observer(ParticipantInfoBase));
