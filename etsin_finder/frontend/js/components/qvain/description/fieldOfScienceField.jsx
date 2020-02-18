import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from 'react-select';
import Translate from 'react-translate-component';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Label from '../general/label'
import Button from '../../general/button'

import getReferenceData from '../utils/getReferenceData';
import Card from '../general/card';
import { FieldOfScience, FieldOfScienceArray } from '../../../stores/view/qvain';


import { onChange, getCurrentValue } from '../utils/select'
import { LabelLarge } from '../general/form'

class FieldOfScienceField extends React.Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    options: {},
  }

  handleFieldOfScienceAddArray = () => {
    const { setFieldOfScienceArray } = this.props.Stores.Qvain
    // console.log('inside the handleFieldOfScienceAddArray method')
    const fos = { ...this.props.Stores.Qvain.fieldOfScience }
      if (!this.props.Stores.Qvain.fieldOfScienceArray.some(field => field.url === fos.url)) {
      setFieldOfScienceArray([...this.props.Stores.Qvain.fieldOfScienceArray, FieldOfScienceArray(fos, fos.url)])
    }
  }

  handleFieldOfScienceRemove = fos => {
    this.props.Stores.Qvain.removeFieldOfScience(fos)
  }

  componentDidMount = () => {
    getReferenceData('field_of_science')
    .then(res => {
      const list = res.data.hits.hits;
      const refsEn = list.map(ref => (
        {
          value: ref._source.uri,
          label: ref._source.label.en,
        }
        ))
      const refsFi = list.map(ref => (
        {
          value: ref._source.uri,
          label: ref._source.label.fi,
        }
        ))
      this.setState({
        options: {
          en: refsEn,
          fi: refsFi
        }
      })
    })
    .catch(error => {
      if (error.response) {
        // Error response from Metax
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // No response from Metax
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });
  }

  render() {
    const { fieldOfScience, setFieldOfScience } = this.props.Stores.Qvain
    const { lang } = this.props.Stores.Locale
    const { options } = this.state

    const fieldOfScienceFaculty = this.props.Stores.Qvain.fieldOfScienceArray.map(fieldOfScienceEntry => (
      <Label color="#007fad" margin="0 0.5em 0.5em 0" key={fieldOfScienceEntry.url}>
        {/* <PaddedWord>{fieldOfScienceEntry.name.name[lang]}</PaddedWord> */}
        <PaddedWord>{fieldOfScienceEntry.url}</PaddedWord>
        <FontAwesomeIcon onClick={() => this.handleFieldOfScienceRemove(fieldOfScienceEntry)} icon={faTimes} size="xs" />
      </Label>
    ))
    return (
      <Card>
        <LabelLarge htmlFor="fieldOfScienceSelect">
          <Translate content="qvain.description.fieldOfScience.title" />
        </LabelLarge>
        You can add multiple keywords
        {fieldOfScienceFaculty}
        <Translate
          name="field-of-science"
          inputId="fieldOfScienceSelect"
          component={Select}
          attributes={{ placeholder: 'qvain.description.fieldOfScience.placeholder' }}
          value={getCurrentValue(fieldOfScience, options, lang)}
          className="basic-single"
          classNamePrefix="select"
          options={options[lang]}
          onChange={onChange(options, lang, setFieldOfScience, FieldOfScience)}
        />
        <ButtonContainer>
          {/* <AddNewButton type="button" onClick={this.handleKeywordAdd}> */}
          <AddNewButton type="button" onClick={this.handleFieldOfScienceAddArray}>
            <Translate content="qvain.description.keywords.addButton" />
          </AddNewButton>
        </ButtonContainer>
      </Card>
    )
  }
}

const PaddedWord = styled.span`
  padding-right: 10px;
`
const ButtonContainer = styled.div`
  text-align: right;
`
const AddNewButton = styled(Button)`
  margin: 0;
  margin-top: 11px;
`
export default inject('Stores')(observer(FieldOfScienceField));
