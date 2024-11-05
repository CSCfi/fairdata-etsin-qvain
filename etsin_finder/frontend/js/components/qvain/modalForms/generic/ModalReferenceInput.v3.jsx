import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'

import SearchSelect from '../../general/V2/SearchSelect'
import Select from '../../general/V2/Select'
import { Title, FieldGroup, InfoText, Required, RequiredText } from '../../general/V2/index'

const ModalReferenceInput = ({
  item,
  fieldName,
  options: { isSearch, isRequired, isMulti, isClearable },
  changeCallback,
}) => {
  const {
    controller: { set },
    [fieldName]: value,
    translationPath,
  } = item

  const setValue = v => {
    set({ value: v, fieldName })
    changeCallback()
  }
  const translations = {
    label: `${translationPath}.fields.${fieldName}.label`,
    infoText: `${translationPath}.fields.${fieldName}.infoText`,
  }

  const getSearchSelect = () => (
    <SearchSelect
      id={`${fieldName}-input`}
      name={fieldName}
      getter={value}
      setter={setValue}
      model={(label, v) => ({ pref_label: label, url: v })}
      metaxIdentifier={fieldName}
      placeholder=""
      inModal
      isClearable
      aria-autocomplete="list"
      changeCallback={changeCallback}
    />
  )

  const getStaticSelect = () => (
    <Select
      id={`${fieldName}-input`}
      name={fieldName}
      getter={value}
      setter={setValue}
      model={(label, v) => ({ pref_label: label, url: v })}
      metaxIdentifier={fieldName}
      placeholder=""
      inModal
      isClearable={isClearable}
      isMulti={isMulti}
      aria-autocomplete="list"
      changeCallback={changeCallback}
    />
  )

  const select = isSearch ? getSearchSelect() : getStaticSelect()

  return (
    <FieldGroup>
      <Title htmlFor={`${fieldName}-input`}>
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
  item: PropTypes.object.isRequired,
  fieldName: PropTypes.string.isRequired,
  options: PropTypes.shape({
    isSearch: PropTypes.bool,
    isMulti: PropTypes.bool,
    isRequired: PropTypes.bool,
    isClearable: PropTypes.bool,
  }),
  changeCallback: PropTypes.func,
}

ModalReferenceInput.defaultProps = {
  options: {
    isSearch: false,
    isRequired: false,
    isMulti: false,
    isClearable: true,
  },
  changeCallback: () => {},
}

export default observer(ModalReferenceInput)
