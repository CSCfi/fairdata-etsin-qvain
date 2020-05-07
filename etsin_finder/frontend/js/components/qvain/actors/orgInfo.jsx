import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components';
import Translate from 'react-translate-component'
import { Label } from '../general/form'
import ValidationError from '../general/validationError'
import { Organization } from '../../../stores/view/qvain.actors'
import OrgSelector from './orgSelector'
import OrgForm from './orgForm'
import { getOrganizationName } from './common'

const sortOpts = { numeric: true, sensitivity: 'base' }
const sortFunc = (a, b) => a.localeCompare(b, undefined, sortOpts)

const sortOrgArrays = (orgArrays, lang) => {
  // Sorting helper for natural sorting of file/directory names.
  orgArrays.sort((a, b) => {
    const maxlen = Math.max(a.length, b.length)
    for (let i = 0; i < maxlen; i += 1) {
      if (!a[i]) {
        return -1
      }
      if (!b[i]) {
        return 1
      }
      const nameA = getOrganizationName(a[i], lang)
      const nameB = getOrganizationName(b[i], lang)
      const val = sortFunc(nameA, nameB)
      if (val !== 0) {
        return val
      }
    }
    return 0
  })
  return orgArrays
}

export class OrgInfoBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    organizationError: undefined,
    editIndex: -1,
  }

  componentDidMount = () => {
    this.fetchReferences()
  }

  componentDidUpdate() {
    this.fetchReferences()
  }

  fetchReferences = () => {
    const {
      actorInEdit,
      fetchReferenceOrganizations,
      fetchAllDatasetReferenceOrganizations
    } = this.props.Stores.Qvain.Actors

    if (actorInEdit && actorInEdit.organizations) {
      fetchAllDatasetReferenceOrganizations()
      actorInEdit.organizations.forEach(org => fetchReferenceOrganizations(org))
    }
  }

  resetErrorMessages = () => {
    this.setState({
      organizationError: undefined
    })
  }

  handleOnBlur = (validator, value, errorSet) => {
    validator.validate(value).then(() => errorSet(undefined)).catch(err => errorSet(err.errors))
  }

  getOrganization = (index) => {
    const { actorInEdit } = this.props.Stores.Qvain.Actors
    if (index >= actorInEdit.organizations.length) {
      return null
    }
    return actorInEdit.organizations[index]
  }

  setOrganization = (index, org) => {
    const { actorInEdit, setActorOrganizations } = this.props.Stores.Qvain.Actors
    if (actorInEdit.organizations.length <= index || actorInEdit.organizations[index].uiid !== org.uiid) {
      const orgs = [...actorInEdit.organizations]
      orgs.length = index
      orgs.push(JSON.parse(JSON.stringify(org)))
      setActorOrganizations(actorInEdit, orgs)
    }
  }

  setMultipleOrganizations = (index, newOrgs) => {
    const { actorInEdit, setActorOrganizations } = this.props.Stores.Qvain.Actors
    if (actorInEdit.organizations.length >= index) {
      const orgs = [...actorInEdit.organizations]
      orgs.length = index
      orgs.push(...JSON.parse(JSON.stringify(newOrgs)))
      setActorOrganizations(actorInEdit, orgs)
    }
  }

  createOrganization = (index, name) => {
    const { lang } = this.props.Stores.Locale
    const org = Organization({
      name: {
        [lang]: name
      },
      identifier: undefined,
      isReference: false
    })
    this.setOrganization(index, org)
    this.toggleEdit(index)
  }

  updateOrganization = (org, values) => {
    const { updateOrganization } = this.props.Stores.Qvain.Actors
    updateOrganization(org, values)
  }

  removeOrganization = (index) => {
    const { actorInEdit, setActorOrganizations } = this.props.Stores.Qvain.Actors
    const orgs = [...actorInEdit.organizations]
    if (orgs.splice(index).length > 0) {
      setActorOrganizations(actorInEdit, orgs)
    }
    this.toggleEdit(-1)
  }

  getReferences = (index) => {
    const { getReferenceOrganizationsForActor, actorInEdit } = this.props.Stores.Qvain.Actors
    return getReferenceOrganizationsForActor(actorInEdit, index)
  }

  toggleEdit = (index) => {
    if (this.state.editIndex === index) {
      this.setState({ editIndex: -1 })
    } else {
      this.setState({ editIndex: index })
    }
  }

  render() {
    const { Actors: { getDatasetOrganizations, actorInEdit: actor } } = this.props.Stores.Qvain
    const { lang } = this.props.Stores.Locale
    const {
      organizationError
    } = this.state

    let padded = actor.organizations
    if (actor.organizations.length < 3) {
      padded = [...actor.organizations, null]
    }

    return (
      <>
        <Label htmlFor="orgField">
          <Translate content={'qvain.actors.add.organization.label'} />
          {' *'}
        </Label>
        {padded.map((organization, index) => (
          <OrgContainer index={index} key={`${(organization && organization.uiid)}` || `new-${index}`}>
            <OrgSelector
              organization={organization}
              organizations={actor.organizations}
              datasetOrganizations={sortOrgArrays(getDatasetOrganizations(index > 0 ? actor.organizations[index - 1] : null), lang)}
              referenceOrganizations={this.getReferences(index)}
              setOrganization={org => this.setOrganization(index, org)}
              setMultipleOrganizations={newOrgs => this.setMultipleOrganizations(index, newOrgs)}
              createOrganization={name => this.createOrganization(index, name)}
              removeOrganization={() => this.removeOrganization(index)}
              toggleEdit={() => this.toggleEdit(index)}
              level={index}
              key={`${(organization && organization.uiid)}` || `new-${index}`}
            />
            {this.state.editIndex === index && organization && organization.isReference === false && (
              <OrgForm
                organization={organization}
                updateOrganization={(values) => this.updateOrganization(organization, values)}
              />
            )}
          </OrgContainer>
        ))}
        {organizationError && <ValidationError>{organizationError}</ValidationError>}
      </>
    );
  }
}

const OrgContainer = styled.div`
  padding-left: ${(props) => `${props.index * 20}px`};
`

export default inject('Stores')(observer(OrgInfoBase));
