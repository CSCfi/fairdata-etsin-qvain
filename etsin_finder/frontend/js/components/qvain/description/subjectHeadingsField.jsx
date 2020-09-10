import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import AsyncSelect from 'react-select/async'
import Select from 'react-select'
import styled from 'styled-components'

import Card from '../general/card'
import AddedValue from '../general/addedValue'
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
      const lang = locale[currentLang] ? currentLang : 'und'
      return (
        <AddedValue
          readonly={readonly}
          key={url}
          id={url}
          text={locale[lang]}
          remove={removeSubjectHeading}
        />
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
          <LangSelect
            defaultValue={LANG_OPTIONS.filter(obj => obj.label === currentLang)}
            aria-label="Subject heading language select"
            options={LANG_OPTIONS}
            width="10%"
            onChange={value => this.setState({ lang: value.label })}
            isSearchable={false}
          />
          <Translate
            component={WordSelect}
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
const LangSelect = styled(Select)`
  width: ${props => props.width};
  min-width: 5em;
`
const WordSelect = styled(AsyncSelect)`
  width: ${props => props.width};
`

export default inject('Stores')(observer(SubjectHeadingsField))
