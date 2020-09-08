import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { Observer } from 'mobx-react'
import SearchSelect from './searchSelect'
import Select from './select'
import { Label } from './form'

const ModalReferenceInput = ({
  Field,
  translationsRoot,
  datum,
  model,
  metaxIdentifier,
  search,
}) => {
  const setValue = value => Field.changeAttribute(datum, value)
  const translations = {
    label: `${translationsRoot}.modal.${datum}Input.label`,
    placeholder: `${translationsRoot}.modal.${datum}Input.placeholder`,
  }

  const getSearchSelect = () => (
    <SearchSelect
      id={`${datum}-input`}
      name={datum}
      getter={Field.inEdit[datum]}
      setter={setValue}
      model={model}
      metaxIdentifier={metaxIdentifier}
      placeholder={translations.placeholder}
      inModal
      search
      isClearable
    />
  )

  const getStaticSelect = () => (
    <Select
      id={`${datum}-input`}
      name={datum}
      getter={Field.inEdit[datum]}
      setter={setValue}
      model={model}
      metaxIdentifier={metaxIdentifier}
      placeholder={translations.placeholder}
      inModal
      isClearable
    />
  )

  const select = search ? getSearchSelect() : getStaticSelect()

  return (
    <>
      <Label htmlFor={`${datum}-input`}>
        <Translate content={translations.label} />
      </Label>
      <Observer>{() => select}</Observer>
    </>
  )
}

ModalReferenceInput.propTypes = {
  Field: PropTypes.object.isRequired,
  translationsRoot: PropTypes.string.isRequired,
  datum: PropTypes.string.isRequired,
  model: PropTypes.func.isRequired,
  metaxIdentifier: PropTypes.string.isRequired,
  search: PropTypes.bool,
}

ModalReferenceInput.defaultProps = {
  search: false,
}

export default ModalReferenceInput
