/* eslint-disable react/prop-types */
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import React from 'react'
import { createFilter, components as selectComponents } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import styled from 'styled-components'

import { DeleteButton } from '@/components/qvain/general/V2/buttons'
import ValidationError from '@/components/qvain/general/errors/validationError'
import { FieldGroup, InfoText } from '@/components/qvain/general/V2'
import Translate from '@/utils/Translate'
import { useStores } from '@/utils/stores'
import { getOrganizationName } from '../../common'

import { Input } from '@/components/qvain/general/modal/form'

// From the reference data parse the values with the current lang
// or und.
const getOrgOptionsWithLang = (orgs, lang) =>
  orgs.map(org => ({
    label: getOrganizationName(org, lang),
    type: 'organization',
    value: org,
  }))

// From the reference data parse the values with the current lang
// or und.
const getDatasetOrgOptionsWithLang = (orgArrays, lang) =>
  orgArrays.map(orgs => {
    const name = orgs.map(org => getOrganizationName(org, lang)).join(', ')
    return {
      label: name,
      type: 'multiple',
      value: orgs,
    }
  })

const getOptionsWithLang = (Locale, datasetOptions, referenceOptions, lang) => [
  {
    label: Locale.translate('qvain.actors.add.organization.options.create', { locale: lang }),
    value: 'create',
    type: 'create',
  },
  {
    label: Locale.translate('qvain.actors.add.organization.options.dataset', { locale: lang }),
    options: datasetOptions,
  },
  {
    label: Locale.translate('qvain.actors.add.organization.options.presets', { locale: lang }),
    options: referenceOptions,
  },
]

const propTypes = {
  organization: PropTypes.object,
  organizations: PropTypes.array.isRequired,
  datasetOrganizations: PropTypes.array,
  referenceOrganizations: PropTypes.array,
  setOrganization: PropTypes.func.isRequired,
  setMultipleOrganizations: PropTypes.func.isRequired,
  createOrganization: PropTypes.func.isRequired,
  removeOrganization: PropTypes.func.isRequired,
  toggleEdit: PropTypes.func.isRequired,
  level: PropTypes.number.isRequired,
}

const defaultProps = {
  organization: null,
  referenceOrganizations: null,
  datasetOrganizations: null,
}

export const OrgSelectorBase = ({
  organization,
  organizations,
  datasetOrganizations,
  referenceOrganizations,
  setOrganization,
  setMultipleOrganizations,
  createOrganization,
  removeOrganization,
  toggleEdit,
  level,
}) => {
  const Stores = useStores()
  const { readonly } = Stores.Qvain
  const { lang, translate } = Stores.Locale

  const isNew = level >= organizations.length
  const isReference = organization?.isReference
  const isEditable = organization?.isReference === false && !isNew
  const hideDropdown = !isNew

  let referenceOptions = []
  let datasetOptions = []

  let infoTextKey = 'loading'
  if (referenceOrganizations) {
    referenceOptions = getOrgOptionsWithLang(referenceOrganizations, lang)
    infoTextKey = level === 0 ? 'infoText' : 'infoTextChild'
  }

  const identifier = (organization || {}).identifier

  let selectedOption =
    (identifier && referenceOptions.find(opt => opt.value.identifier === identifier)) || null
  if (organization && !selectedOption) {
    selectedOption = { value: '', label: getOrganizationName(organization, lang) }
  }

  if (datasetOrganizations) {
    datasetOptions = getDatasetOrgOptionsWithLang(datasetOrganizations, lang)
  }

  const options = getOptionsWithLang(Stores.Locale, datasetOptions, referenceOptions, lang)

  const isLast = level === organizations.length - 1
  const deleteButtonStyle = isLast ? null : { display: 'none' }

  const styles = {
    option: style => ({
      ...style,
      display: 'flex',
      alignItems: 'center',
    }),
  }

  const getComponents = () => {
    const components = {
      Placeholder: ValuePlaceholder,
      SingleValue: Value,
      ValueContainer,
    }

    if (hideDropdown) {
      components.Input = () => null
      components.IndicatorsContainer = () => null
    }

    if (!isReference && selectedOption && selectedOption.label === '') {
      components.SingleValue = ValuePlaceholder
      selectedOption.label = translate('qvain.actors.add.organization.label')
    }

    components.Option = CustomOption

    if (isEditable) {
      components.Control = props => (
        <EditToggle
          onClick={toggleEdit}
          tabIndex="0"
          aria-label={translate('qvain.actors.add.organization.details')}
        >
          {props.children}
        </EditToggle>
      )
      components.IndicatorsContainer = () => <EditIcon />
    }
    return components
  }

  const handleSelection = selection => {
    switch (selection.type) {
      case 'create':
        return createOrganization('')
      case 'organization':
        return setOrganization(selection.value)
      case 'multiple':
        return setMultipleOrganizations(selection.value)
      default:
        return null
    }
  }

  const organizationError = null
  return (
    <>
      <FieldGroup>
        <OrganizationLevel data-cy={`organization-level-${level}`}>
          <Translate
            component={SelectOrg}
            name="orgField"
            isDisabled={readonly}
            options={options}
            styles={styles}
            inputId="orgField"
            components={getComponents()}
            formatCreateLabel={inputValue => (
              <>
                <Translate content="qvain.actors.add.newOrganization.label" />
                <span>: &rsquo;{inputValue}&rsquo;</span>
                <EditIcon color="gray" />
              </>
            )}
            menuPlacement="auto"
            menuPosition="fixed"
            menuShouldScrollIntoView={false}
            onCreateOption={createOrganization}
            onChange={selection => handleSelection(selection)}
            value={selectedOption}
            filterOption={createFilter({ ignoreAccents: false })}
            placeholder=""
          />

          {!readonly && (
            <DeleteButton
              type="button"
              disabled={!isLast}
              style={deleteButtonStyle}
              onClick={removeOrganization}
            />
          )}
        </OrganizationLevel>
        <Translate
          component={InfoText}
          content={`qvain.actors.add.organization.${infoTextKey}`}
          weight={1.5}
        />
      </FieldGroup>
      {organizationError && <ValidationError>{organizationError}</ValidationError>}
    </>
  )
}

const EditIcon = styled(FontAwesomeIcon).attrs(() => ({
  icon: faPen,
}))`
  color: ${props => props.theme.color[props.color || 'primary']};
  margin: 0 0.5rem;
  margin-left: auto;
`

const OrganizationLevel = styled.div`
  display: flex;
  align-items: stretch;

  & button {
    height: 38px;
    margin: 0 0 0 4px;
  }
`

const ValueWrapper = ({ className, children }) => <div className={className}>{children}</div>

ValueWrapper.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.node,
}
ValueWrapper.defaultProps = {
  children: null,
}

const CustomOption = ({ children, ...props }) => {
  const create = props.data.type === 'create'
  let edit = false
  if (props.data.type === 'multiple') {
    const [lastItem] = props.value.slice(-1)
    edit = lastItem.isReference === false
  }
  return (
    <selectComponents.Option {...props}>
      {children}
      {(create || edit) && <EditIcon color="gray" />}
    </selectComponents.Option>
  )
}

CustomOption.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]).isRequired,
}

const Value = styled(ValueWrapper)`
  margin: 0;
  padding: 2px 0 0 0;
  border: 0;
  color: hsl(0, 0%, 20%);
  margin-left: 2px;
  margin-right: 2px;
  max-width: calc(100% - 8px);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  box-sizing: border-box;
`

const ValuePlaceholder = styled(selectComponents.Placeholder)`
  color: hsl(0, 0%, 50%);
  position: absolute;
`

const ValueContainer = styled(selectComponents.ValueContainer)`
  align-self: stretch;
`

const SelectOrg = styled(CreatableSelect)`
  flex-grow: 1;
  margin-bottom: 0.5rem;
`

const EditToggle = styled(Input).attrs({ as: 'button' })`
  margin: 0;
  text-align: left;
  background: none;
  padding: 0;
  height: 38px;
  display: flex;
  padding: 2px 4px;
  align-items: center;
`

OrgSelectorBase.propTypes = propTypes
OrgSelectorBase.defaultProps = defaultProps

export default observer(OrgSelectorBase)
