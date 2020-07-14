import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import AsyncSelect from 'react-select/async'
import Select from 'react-select'
import axios from 'axios'
import styled from 'styled-components'

import Card from '../general/card'
import { LabelLarge } from '../general/form'

const langOptions = [
  // TODO: Check witch all languages should be supported, the index contains .e.g. und,
  // TODO: Move to constants file
  {
    label: 'en',
    value: 'en',
  },
  {
    label: 'fi',
    value: 'fi',
  },
  {
    label: 'sv',
    value: 'sv',
  },
]

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

  promiseOptions = inputValue =>
    new Promise(resolve => {
      axios
        // TODO: Use constants consistently PR #428
        .get(
          `https://metax-test.csc.fi/es/reference_data/keyword/_search?size=100&filter_path=hits.hits._source&q=label.${this.state.lang}:${inputValue}*`
        )
        .then(res => {
          console.log(res)
          const hits = res.data.hits.hits
          const options = hits.map(hit => {
            const option = {
              label: hit._source.label[this.state.lang],
              value: hit._source.uri,
            }
            return option
          })
          resolve(options)
        })
        .catch(err => {
          console.log(err)
        })
    })

  onLangChange = value => {
    this.setState({ lang: value.label })
  }

  render() {
    return (
      <Card>
        <LabelLarge htmlFor="subjectHeadings">
          <Translate content="qvain.description.subjectHeadings.title" />
        </LabelLarge>
        <Translate component="p" content="qvain.description.subjectHeadings.help" />
        <SelectRow>
          {/* TODO: Get the language to change when the user changes the lang */}
          <LangSelect
            defaultValue={langOptions.filter(obj => obj.label === this.state.lang)}
            options={langOptions}
            width="10%"
            onChange={this.onLangChange}
          />
          {/* TODO: The cacheOption can cause issued if you search one word, change
          language and search the same, then it does not change the search results
          because it is cached */}
          <Translate
            component={WordSelect}
            // cacheOptions
            loadOptions={this.promiseOptions}
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
