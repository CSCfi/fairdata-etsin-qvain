import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'

import SearchSelect from '../../general/V2/SearchSelect'
import Select from '../../general/V2/Select'
import { Title, FieldGroup, InfoText, Required, RequiredText } from '../../general/V2/index'

const ModalReferenceInput = ({
  field,
  options: { isSearch, isRequired, isMulti, isClearable },
}) => {
  const setValue = value => field.set({ value })
  const translations = {
    label: `${field.translationPath}.label`,
    infoText: `${field.translationPath}.infoText`,
  }

  const getSearchSelect = () => (
    <SearchSelect
      id={`${field.referenceName}-input`}
      name={field.referenceName}
      getter={field.value}
      setter={setValue}
      model={field.model}
      metaxIdentifier={field.referenceName}
      placeholder=""
      inModal
      isClearable
      aria-autocomplete="list"
    />
  )

  const getStaticSelect = () => (
    <Select
      id={`${field.referenceName}-input`}
      name={field.referenceName}
      getter={field.value}
      setter={setValue}
      model={field.model}
      metaxIdentifier={field.referenceName}
      placeholder=""
      inModal
      isClearable={isClearable}
      isMulti={isMulti}
      aria-autocomplete="list"
    />
  )

  const select = isSearch ? getSearchSelect() : getStaticSelect()

  return (
    <FieldGroup>
      <Title htmlFor={`${field.referenceName}-input`}>
        <Translate content={translations.label} />
        {isRequired && <Required />}
      </Title>
      {select}
      {isRequired && <RequiredText />}
      <Translate component={InfoText} content={translations.infoText} />
    </FieldGroup>
  )
}

ModalReferenceInput.propTypes = {
  field: PropTypes.object.isRequired,
  options: PropTypes.shape({
    isSearch: PropTypes.bool,
    isMulti: PropTypes.bool,
    isRequired: PropTypes.bool,
    isClearable: PropTypes.bool,
  }),
}

ModalReferenceInput.defaultProps = {
  options: {
    isSearch: false,
    isRequired: false,
    isMulti: false,
    isClearable: true,
  },
}

export default observer(ModalReferenceInput)
