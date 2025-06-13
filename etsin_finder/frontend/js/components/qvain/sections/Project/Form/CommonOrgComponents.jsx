import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactSelect from 'react-select'
import Translate from '@/utils/Translate'

import { Input } from '@/components/qvain/general/modal/form'
import { DeleteButton } from '@/components/qvain/general/V2/buttons'
import { useStores } from '@/stores/stores'
import {
  InfoText,
  FieldLabel,
  FieldGroup,
  Divider,
  RequiredText,
  Title,
} from '@/components/qvain/general/V2'

/**
 * Internally used select component with form for adding organization manually.
 * This is a stateless component.
 */
export const OrgSelectComponent = observer(
  ({
    readonly,
    onChange,
    onBlur,
    value,
    options,
    name,
    inputId,
    creatable,
    allowReset,
    ariaLabel,
  }) => {
    const { Locale } = useStores()
    const { getPreferredLang, getValueTranslation } = Locale
    /**
     * Open form if add manually is selected.
     *
     * @param {Object} option Selected option
     */
    const onSelectChange = option => {
      if (option.value === 'create') {
        onChange({
          value: '',
          name: { und: '' },
          email: '',
          formIsOpen: true,
        })
      } else onChange({ ...option, formIsOpen: false })
    }

    const onReset = () => onChange(null)

    /**
     * Craft payload for onChange, based on organization form.
     */
    const onFormChange = event => {
      const newValue = event.target.value
      const newName = event.target.name
      const payload = value ? { ...value } : { label: undefined, name: undefined, value: undefined }
      const preferred = getPreferredLang(value.name)
      switch (newName) {
        case 'name': {
          payload.name = { [preferred]: newValue }
          payload.label = newValue
          break
        }
        case 'email': {
          payload.email = newValue
          break
        }
        case 'identifier': {
          payload.value = newValue
          break
        }
        default:
          break
      }
      onChange(payload)
    }

    /**
     * Add option for adding organization manually
     * if props has creatable set to true.
     */
    const getOptions = () => {
      const { translate } = Locale
      if (!creatable) return options
      return [
        {
          label: translate('qvain.organizationSelect.label.addNew'),
          options: [{ value: 'create', label: translate('qvain.organizationSelect.label.addNew') }],
        },
        {
          label: translate('qvain.actors.add.organization.options.presets'),
          options,
        },
      ]
    }

    /**
     * Select option will have an additional form is open property
     * if organization for should be visible.
     */
    const formIsOpen = value?.formIsOpen

    const preferredLang = getPreferredLang(value?.name)

    const renderForm = () => {
      if (!formIsOpen) return null
      return (
        <AddOptionContainer>
          <Translate component={FieldLabel} content="qvain.organizationSelect.label.addNew" />
          <Divider />
          <FieldGroup>
            <Translate component={Title} content="qvain.organizationSelect.label.name" />
            <Translate
              component={Input}
              value={value?.name?.[preferredLang] || ''}
              onChange={onFormChange}
              onBlur={onBlur}
              name="name"
              id={`${inputId}-name`}
              placeholder=""
            />
            <RequiredText />
            <Translate component={InfoText} content={'qvain.organizationSelect.infoText.name'} />
          </FieldGroup>
          <FieldGroup>
            <Translate component={Title} content="qvain.organizationSelect.label.email" />
            <Translate
              component={Input}
              value={value ? value.email : ''}
              onChange={onFormChange}
              onBlur={onBlur}
              name="email"
              id={`${inputId}-email`}
              placeholder=""
            />
            <Translate component={InfoText} content={'qvain.organizationSelect.infoText.email'} />
          </FieldGroup>
          <FieldGroup>
            <Translate component={Title} content="qvain.organizationSelect.label.identifier" />
            <Translate
              component={Input}
              value={value?.value || ''}
              onChange={onFormChange}
              onBlur={onBlur}
              name="identifier"
              id={`${inputId}-identifier`}
              placeholder=""
            />
            <Translate
              component={InfoText}
              content={'qvain.organizationSelect.infoText.identifier'}
            />
          </FieldGroup>
        </AddOptionContainer>
      )
    }
    return (
      <>
        <OrgItemContainer>
          <Translate
            component={StyledSelect}
            name={name}
            inputId={inputId}
            isDisabled={readonly}
            onChange={onSelectChange}
            getOptionLabel={option =>
              option.label ? option.label : getValueTranslation(option.name) || ''
            }
            value={{ ...value, value: value?.value || '' }}
            className="basic-single"
            classNamePrefix="select"
            options={getOptions()}
            placeholder=""
            aria-label={ariaLabel}
            ariaAutocomplete="list"
          />
          {allowReset && !readonly ? (
            <DeleteButton
              type="button"
              onClick={onReset}
              style={{ margin: '0 0 0 .25rem', height: 38 }}
            />
          ) : null}
        </OrgItemContainer>
        {renderForm()}
      </>
    )
  }
)

const StyledSelect = styled(ReactSelect)`
  flex-grow: 1;
`

OrgSelectComponent.propTypes = {
  readonly: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  value: PropTypes.object,
  options: PropTypes.array,
  name: PropTypes.string.isRequired,
  inputId: PropTypes.string.isRequired,
  creatable: PropTypes.bool,
  allowReset: PropTypes.bool,
  ariaLabel: PropTypes.string,
}

OrgSelectComponent.defaultProps = {
  options: [],
  placeholder: null,
  creatable: true,
  value: undefined,
  allowReset: false,
  ariaLabel: undefined,
  readonly: false,
  onBlur: undefined,
}

export const SelectContainer = styled.div`
  padding-left: 1rem;
`

export const OrgItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-right: 1rem;
  justify-content: flex-start;
`

export const Department = styled.div`
  margin-left: 1rem;
  margin-top: 0.5rem;
`

export const AddOptionContainer = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
`

export const BoxedContainer = styled.div`
  border: 1px solid;
  border-color: ${({ theme }) => theme.color.darkgray};
  padding: 1rem;
`
