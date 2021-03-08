import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import Card from '../../general/card'
import OrganizationSelect from '../../general/input/organizationSelect'
import {
  ErrorMessages,
  organizationSelectValueToSchema,
  validateSync,
  isEmptyObject,
  organizationToSelectValue,
} from './utils'
import Button from '../../../general/button'
import Label from '../../general/card/label'
import { withStores } from '../../utils/stores'

import { Organization } from '../../../../stores/view/qvain/qvain.project'
import { organizationObjectSchema } from '../../utils/formValidation'

const FundingOrganization = props => {
  /**
   * Put already added organization to form data for organization select.
   */
  const onEdit = async id => {
    const organizationToEdit = props.organizations.addedOrganizations.find(org => org.id === id)
    if (!organizationToEdit) return
    const { lang } = props.Stores.Locale
    const { organization, department, subDepartment } = organizationToEdit
    const departmentValue = await organizationToSelectValue(
      department,
      lang,
      organization ? organization.identifier : null
    )
    const subDepartmentValue = await organizationToSelectValue(
      subDepartment,
      lang,
      department ? department.identifier : null
    )
    props.onChange({
      organization: { ...(await organizationToSelectValue(organization, lang)) },
      department: departmentValue ? { ...departmentValue } : undefined,
      subDepartment: subDepartmentValue ? { ...subDepartmentValue } : undefined,
      id,
    })
  }

  const onOrganizationChange = value => props.onChange({ ...value, errors: [] })

  const onRemove = id => props.onRemoveOrganization(id)

  /**
   * Validate full organization value. That is at least top level organization
   * must be defined. This does not validate subfields, validates only that no
   * empty organizations are added.
   * @param {Object} organizations Full value from organization select
   */
  const validateAll = organizations => {
    const { formData } = props.organizations
    const validationErrors = validateSync(organizationObjectSchema, organizations)

    if (!isEmptyObject(validationErrors)) {
      props.onChange({
        ...formData,
        errors: ['qvain.project.inputs.fundingAgency.contributorType.organization.validation'],
      })
      return false
    }
    return true
  }

  /**
   * Validate organization select values (organization, department, ...). If all are valid
   * create an organization object and call parent on add organization.
   */
  const addOrganization = () => {
    const { formData } = props.organizations
    const organization = organizationSelectValueToSchema(formData.organization)
    const department = organizationSelectValueToSchema(formData.department)
    const subDepartment = organizationSelectValueToSchema(formData.subDepartment)
    if (!validateAll({ organization, department, subDepartment })) return
    const { id } = props.organizations.formData
    const params = [id, organization]
    if (department) params.push(department)
    if (subDepartment) params.push(subDepartment)
    const organizationToAdd = Organization(...params)
    props.onAddOrganization(organizationToAdd)
  }

  const { addedOrganizations, formData } = props.organizations
  const { lang } = props.Stores.Locale
  const { readonly } = props.Stores.Qvain.Projects
  return (
    <Card>
      <h3>
        <Translate
          component="label"
          htmlFor="funding-organization"
          content="qvain.project.organization.title"
        />
      </h3>
      <Translate component="p" content="qvain.project.organization.description" />
      <AddedOrganizations
        organizations={addedOrganizations}
        onRemove={onRemove}
        onEdit={onEdit}
        lang={lang}
        readonly={readonly}
      />
      <OrganizationSelect
        onChange={onOrganizationChange}
        value={formData}
        name="funding-organization"
        inputId="funding-organization"
      />
      <ErrorMessages errors={formData.errors} />
      <AddOrganizationContainer>
        <Button disabled={readonly} onClick={addOrganization}>
          <Translate
            content={
              formData.id
                ? 'qvain.project.inputs.organization.editButton'
                : 'qvain.project.inputs.organization.addButton'
            }
          />
        </Button>
      </AddOrganizationContainer>
    </Card>
  )
}

FundingOrganization.propTypes = {
  Stores: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onAddOrganization: PropTypes.func.isRequired,
  onRemoveOrganization: PropTypes.func.isRequired,
  organizations: PropTypes.object.isRequired, // {addedOrganizations, formData}
}

const AddedOrganizations = ({ organizations = [], onRemove, onEdit, lang, readonly }) =>
  organizations.map(organization => (
    <OrganizationLabel color="#007fad" margin="0 0.5em 0.5em 0" key={organization.id}>
      <PaddedWord onClick={() => onEdit(organization.id)}>
        {organization.organization.name[lang] || organization.organization.name.und}
      </PaddedWord>
      {!readonly && (
        <FontAwesomeIcon onClick={() => onRemove(organization.id)} icon={faTimes} size="xs" />
      )}
    </OrganizationLabel>
  ))

const AddOrganizationContainer = styled.div`
  padding-top: 0.5rem;
`

const PaddedWord = styled.span`
  padding-right: 10px;
`

const OrganizationLabel = styled(Label)`
  cursor: pointer;
`

export default withStores(observer(FundingOrganization))
