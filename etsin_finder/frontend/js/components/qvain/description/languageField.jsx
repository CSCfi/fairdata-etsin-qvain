import React from 'react'

import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Select from '../general/searchSelect'

import { DatasetLanguage } from '../../../stores/view/qvain'

import Label from '../general/label'
import Button from '../../general/button'
import Card from '../general/card'
import { LabelLarge } from '../general/form'


const LanguageField = ({ Stores }) => {
  const { lang } = Stores.Locale
  const { readonly, datasetLanguage, datasetLanguageArray, setDatasetLanguage, removeDatasetLanguage, addDatasetLanguage } = Stores.Qvain

  const addedLanguages = datasetLanguageArray.map((selectedLanguage) => (
    <Label color="#007fad" margin="0 0.5em 0.5em 0" key={selectedLanguage.url}>
      <PaddedWord>{selectedLanguage.name[lang] || selectedLanguage.name.und }</PaddedWord>
      <FontAwesomeIcon
        onClick={() => removeDatasetLanguage(selectedLanguage)}
        icon={faTimes}
        size="xs"
      />
    </Label>
  ))

  return (
    <Card>
      <LabelLarge htmlFor="datasetLanguage">
        <Translate content="qvain.description.datasetLanguage.title" />
      </LabelLarge>
      <Translate component="p" content="qvain.description.datasetLanguage.help" />
      { addedLanguages }
      <Select
        name="dataset-language"
        id="datasetLanguage"
        getter={datasetLanguage}
        setter={setDatasetLanguage}
        model={DatasetLanguage}
        noOptionsMessage={({ inputValue }) => {
          if (inputValue) {
            return translate('qvain.description.datasetLanguage.noResults')
          }
          return translate('qvain.description.datasetLanguage.placeholder')
        }}
        metaxIdentifier="language"
        placeholder="qvain.description.datasetLanguage.placeholder"
        search
        isClearable
      />
      <AddLanguageContainer>
        <Button
          onClick={() => addDatasetLanguage(datasetLanguage)}
          disabled={readonly}
        >
          <Translate content="qvain.description.datasetLanguage.addButton" />
        </Button>
      </AddLanguageContainer>
    </Card>
  )
}

LanguageField.propTypes = {
  Stores: PropTypes.object.isRequired,
}

const PaddedWord = styled.span`
  padding-right: 10px;
`

const AddLanguageContainer = styled.div`
  text-align: right;
  padding-top: 1rem;
`

export default inject('Stores')(observer(LanguageField))
