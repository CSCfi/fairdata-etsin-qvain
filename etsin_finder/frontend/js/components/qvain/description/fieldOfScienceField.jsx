import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import AddedValue from '../general/addedValue'
import Button from '../../general/button'
import getReferenceData from '../utils/getReferenceData'
import Card from '../general/card'
import { FieldOfScience } from '../../../stores/view/qvain'
import { onChange, getCurrentValue } from '../utils/select'
import { LabelLarge } from '../general/form'

class FieldOfScienceField extends React.Component {
  promises = []

  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    options: {},
  }

  componentDidMount = () => {
    this.promises.push(
      getReferenceData('field_of_science')
        .then(res => {
          const list = res.data.hits.hits
          const refsEn = list.map(ref => ({
            value: ref._source.uri,
            label: ref._source.label.en,
          }))
          const refsFi = list.map(ref => ({
            value: ref._source.uri,
            label: ref._source.label.fi,
          }))
          this.setState({
            options: {
              en: refsEn,
              fi: refsFi,
            },
          })
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
    this.promises.forEach(promise => promise && promise.cancel && promise.cancel())
  }

  removeFieldOfScience = fieldOfScienceToRemove => {
    this.props.Stores.Qvain.removeFieldOfScience(fieldOfScienceToRemove)
  }

  render() {
    const {
      readonly,
      fieldOfScience,
      fieldOfScienceArray,
      setFieldOfScience,
      addFieldOfScience,
    } = this.props.Stores.Qvain
    const { lang } = this.props.Stores.Locale
    const { options } = this.state

    const fieldOfScienceFaculty = fieldOfScienceArray.map(fieldOfScienceEntry => {
      const { url, name } = fieldOfScienceEntry
      return (
        <AddedValue
          key={url}
          readonly={readonly}
          id={url}
          text={name[lang]}
          remove={this.removeFieldOfScience}
        />
      )
    })
    return (
      <Card>
        <LabelLarge htmlFor="fieldOfScienceSelect">
          <Translate content="qvain.description.fieldOfScience.title" />
        </LabelLarge>
        <Translate component="p" content="qvain.description.fieldOfScience.help" />
        {fieldOfScienceFaculty}
        <Translate
          name="field-of-science"
          inputId="fieldOfScienceSelect"
          component={Select}
          attributes={{ placeholder: 'qvain.description.fieldOfScience.placeholder' }}
          isDisabled={readonly}
          isClearable
          value={getCurrentValue(fieldOfScience, options, lang)}
          className="basic-single"
          classNamePrefix="select"
          options={options[lang]}
          onChange={onChange(options, lang, setFieldOfScience, FieldOfScience)}
        />
        <ButtonContainer>
          <AddNewButton
            type="button"
            onClick={() => addFieldOfScience(fieldOfScience)}
            disabled={readonly}
          >
            <Translate content="qvain.description.fieldOfScience.addButton" />
          </AddNewButton>
        </ButtonContainer>
      </Card>
    )
  }
}

const ButtonContainer = styled.div`
  text-align: right;
`
const AddNewButton = styled(Button)`
  margin: 0;
  margin-top: 11px;
`
export default inject('Stores')(observer(FieldOfScienceField))
