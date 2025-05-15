import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import CreatableSelect from 'react-select/creatable'
import { components } from 'react-select'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from '@/utils/Translate'
import { AddNewButton } from '../buttons'

import ValidationError from '../errors/validationError'
import { useStores } from '@/stores/stores'

const createOption = label => ({
  label,
  value: label,
})

const Input = props => {
  const required = props?.selectProps?.required
  return <components.Input aria-required={required} {...props} />
}

Input.propTypes = {
  selectProps: PropTypes.object.isRequired,
}

const customComponents = {
  DropdownIndicator: null,
  Input,
}

const StringArray = ({ id, fieldName, addWithComma, required, hideButton }) => {
  const {
    Qvain: { [fieldName]: Field },
  } = useStores()

  const {
    itemStr,
    addItemStr,
    setItemStr,
    validateStr,
    storage: value,
    set,
    translationsRoot,
    validate,
    validationError,
    readonly,
  } = Field

  const selectRef = useRef()

  const validateAndAdd = () => {
    if (validateStr()) addItemStr()
  }

  const focusInput = () => {
    const select = selectRef?.current
    if (select) {
      select.select.focus()
    }
  }

  const handleAddNew = () => {
    validateAndAdd()
    focusInput()
  }

  const handleInputChange = (str, meta) => {
    if (meta.action === 'input-blur' || meta.action === 'menu-close') {
      validateAndAdd() // Save value when leaving input
    } else {
      setItemStr(str)
    }
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter' || (addWithComma && e.key === ',')) {
      e.preventDefault()
      validateAndAdd()
    }
  }

  const handleArrayChange = updatedOptions => {
    set((updatedOptions || []).map(opt => opt.value))

    validate()
  }

  const options = value.map(createOption)

  return (
    <>
      <Translate
        id={`string-array-${id}`}
        component={RefCreatableSelect}
        selectRef={selectRef}
        components={customComponents}
        inputId={id}
        inputValue={itemStr}
        isMulti
        isClearable={false}
        isDisabled={readonly}
        menuIsOpen={false}
        onChange={handleArrayChange}
        onInputChange={handleInputChange}
        onBlur={validate}
        onKeyDown={handleKeyDown}
        getValue={v => v}
        value={options}
        required={required}
        placeholder=""
        classNames={{
          control: () => 'control',
          multiValueLabel: () => 'selected-value',
        }}
      />
      <ErrorAndButtonContainer>
        {!hideButton && (
          <AddNewButton type="button" onClick={handleAddNew} disabled={readonly}>
            <Translate content={`${translationsRoot}.addButton`} />
          </AddNewButton>
        )}
        <ArrayValidationError>{validationError}</ArrayValidationError>
      </ErrorAndButtonContainer>
    </>
  )
}

StringArray.propTypes = {
  id: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  addWithComma: PropTypes.bool,
  required: PropTypes.bool,
  hideButton: PropTypes.bool,
}

StringArray.defaultProps = {
  id: undefined,
  addWithComma: false,
  required: false,
  hideButton: false,
}

const RefCreatableSelect = ({ selectRef, ...props }) => (
  <CreatableSelect ref={selectRef} {...props} />
)

RefCreatableSelect.propTypes = {
  selectRef: PropTypes.object.isRequired,
}

const ArrayValidationError = styled(ValidationError)`
  margin-top: 0.5em;
  flex-grow: 1;
`

const ErrorAndButtonContainer = styled.div`
  margin-top: 0.75rem;
`

export default observer(StringArray)
