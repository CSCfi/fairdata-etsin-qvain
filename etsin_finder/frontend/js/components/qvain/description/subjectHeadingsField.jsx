import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import AsyncSelect from 'react-select/async'
import Select from 'react-select'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import Card from '../general/card'
import Label from '../general/label'
import { LabelLarge } from '../general/form'
import { getReferenceDataAsync } from '../utils/getReferenceData'
import { LANG_OPTIONS } from '../../../utils/constants'

class SubjectHeadingsField extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    const currentLang = props.Stores.Locale.currentLang
    this.state = {
      lang: currentLang,
    }
  }

  handleChange = newValue => {
    const { setSubjectHeadingValue, addToSubjectHeadingsArray } = this.props.Stores.Qvain
    setSubjectHeadingValue(newValue)
    addToSubjectHeadingsArray()
  }

  render() {
    const {
      readonly,
      subjectHeadingsArray,
      removeSubjectHeading,
      subjectHeadingValue,
    } = this.props.Stores.Qvain
    const { currentLang } = this.props.Stores.Locale

    const RenderedSubjectHeadings = subjectHeadingsArray.map(value => {
      const { locale, url } = value
      return (
        <Label color="#007fad" margin="0 0.5em 0.5em 0" key={url}>
          <PaddedWord>{locale[currentLang]}</PaddedWord>
          {!readonly && (
            <FontAwesomeIcon
              className="delete-keyword"
              size="xs"
              icon={faTimes}
              aria-label="remove"
              onClick={() => removeSubjectHeading(url)}
            />
          )}
        </Label>
      )
    })

    return (
      <Card>
        <LabelLarge htmlFor="subjectHeadings">
          <Translate content="qvain.description.subjectHeadings.title" />
        </LabelLarge>
        <Translate component="p" content="qvain.description.subjectHeadings.help" />
        {RenderedSubjectHeadings}
        <SelectRow>
          {/* TODO: Get the language to change when the user changes the lang */}
          <LangSelect
            defaultValue={LANG_OPTIONS.filter(obj => obj.label === currentLang)}
            options={LANG_OPTIONS}
            width="10%"
            onChange={value => this.setState({ lang: value.label })}
            isSearchable={false}
          />
          {/* TODO: The cacheOption can cause issued if you search one word, change
          language and search the same, then it does not change the search results
          because it is cached */}
          <Translate
            component={WordSelect}
            // cacheOptions
            onChange={this.handleChange}
            value={subjectHeadingValue}
            loadOptions={value => getReferenceDataAsync(value, this.state.lang)}
            attributes={{ placeholder: 'qvain.description.subjectHeadings.placeholder' }}
            width="90%"
            inputId="subjectHeadings"
          />
        </SelectRow>
      </Card>
    )
  }
}

const SelectRow = styled.div`
  display: flex;
`
const PaddedWord = styled.span`
  padding-right: 10px;
`
const LangSelect = styled(Select)`
  width: ${props => props.width};
  min-width: 5em;
`
const WordSelect = styled(AsyncSelect)`
  width: ${props => props.width};
`

export default inject('Stores')(observer(SubjectHeadingsField))
