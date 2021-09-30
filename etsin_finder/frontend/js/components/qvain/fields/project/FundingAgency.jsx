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
  resolveOptions,
} from './utils'
import { withStores, useStores } from '../../utils/stores'
import { LabelLarge } from '../../general/modal/form'
import {
  FundingAgency,
  ContributorType,
  Organization,
} from '../../../../stores/view/qvain/qvain.project'

const FundingAgencyForm = props => {
  const {
    Qvain: {
      Projects: { orgObjectSchema },
    },
  } = useStores()
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
  const onAddContributorType = val => {
    const { id, identifier, label } = val
    const contributorType = ContributorType(id, identifier, label)
    const contributorTypes = formData.contributorTypes
      .filter(type => type.id !== id)
      .concat([contributorType])
    props.onChange({
      ...formData,
      contributorTypeForm: { errors: {} },
      contributorTypes,
    })
  }

  const onRemoveContributorType = identifier => {
    const { formData } = props.value
    const contributorTypes = formData.contributorTypes.filter(
      type => type.identifier !== identifier
    )
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
    const validationErrors = validateSync(orgObjectSchema, organizations)
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
  const { readonly } = props.Stores.Qvain
  const { lang } = props.Stores.Locale

  return (
    <Card>
      <AddedAgencies
        agencies={addedFundingAgencies}
        onEdit={onEdit}
        onRemove={onRemove}
        lang={lang}
        readonly={readonly}
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
      <ContributorTypeForm
        formData={formData.contributorTypeForm}
        contributorTypes={formData.contributorTypes}
        onChange={onContributorTypeChange}
        onAdd={onAddContributorType}
        onRemove={onRemoveContributorType}
        readonly={readonly}
      />
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

const AddedAgencies = ({ agencies, onRemove, onEdit, lang, readonly }) => (
  <div>
    {agencies.map(agency => (
      <AgencyLabel color="#007fad" margin="0 0.5em 0.5em 0" key={agency.id}>
        <PaddedWord onClick={() => onEdit(agency.id)}>
          {agency.organization.organization.name[lang] || agency.organization.organization.name.und}
        </PaddedWord>
        {!readonly && (
          <FontAwesomeIcon onClick={() => onRemove(agency.id)} icon={faTimes} size="xs" />
        )}
      </AgencyLabel>
    ))}
  </div>
)

AddedAgencies.propTypes = {
  agencies: PropTypes.array,
  onRemove: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  readonly: PropTypes.bool,
}

AddedAgencies.defaultProps = {
  agencies: [],
  readonly: false,
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
    const {
      formData,
      contributorTypes,
      onChange,
      Stores: {
        Qvain: {
          Projects: { contributorTypeSchema },
        },
      },
    } = this.props
    const errors = await validate(contributorTypeSchema, contributorTypes || [])
    onChange({ ...formData, errors })
  }

  /** Map form properties from select value to form data. */
  onSelectChange = (contributorTypes, { action, option, removedValue }) => {
    if (action === 'select-option') {
      this.props.onAdd({
        id: option.value,
        identifier: option.value,
        label: option.label,
      })
    }

    if (action === 'remove-value') {
      this.props.onRemove(removedValue.identifier)
    }
  }

  render() {
    const { options, loading } = this.state
    if (loading) return null

    const { contributorTypes, readonly, formData } = this.props
    const { lang } = this.props.Stores.Locale

    return (
      <>
        <Translate
          component={LabelLarge}
          htmlFor="identifier"
          content="qvain.project.inputs.fundingAgency.contributorType.identifier.label"
        />
        <Translate
          component="div"
          content="qvain.project.inputs.fundingAgency.contributorType.description"
        />
        <Translate
          component={StyledSelect}
          name="identifier"
          inputId="identifier"
          isDisabled={readonly}
          onChange={this.onSelectChange}
          onBlur={this.onBlur}
          value={contributorTypes}
          isMulti
          isClearable={false}
          getOptionLabel={opt => opt.label?.[lang]}
          className="basic-single"
          classNamePrefix="select"
          options={options.all}
          attributes={{
            placeholder:
              'qvain.project.inputs.fundingAgency.contributorType.identifier.placeholder',
          }}
        />
        <ErrorMessages errors={formData.errors.identifier} />
      </>
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
