import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react'

import styled from 'styled-components'
import Translate from '@/utils/Translate'
import { Label } from '@/components/qvain/general/modal/form'
import { Organization } from '@/stores/view/qvain/qvain.actors'
import OrgSelector from './orgSelector'
import OrgForm from './orgForm'
import { getOrganizationName } from '../../common'
import { useStores } from '@/stores/stores'

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

export const OrgInfoBase = () => {
  const Stores = useStores()
  const [editIndex, setEditIndex] = useState(-1)
  const { lang } = Stores.Locale
  const {
    actorInEdit,
    setActorOrganizations,
    getDatasetOrganizations,
    updateOrganization,
    getReferenceOrganizationsForActor,
    fetchReferenceOrganizations,
    fetchAllDatasetReferenceOrganizations,
  } = Stores.Qvain.Actors

  useEffect(() => {
    if (actorInEdit?.organizations) {
      fetchAllDatasetReferenceOrganizations()
      actorInEdit.organizations.forEach(org => fetchReferenceOrganizations(org))
    }
  }, [
    actorInEdit,
    actorInEdit.organizations,
    fetchAllDatasetReferenceOrganizations,
    fetchReferenceOrganizations,
  ])

  const setOrganization = (index, org) => {
    if (
      actorInEdit.organizations.length <= index ||
      actorInEdit.organizations[index].uiid !== org.uiid
    ) {
      const orgs = [...actorInEdit.organizations]
      orgs.length = index
      orgs.push(JSON.parse(JSON.stringify(org)))
      setActorOrganizations(actorInEdit, orgs)
    }
  }

  const setMultipleOrganizations = (index, newOrgs) => {
    if (actorInEdit.organizations.length >= index) {
      const orgs = [...actorInEdit.organizations]
      orgs.length = index
      orgs.push(...JSON.parse(JSON.stringify(newOrgs)))
      setActorOrganizations(actorInEdit, orgs)
    }
  }

  const createOrganization = (index, name) => {
    const org = Organization({
      name: {
        [lang]: name,
      },
      identifier: undefined,
      isReference: false,
    })
    setOrganization(index, org)
    toggleEdit(index)
  }

  const removeOrganization = index => {
    const orgs = [...actorInEdit.organizations]
    if (orgs.splice(index).length > 0) {
      setActorOrganizations(actorInEdit, orgs)
    }
    toggleEdit(-1)
  }

  const getReferences = index => getReferenceOrganizationsForActor(actorInEdit, index)

  const toggleEdit = index => {
    if (editIndex === index) {
      setEditIndex(-1)
    } else {
      setEditIndex(index)
    }
  }

  const actor = actorInEdit

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
        <OrgContainer index={index} key={`${organization?.uiid}` || `new-${index}`}>
          <OrgSelector
            organization={organization}
            organizations={actor.organizations}
            datasetOrganizations={sortOrgArrays(
              getDatasetOrganizations(index > 0 ? actor.organizations[index - 1] : null),
              lang
            )}
            referenceOrganizations={getReferences(index)}
            setOrganization={org => setOrganization(index, org)}
            setMultipleOrganizations={newOrgs => setMultipleOrganizations(index, newOrgs)}
            createOrganization={name => createOrganization(index, name)}
            removeOrganization={() => removeOrganization(index)}
            toggleEdit={() => toggleEdit(index)}
            level={index}
            key={`${organization?.uiid}` || `new-${index}`}
          />
          {editIndex === index && organization?.isReference === false && (
            <OrgForm
              organization={organization}
              updateOrganization={values => updateOrganization(organization, values)}
            />
          )}
        </OrgContainer>
      ))}
    </>
  )
}

const countContPadding = props => `${props.index * 20}px`

const OrgContainer = styled.div`
  padding-left: ${countContPadding};
`

export default observer(OrgInfoBase)
