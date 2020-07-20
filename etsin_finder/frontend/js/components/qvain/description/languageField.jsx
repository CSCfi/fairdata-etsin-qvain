import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import getReferenceData from '../utils/getReferenceData'
import { onChange, getCurrentValue } from '../utils/select'
import { DatasetLanguage } from '../../../stores/view/qvain'

import Label from '../general/label'
import Button from '../../general/button'
import Card from '../general/card'
import { LabelLarge } from '../general/form'


class LanguageField extends Component {
  promises = []

  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    options: {
      fi: [],
      en: [],
    },
  }

  componentDidMount() {
    this.promises.push(
      getReferenceData('language')
        .then(resp => {
          const { hits } = resp.data.hits
          const en = hits.map((ref) => ({
            value: ref._source.uri,
            label: ref._source.label.en || ref._source.label.und,
          }))
          const fi = hits.map((ref) => ({
            value: ref._source.uri,
            label: ref._source.label.fi || ref._source.label.und,
          }))
          this.setState({ options: { en, fi } })
        })
        .catch(error => {
          if (error.response) {
            // Error response from Metax
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
          } else if (error.request) {
            // No response from Metax
            console.log(error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
          }
        })
    )
  }

  componentWillUnmount() {
    this.promises.forEach((promise) => promise && promise.cancel && promise.cancel())
  }

  renderSelectedLanguages() {
    const { lang } = this.props.Stores.Locale
    const { datasetLanguageArray, removeDatasetLanguage } = this.props.Stores.Qvain
    return datasetLanguageArray.map((selectedLanguage) => (
      <Label color="#007fad" margin="0 0.5em 0.5em 0" key={selectedLanguage.url}>
        <PaddedWord>{selectedLanguage.name[lang]}</PaddedWord>
        <FontAwesomeIcon
          onClick={() => removeDatasetLanguage(selectedLanguage)}
          icon={faTimes}
          size="xs"
        />
      </Label>
    ))
  }

  render() {
    const { lang } = this.props.Stores.Locale
    const { options } = this.state
    const { readonly, datasetLanguage, setDatasetLanguage, addDatasetLanguage } = this.props.Stores.Qvain
    return (
      <Card>
        <LabelLarge htmlFor="datasetLanguage">
          <Translate content="qvain.description.datasetLanguage.title" />
        </LabelLarge>
        <Translate component="p" content="qvain.description.datasetLanguage.help" />
        { this.renderSelectedLanguages() }
        <Translate
          name="dataset-language"
          inputId="datasetLanguage"
          component={Select}
          attributes={{ placeholder: 'qvain.description.datasetLanguage.placeholder' }}
          options={options[lang]}
          isDisabled={readonly}
          value={getCurrentValue(datasetLanguage, options, lang)}
          onChange={onChange(options, lang, setDatasetLanguage, DatasetLanguage)}
          isSearchable
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
}

const PaddedWord = styled.span`
  padding-right: 10px;
`

const AddLanguageContainer = styled.div`
  text-align: right;
  padding-top: 1rem;
`

export default inject('Stores')(observer(LanguageField))
