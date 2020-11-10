import React, { useState } from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import CreatableSelect from 'react-select/creatable'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import translate from 'counterpart'
import { AddNewButton } from '../buttons'

import ValidationError from '../errors/validationError'

const createOption = label => ({
  label,
  value: label,
})

const components = {
  DropdownIndicator: null,
}

const StringArray = ({
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
}) => {
  const [changed, setChanged] = useState()

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
    if (changed && validateItemStr()) {
      addItemStr()
      validateArray()
    }
  }

  const validate = () => {
    if (validateItemStr()) {
      validateArray()
    }
  }

  const handleInputChange = (str, meta) => {
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
        component={CreatableSelect}
        components={components}
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
      />
      <ErrorAndButtonContainer>
        <ArrayValidationError>{validationError}</ArrayValidationError>
        <AddNewButton type="button" onClick={validateAndAdd} disabled={readonly}>
          <Translate content={`${translationsRoot}.addButton`} />
        </AddNewButton>
      </ErrorAndButtonContainer>
    </>
  )
}

StringArray.propTypes = {
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
}

StringArray.defaultProps = {
  itemSchema: null,
  schema: null,
  addWithComma: false,
  readonly: false,
}

const ArrayValidationError = styled(ValidationError)`
  margin-top: 0.5em;
  flex-grow: 1;
`

const ErrorAndButtonContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  ${AddNewButton} {
    margin-left: auto;
    flex-shrink: 0;
  }
`

export default observer(StringArray)
