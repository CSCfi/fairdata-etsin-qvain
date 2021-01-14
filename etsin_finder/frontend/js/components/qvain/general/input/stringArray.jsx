import React, { useState, useRef } from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import CreatableSelect from 'react-select/creatable'
import { components } from 'react-select'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import translate from 'counterpart'
import { AddNewButton } from '../buttons'

import ValidationError from '../errors/validationError'

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

const StringArray = ({
  id,
  itemStr,
  addItemStr,
  setItemStr,
  itemSchema,
  value,
  set,
  schema,
  addWithComma,
  translationsRoot,
  readonly,
  validationError,
  setValidationError,
  required,
}) => {
  const [changed, setChanged] = useState()
  const selectRef = useRef()

  const validateArray = () => {
    if (!changed) {
      setValidationError(null)
      return true
    }

    try {
      if (schema) {
        schema.validateSync(value)
      }
      setValidationError(null)
      return true
    } catch (err) {
      setValidationError(err.message)
      return false
    }
  }

  const validateItemStr = () => {
    if (!changed || !itemStr) {
      setValidationError(null)
      return true
    }

    try {
      if (value.includes(itemStr)) {
        throw new Error(translate(`${translationsRoot}.alreadyAdded`))
      }
      if (itemSchema) {
        itemSchema.validateSync(itemStr)
      }
      return true
    } catch (err) {
      setValidationError(err.message)
      return false
    }
  }

  const validateAndAdd = () => {
    if (changed && itemStr && validateItemStr()) {
      addItemStr()
      validateArray()
    }
  }

  const validate = () => {
    if (validateItemStr()) {
      validateArray()
    }
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
    // prevent blur from clearing the input
    if (meta.action !== 'input-blur' && meta.action !== 'menu-close') {
      setItemStr(str)
      setChanged(true)
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
    setChanged(true)
    validateArray()
  }

  const options = value.map(createOption)

  return (
    <>
      <Translate
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
        attributes={{ placeholder: `${translationsRoot}.placeholder` }}
        required={required}
      />
      <ErrorAndButtonContainer>
        <AddNewButton type="button" onClick={handleAddNew} disabled={readonly}>
          <Translate content={`${translationsRoot}.addButton`} />
        </AddNewButton>
        <ArrayValidationError>{validationError}</ArrayValidationError>
      </ErrorAndButtonContainer>
    </>
  )
}

StringArray.propTypes = {
  id: PropTypes.string,
  itemStr: PropTypes.string.isRequired,
  addItemStr: PropTypes.func.isRequired,
  setItemStr: PropTypes.func.isRequired,
  itemSchema: PropTypes.object,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  set: PropTypes.func.isRequired,
  schema: PropTypes.object,
  addWithComma: PropTypes.bool,
  readonly: PropTypes.bool,
  translationsRoot: PropTypes.string.isRequired,
  validationError: PropTypes.string.isRequired,
  setValidationError: PropTypes.func.isRequired,
  required: PropTypes.bool,
}

StringArray.defaultProps = {
  id: undefined,
  itemSchema: null,
  schema: null,
  addWithComma: false,
  readonly: false,
  required: false,
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
