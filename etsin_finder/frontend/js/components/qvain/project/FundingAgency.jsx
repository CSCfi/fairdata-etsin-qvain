import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import ReactSelect from 'react-select'
import axios from 'axios'

import Card from '../general/card'
import OrganizationSelect from '../general/organizationSelect'
import Button from '../../general/button'
import Label from '../general/label'
import { ErrorMessages, organizationSelectValueToSchema, validateSync, validate,
  isEmptyObject, organizationToSelectValue, Expand, referenceDataToOptions } from './utils'
import { LabelLarge, Input } from '../general/form'
import { fundingAgencySchema, organizationSelectSchema } from '../utils/formValidation'
import { FundingAgency, ContributorType, Organization } from '../../../stores/view/qvain'
import { METAX_FAIRDATA_ROOT_URL } from '../../../utils/constants'


const FundingAgencyForm = props => {
  const onOrganizationChange = value => {
    const { formData } = props.value
    props.onChange({ ...formData, organization: value })
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
    const { id, identifier, labelEn, labelFi, definitionEn, definitionFi, inScheme } = formData.contributorTypeForm
    const label = { en: labelEn, fi: labelFi }
    const definition = { en: definitionEn, fi: definitionFi }
    const contributorType = ContributorType(id, identifier, label, definition, inScheme)
    const contributorTypes = formData.contributorTypes
      .filter(type => type.id !== id)
      .concat([contributorType])
    props.onChange({
      ...formData,
      contributorTypeForm: { errors: {} },
      contributorTypes
    })
  }

  const onRemoveContributorType = id => {
    const { formData } = props.value
    const contributorTypes = formData.contributorTypes
      .filter(type => type.id !== id)
    props.onChange({ ...formData, contributorTypeForm: { errors: {} }, contributorTypes })
  }

  /**
   * Convert organization to select value for organization select
   */
  const onEdit = async id => {
    const { addedFundingAgencies } = props.value
    const { lang } = props.Stores.Locale
    const agencyToEdit = addedFundingAgencies.find(agency => agency.id === id)
    if (!agencyToEdit) return
    const { organization, contributorTypes } = agencyToEdit
    const department = await organizationToSelectValue(
      organization.department, lang,
      organization.organization ? organization.organization.identifier : null, lang
    )
    const subDepartment = await organizationToSelectValue(
      organization.subDepartment, lang,
      organization.department ? organization.department.identifier : null, lang
    )
    props.onChange({
      id,
      organization: {
        organization: await organizationToSelectValue(organization.organization, lang),
        department,
        subDepartment
      },
      contributorTypeForm: { errors: {} },
      contributorTypes,
    })
  }

  /**
   *
   */
  const validateAll = organizations => {
    let valid = true
    const { formData } = props.value
    for (const [key, value] of Object.entries(organizations)) {
      if (value) {
        const errors = validateSync(organizationSelectSchema, value)
        formData.organization[key].errors = errors
        if (!isEmptyObject(errors)) valid = false
      }
    }
    props.onChange(formData)
    return valid
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
      />
      <LabelLarge htmlFor="organization">
        <Translate content="qvain.project.inputs.fundingAgency.contributorType.organization.label" />
      </LabelLarge>
      <OrganizationSelect
        onChange={onOrganizationChange}
        value={formData.organization}
        name="organization"
        inputId="organization"
      />
      <Expand
        title={<Translate component="h3" content="qvain.project.inputs.fundingAgency.contributorType.title" />}
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
        <Button onClick={onAddAgency}>
          <Translate content={formData.id
            ? 'qvain.project.inputs.fundingAgency.editButton'
            : 'qvain.project.inputs.fundingAgency.addButton'}
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
    { agencies.map(agency => (
      <AgencyLabel color="#007fad" margin="0 0.5em 0.5em 0" key={agency.id}>
        <PaddedWord onClick={() => onEdit(agency.id)}>
          {agency.organization.organization.name[lang] || agency.organization.organization.name.und }
        </PaddedWord>
        <FontAwesomeIcon
          onClick={() => onRemove(agency.id)}
          icon={faTimes}
          size="xs"
        />
      </AgencyLabel>
    )) }
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
    options: {}
  }

  componentDidMount() {
    this.fetchOptions()
  }

  fetchOptions = async () => {
    const response = await axios.get(`${METAX_FAIRDATA_ROOT_URL}/es/reference_data/contributor_type/_search?pretty=true&size=100`)
    if (response.status !== 200) return
    const options = referenceDataToOptions(response.data.hits.hits)
    console.log(options)
    this.setState({ options })
  }

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

  onSelectChange = value => {
    const { formData, onChange } = this.props
    onChange({ ...formData, identifier: value })
  }

  onAddType = async () => {
    const { formData, onChange, onAdd } = this.props
    const errors = await validate(fundingAgencySchema, { ...formData, identifier: formData.identifier.value })
    if (!isEmptyObject(errors)) onChange({ ...formData, errors })
    else onAdd()
  }

  onEditType = id => {
    const { contributorTypes, onChange } = this.props

    const contributorTypeToEdit = contributorTypes
      .find(contributorType => contributorType.id === id)
    if (!contributorTypeToEdit) return
    const { identifier, label, definition, inScheme } = contributorTypeToEdit
    onChange({
      id,
      identifier,
      labelEn: label ? label.en : '',
      labelFi: label ? label.fi : '',
      definitionEn: definition ? definition.en : '',
      definitionFi: definition ? definition.fi : '',
      inScheme,
      errors: {},
    })
  }

  render() {
    const { contributorTypes, onRemove, readonly, formData } = this.props
    const { lang } = this.props.Stores.Locale
    const { options } = this.state

    return (
      <Card>
        <Translate component="p" content="qvain.project.inputs.fundingAgency.contributorType.description" />
        <AddedContributorTypes
          contributorTypes={contributorTypes}
          onEdit={this.onEditType}
          onRemove={onRemove}
          lang={lang}
        />
        <LabelLarge htmlFor="identifier">
          <Translate content="qvain.project.inputs.fundingAgency.contributorType.identifier.label" />
        </LabelLarge>
        <Translate
          component={ReactSelect}
          name="identifier"
          inputId="identifier"
          isDisabled={readonly}
          onChange={this.onSelectChange}
          value={formData.identifier}
          className="basic-single"
          classNamePrefix="select"
          options={options[lang]}
          attributes={{ placeholder: 'qvain.project.inputs.fundingAgency.contributorType.identifier.placeholder' }}
        />
        <ErrorMessages errors={formData.errors.identifier} />
        <LabelLarge htmlFor="titleEn">
          <Translate content="qvain.project.inputs.fundingAgency.contributorType.label.label" />
        </LabelLarge>
        <Translate component="p" content="qvain.project.inputs.fundingAgency.contributorType.label.description" />
        <Translate
          component={Input}
          value={formData.labelEn || ''}
          onChange={this.onFieldChange}
          onBlur={this.onBlur}
          attributes={{ placeholder: 'qvain.project.inputs.fundingAgency.contributorType.label.placeholderEn' }}
          disabled={readonly}
          name="labelEn"
          id="labelEn"
        />
        <Translate
          component={Input}
          value={formData.labelFi || ''}
          onChange={this.onFieldChange}
          onBlur={this.onBlur}
          attributes={{ placeholder: 'qvain.project.inputs.fundingAgency.contributorType.label.placeholderFi' }}
          disabled={readonly}
          name="labelFi"
          id="labelFi"
        />
        <LabelLarge htmlFor="definitionEn">
          <Translate content="qvain.project.inputs.fundingAgency.contributorType.definition.label" />
        </LabelLarge>
        <Translate component="p" content="qvain.project.inputs.fundingAgency.contributorType.definition.description" />
        <Translate
          component={Input}
          value={formData.definitionEn || ''}
          onChange={this.onFieldChange}
          onBlur={this.onBlur}
          attributes={{ placeholder: 'qvain.project.inputs.fundingAgency.contributorType.definition.placeholderEn' }}
          disabled={readonly}
          name="definitionEn"
          id="definitionEn"
        />
        <Translate
          component={Input}
          value={formData.definitionFi || ''}
          onChange={this.onFieldChange}
          onBlur={this.onBlur}
          attributes={{ placeholder: 'qvain.project.inputs.fundingAgency.contributorType.definition.placeholderFi' }}
          disabled={readonly}
          name="definitionFi"
          id="definitionFi"
        />
        <LabelLarge htmlFor="inScheme">
          <Translate content="qvain.project.inputs.fundingAgency.contributorType.inScheme.label" />
        </LabelLarge>
        <Translate component="p" content="qvain.project.inputs.fundingAgency.contributorType.inScheme.description" />
        <Translate
          component={Input}
          value={formData.inScheme || ''}
          onChange={this.onFieldChange}
          onBlur={this.onBlur}
          attributes={{ placeholder: 'qvain.project.inputs.fundingAgency.contributorType.inScheme.placeholder' }}
          disabled={readonly}
          name="inScheme"
          id="inScheme"
        />
        <AddAgencyContainer>
          <Button onClick={this.onAddType}>
            <Translate content={formData.id
              ? 'qvain.project.inputs.fundingAgency.contributorType.editButton'
              : 'qvain.project.inputs.fundingAgency.contributorType.addButton'}
            />
          </Button>
        </AddAgencyContainer>
      </Card>
    )
  }
}

const ContributorTypeForm = inject('Stores')(observer(ContributorTypeFormComponent))

const AddedContributorTypes = ({ contributorTypes = [], onRemove, onEdit, lang }) => (
  <div>
    { contributorTypes.map(contributorType => (
      <AgencyLabel color="#007fad" margin="0 0.5em 0.5em 0" key={contributorType.id}>
        <PaddedWord onClick={() => onEdit(contributorType.id)}>{contributorType.identifier.name[lang] }</PaddedWord>
        <FontAwesomeIcon
          onClick={() => onRemove(contributorType.id)}
          icon={faTimes}
          size="xs"
        />
      </AgencyLabel>
     )) }
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

export default inject('Stores')(observer(FundingAgencyForm))
