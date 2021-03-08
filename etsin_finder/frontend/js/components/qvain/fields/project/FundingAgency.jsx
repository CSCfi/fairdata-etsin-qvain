import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import ReactSelect from 'react-select'

import Card from '../../general/card'
import OrganizationSelect from '../../general/input/organizationSelect'
import Button from '../../../general/button'
import Label from '../../general/card/label'
import {
  ErrorMessages,
  organizationSelectValueToSchema,
  validateSync,
  validate,
  isEmptyObject,
  organizationToSelectValue,
  Expand,
  resolveOptions,
} from './utils'
import { withStores } from '../../utils/stores'
import { LabelLarge, Input } from '../../general/modal/form'
import { fundingAgencySchema, organizationObjectSchema } from '../../utils/formValidation'
import {
  FundingAgency,
  ContributorType,
  Organization,
} from '../../../../stores/view/qvain/qvain.project'

const FundingAgencyForm = props => {
  const onOrganizationChange = value => {
    const { formData } = props.value
    props.onChange({ ...formData, organization: value, errors: [] })
  }

  const onContributorTypeChange = contributorTypeForm => {
    const { formData } = props.value
    props.onChange({ ...formData, contributorTypeForm })
  }

  /**
   * Add contributor type to value.
   * Expects the contributor type to be validated and valid.
   */
  const onAddContributorType = () => {
    const { formData } = props.value
    const {
      id,
      identifier,
      definitionEn,
      definitionFi,
      label,
      inScheme,
    } = formData.contributorTypeForm
    const definition = { en: definitionEn, fi: definitionFi }
    const contributorType = ContributorType(id, identifier.value, label, definition, inScheme)
    const contributorTypes = formData.contributorTypes
      .filter(type => type.id !== id)
      .concat([contributorType])
    props.onChange({
      ...formData,
      contributorTypeForm: { errors: {} },
      contributorTypes,
    })
  }

  const onRemoveContributorType = id => {
    const { formData } = props.value
    const contributorTypes = formData.contributorTypes.filter(type => type.id !== id)
    props.onChange({ ...formData, contributorTypeForm: { errors: {} }, contributorTypes })
  }

  /**
   * Convert organization to select value for organization select
   * and call onChnage from props to update form.
   */
  const onEdit = async id => {
    const { addedFundingAgencies } = props.value
    const { lang } = props.Stores.Locale
    const agencyToEdit = addedFundingAgencies.find(agency => agency.id === id)
    if (!agencyToEdit) return
    const { organization, contributorTypes } = agencyToEdit
    const department = await organizationToSelectValue(
      organization.department,
      lang,
      organization.organization ? organization.organization.identifier : null,
      lang
    )
    const subDepartment = await organizationToSelectValue(
      organization.subDepartment,
      lang,
      organization.department ? organization.department.identifier : null,
      lang
    )
    props.onChange({
      id,
      organization: {
        organization: await organizationToSelectValue(organization.organization, lang),
        department,
        subDepartment,
      },
      errors: {},
      contributorTypeForm: { errors: {} },
      contributorTypes,
    })
  }

  /**
   * Validate full organization value. That is at least top level organization
   * must be defined. This does not validate subfields, validates only that no
   * empty organizations are added.
   */
  const validateAll = organizations => {
    const { formData } = props.value
    const { errors } = formData
    const validationErrors = validateSync(organizationObjectSchema, organizations)
    if (!isEmptyObject(validationErrors)) {
      props.onChange({
        ...formData,
        errors: {
          ...errors,
          organization: [
            'qvain.project.inputs.fundingAgency.contributorType.organization.validation',
          ],
        },
      })
      return false
    }
    return true
  }

  /**
   * Construct a funding agency object and pass it to the parent on add handler.
   * This expects added contributor types to be valid. Only the organization
   * is validated here.
   */
  const onAddAgency = () => {
    const { formData } = props.value
    const { id, contributorTypes } = formData
    const organization = organizationSelectValueToSchema(formData.organization.organization)
    const department = organizationSelectValueToSchema(formData.organization.department)
    const subDepartment = organizationSelectValueToSchema(formData.organization.subDepartment)
    if (!validateAll({ organization, department, subDepartment })) return

    const organizationObject = Organization(null, organization, department, subDepartment)
    const agency = FundingAgency(id, organizationObject, contributorTypes)
    props.onAdd(agency)
  }

  const { onRemove, value } = props
  const { formData, addedFundingAgencies } = value
  const { readonly } = props.Stores.Qvain.Projects
  const { lang } = props.Stores.Locale

  return (
    <Card>
      <AddedAgencies
        agencies={addedFundingAgencies}
        onEdit={onEdit}
        onRemove={onRemove}
        lang={lang}
      />
      <LabelLarge htmlFor="project-funding-organization">
        <Translate content="qvain.project.inputs.fundingAgency.contributorType.organization.label" />{' '}
        *
      </LabelLarge>
      <OrganizationSelect
        onChange={onOrganizationChange}
        value={formData.organization}
        name="organization"
        inputId="project-funding-organization"
      />
      <ErrorMessages errors={formData.errors.organization} />
      <Expand
        title={(
          <Translate
            component="h3"
            content="qvain.project.inputs.fundingAgency.contributorType.title"
          />
        )}
      >
        <ContributorTypeForm
          formData={formData.contributorTypeForm}
          contributorTypes={formData.contributorTypes}
          onChange={onContributorTypeChange}
          onAdd={onAddContributorType}
          onRemove={onRemoveContributorType}
          readonly={readonly}
        />
      </Expand>
      <AddAgencyContainer>
        <Button onClick={onAddAgency} disabled={readonly}>
          <Translate
            content={
              formData.id
                ? 'qvain.project.inputs.fundingAgency.editButton'
                : 'qvain.project.inputs.fundingAgency.addButton'
            }
          />
        </Button>
      </AddAgencyContainer>
    </Card>
  )
}

FundingAgencyForm.propTypes = {
  Stores: PropTypes.object.isRequired,
  value: PropTypes.object.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

const AddedAgencies = ({ agencies, onRemove, onEdit, lang }) => (
  <div>
    {agencies.map(agency => (
      <AgencyLabel color="#007fad" margin="0 0.5em 0.5em 0" key={agency.id}>
        <PaddedWord onClick={() => onEdit(agency.id)}>
          {agency.organization.organization.name[lang] || agency.organization.organization.name.und}
        </PaddedWord>
        <FontAwesomeIcon onClick={() => onRemove(agency.id)} icon={faTimes} size="xs" />
      </AgencyLabel>
    ))}
  </div>
)

AddedAgencies.propTypes = {
  agencies: PropTypes.array,
  onRemove: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
}

AddedAgencies.defaultProps = {
  agencies: [],
}

/**
 * Form to add contributor types. This is a subfield of funding agency field.
 */
class ContributorTypeFormComponent extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    contributorTypes: PropTypes.array.isRequired,
    readonly: PropTypes.bool,
  }

  static defaultProps = {
    readonly: false,
  }

  state = {
    loading: true,
    options: {},
  }

  componentDidMount() {
    this.fetchOptions()
  }

  /**
   * Fetch options for role field.
   */
  fetchOptions = async () => {
    const options = await resolveOptions('contributor_type')
    this.setState({ options, loading: false })
  }

  /** Validate form */
  onBlur = async () => {
    const { formData, onChange } = this.props
    const errors = await validate(fundingAgencySchema, { ...formData })
    onChange({ ...formData, errors })
  }

  onFieldChange = event => {
    const { formData, onChange } = this.props
    const { name, value } = event.target
    onChange({ ...formData, [name]: value })
  }

  /** Map form properties from select value to form data. */
  onSelectChange = selectValue => {
    const { value, label, name, inScheme } = selectValue
    const { formData, onChange } = this.props
    onChange({
      ...formData,
      identifier: { value, label },
      label: name,
      inScheme,
    })
  }

  onAddType = async () => {
    const { formData, onChange, onAdd } = this.props
    const identifier = formData.identifier ? formData.identifier.value : null
    const errors = await validate(fundingAgencySchema, { ...formData, identifier })
    if (!isEmptyObject(errors)) onChange({ ...formData, errors })
    else onAdd()
  }

  onEditType = id => {
    const { contributorTypes, onChange } = this.props
    const { lang } = this.props.Stores.Locale

    const contributorTypeToEdit = contributorTypes.find(
      contributorType => contributorType.id === id
    )
    if (!contributorTypeToEdit) return
    const { definition, label, inScheme } = contributorTypeToEdit
    // Find correct select value based on contributor type identifier
    const identifier = this.state.options[lang].find(
      option => option.value === contributorTypeToEdit.identifier
    )
    onChange({
      id,
      identifier: { label: identifier.label, value: identifier.value },
      label,
      inScheme,
      definitionEn: definition ? definition.en : '',
      definitionFi: definition ? definition.fi : '',
      errors: {},
    })
  }

  render() {
    const { options, loading } = this.state
    if (loading) return null

    const { contributorTypes, onRemove, readonly, formData } = this.props
    const { lang } = this.props.Stores.Locale

    return (
      <Card>
        <Translate
          component="p"
          content="qvain.project.inputs.fundingAgency.contributorType.description"
        />
        <AddedContributorTypes
          contributorTypes={contributorTypes}
          onEdit={this.onEditType}
          onRemove={onRemove}
          lang={lang}
        />
        <LabelLarge htmlFor="identifier">
          <Translate content="qvain.project.inputs.fundingAgency.contributorType.identifier.label" />{' '}
          *
        </LabelLarge>
        <Translate
          component={StyledSelect}
          name="identifier"
          inputId="identifier"
          isDisabled={readonly}
          onChange={this.onSelectChange}
          onBlur={this.onBlur}
          value={formData.identifier === undefined ? null : formData.identifier}
          className="basic-single"
          classNamePrefix="select"
          options={options[lang]}
        />
        <ErrorMessages errors={formData.errors.identifier} />
        <LabelLarge htmlFor="definitionEn">
          <Translate content="qvain.project.inputs.fundingAgency.contributorType.definition.label" />
        </LabelLarge>
        <Translate
          component="p"
          content="qvain.project.inputs.fundingAgency.contributorType.definition.description"
        />
        <Translate
          component={Input}
          value={formData.definitionEn || ''}
          onChange={this.onFieldChange}
          onBlur={this.onBlur}
          attributes={{
            placeholder:
              'qvain.project.inputs.fundingAgency.contributorType.definition.placeholderEn',
          }}
          disabled={readonly}
          name="definitionEn"
          id="definitionEn"
        />
        <Translate
          component={Input}
          value={formData.definitionFi || ''}
          onChange={this.onFieldChange}
          onBlur={this.onBlur}
          attributes={{
            placeholder:
              'qvain.project.inputs.fundingAgency.contributorType.definition.placeholderFi',
          }}
          disabled={readonly}
          name="definitionFi"
          id="definitionFi"
        />
        <AddAgencyContainer>
          <Button onClick={this.onAddType} disabled={readonly}>
            <Translate
              content={
                formData.id
                  ? 'qvain.project.inputs.fundingAgency.contributorType.editButton'
                  : 'qvain.project.inputs.fundingAgency.contributorType.addButton'
              }
            />
          </Button>
        </AddAgencyContainer>
      </Card>
    )
  }
}

const ContributorTypeForm = withStores(observer(ContributorTypeFormComponent))

const AddedContributorTypes = ({ contributorTypes = [], onRemove, onEdit, lang }) => (
  <div>
    {contributorTypes.map(contributorType => (
      <AgencyLabel color="#007fad" margin="0 0.5em 0.5em 0" key={contributorType.id}>
        <PaddedWord onClick={() => onEdit(contributorType.id)}>
          {contributorType.label[lang]}
        </PaddedWord>
        <FontAwesomeIcon onClick={() => onRemove(contributorType.id)} icon={faTimes} size="xs" />
      </AgencyLabel>
    ))}
  </div>
)

AddedContributorTypes.propTypes = {
  contributorTypes: PropTypes.array,
  onRemove: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
}

AddedContributorTypes.defaultProps = {
  contributorTypes: [],
}

const AddAgencyContainer = styled.div`
  text-align: right;
  padding-top: 1rem;
`
const AgencyLabel = styled(Label)`
  cursor: pointer;
`

const PaddedWord = styled.span`
  padding-right: 10px;
`

const StyledSelect = styled(ReactSelect)`
  margin-bottom: 1rem;
`

export default withStores(observer(FundingAgencyForm))
