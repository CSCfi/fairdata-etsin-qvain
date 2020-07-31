import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import { createFilter, components as selectComponents } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'

import { DeleteButton } from '../general/buttons'
import ValidationError from '../general/validationError'
import { getOrganizationName } from './common'

const getOrgOptionsWithLang = (orgs, lang) => {
  // From the reference data parse the values with the current lang
  // or und.
  const options = orgs.map((org) => {
    const orgWithLang = {
      label: getOrganizationName(org, lang),
      type: 'organization',
      value: org,
    }
    return orgWithLang
  })
  return options
}

const getDatasetOrgOptionsWithLang = (orgArrays, lang) => {
  // From the reference data parse the values with the current lang
  // or und.
  const options = orgArrays.map((orgs) => {
    const name = orgs.map((org) => getOrganizationName(org, lang)).join(', ')
    const orgWithLang = {
      label: name,
      type: 'multiple',
      value: orgs,
    }
    return orgWithLang
  })
  return options
}

const getOptionsWithLang = (Actors, datasetOptions, referenceOptions, lang) => [
  {
    label: translate('qvain.actors.add.organization.options.create', { locale: lang }),
    value: 'create',
    type: 'create',
  },
  {
    label: translate('qvain.actors.add.organization.options.dataset', { locale: lang }),
    options: datasetOptions,
  },
  {
    label: translate('qvain.actors.add.organization.options.presets', { locale: lang }),
    options: referenceOptions,
  },
]

export class OrgSelectorBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
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

  static defaultProps = {
    organization: null,
    referenceOrganizations: null,
    datasetOrganizations: null,
  }

  getComponents(selectedOption) {
    const { organization, organizations } = this.props
    const isReference = organization && organization.isReference
    const isEditable = organization && organization.isReference === false && !isNew
    const isNew = this.props.level >= organizations.length

    const hideDropdown = !isNew
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
      components.Control = (props) => (
        <selectComponents.Control
          {...props}
          style={{ cursor: 'pointer', alignItems: 'stretch' }}
          innerProps={{ onMouseDown: this.props.toggleEdit, style: { cursor: 'pointer' } }}
        />
      )
      components.IndicatorsContainer = () => <EditIcon />
    }
    return components
  }

  handleSelection = (selection) => {
    if (selection.type === 'create') {
      this.props.createOrganization('')
    } else if (selection.type === 'organization') {
      this.props.setOrganization(selection.value)
    } else if (selection.type === 'multiple') {
      this.props.setMultipleOrganizations(selection.value)
    }
  }

  render() {
    const { readonly } = this.props.Stores.Qvain
    const { lang } = this.props.Stores.Locale
    const {
      organization,
      organizations,
      level,
      datasetOrganizations,
      referenceOrganizations,
    } = this.props

    let referenceOptions = []
    let datasetOptions = []

    let placeholderKey = 'loading'
    if (referenceOrganizations) {
      referenceOptions = getOrgOptionsWithLang(referenceOrganizations, lang)
      placeholderKey = level === 0 ? 'placeholder' : 'placeholderChild'
    }

    if (datasetOrganizations) {
      datasetOptions = getDatasetOrgOptionsWithLang(datasetOrganizations, lang)
    }
    const options = getOptionsWithLang(
      this.props.Stores.Qvain.Actors,
      datasetOptions,
      referenceOptions,
      lang
    )

    const identifier = (organization || {}).identifier
    let selectedOption =
      (identifier && referenceOptions.find((opt) => opt.value.identifier === identifier)) || null
    if (organization && !selectedOption) {
      selectedOption = { value: '', label: getOrganizationName(organization, lang) }
    }

    const isLast = this.props.level === organizations.length - 1
    const deleteButtonStyle = isLast ? null : { visibility: 'hidden' }

    const styles = {
      option: (style) => ({
        ...style,
        display: 'flex',
        alignItems: 'center',
      }),
    }
    const organizationError = null
    return (
      <>
        <OrganizationLevel>
          <Translate
            component={SelectOrg}
            name="orgField"
            isDisabled={readonly}
            options={options}
            styles={styles}
            inputId="orgField"
            components={this.getComponents(selectedOption)}
            formatCreateLabel={(inputValue) => (
              <>
                <Translate content="qvain.actors.add.newOrganization.label" />
                <span>: &rsquo;{inputValue}&rsquo;</span>
                <EditIcon color="gray" />
              </>
            )}
            menuPlacement="auto"
            menuPosition="fixed"
            menuShouldScrollIntoView={false}
            attributes={{ placeholder: `qvain.actors.add.organization.${placeholderKey}` }}
            onCreateOption={this.props.createOrganization}
            onChange={(selection, s) => this.handleSelection(selection, s)}
            value={selectedOption}
            filterOption={createFilter({ ignoreAccents: false })}
          />

          {!readonly && (
            <DeleteButton
              type="button"
              disabled={!isLast}
              style={deleteButtonStyle}
              onClick={this.props.removeOrganization}
            />
          )}
        </OrganizationLevel>
        {organizationError && <ValidationError>{organizationError}</ValidationError>}
      </>
    )
  }
}

const EditIcon = styled(FontAwesomeIcon).attrs(() => ({
  icon: faPen,
}))`
  color: ${(props) => props.theme.color[props.color || 'primary']};
  margin: 0 0.5rem;
  margin-left: auto;
`

const OrganizationLevel = styled.div`
  display: flex;
  align-items: stretch;

  & button {
    height: 38px;
    width: 38px;
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
    <>
      <selectComponents.Option
        {...props}
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        {children}
        {(create || edit) && <EditIcon color="gray" />}
      </selectComponents.Option>
    </>
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

const ValuePlaceholder = styled(Value)`
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

export default inject('Stores')(observer(OrgSelectorBase))
