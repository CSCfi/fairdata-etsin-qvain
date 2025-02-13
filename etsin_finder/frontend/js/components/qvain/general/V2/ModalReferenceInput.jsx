import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import SearchSelect from './SearchSelect'
import Select from './Select'
import { Title, FieldGroup, InfoText, Required, RequiredText } from './index'

const ModalReferenceInput = ({
  Field,
  datum,
  model,
  metaxIdentifier,
  search,
  translationsRoot,
  isRequired,
  isMulti,
  isClearable,
}) => {
  const setValue = value => Field.changeAttribute(datum, value)
  const t = translationsRoot || Field.translationsRoot
  const translations = {
    label: `${t}.${datum}.label`,
    infoText: `${t}.${datum}.infoText`,
  }

  const getSearchSelect = () => (
    <SearchSelect
      id={`${datum}-input`}
      name={datum}
      getter={Field.inEdit[datum]}
      setter={setValue}
      model={model}
      metaxIdentifier={metaxIdentifier}
      placeholder=""
      inModal
      isClearable
      aria-autocomplete="list"
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
      placeholder=""
      inModal
      isClearable={isClearable}
      isMulti={isMulti}
      aria-autocomplete="list"
    />
  )

  const select = search ? getSearchSelect() : getStaticSelect()

  return (
    <FieldGroup>
      <Title htmlFor={`${datum}-input`}>
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
  Field: PropTypes.object.isRequired,
  datum: PropTypes.string.isRequired,
  model: PropTypes.func.isRequired,
  metaxIdentifier: PropTypes.string.isRequired,
  search: PropTypes.bool,
  translationsRoot: PropTypes.string,
  isRequired: PropTypes.bool,
  isMulti: PropTypes.bool,
  isClearable: PropTypes.bool,
}

ModalReferenceInput.defaultProps = {
  search: false,
  isRequired: false,
  translationsRoot: null,
  isMulti: false,
  isClearable: true,
}

export default observer(ModalReferenceInput)
