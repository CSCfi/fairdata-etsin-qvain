import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from 'react-select';
import Translate from 'react-translate-component';

import getReferenceData from '../utils/getReferenceData';
import Card from '../general/card';
import { FieldOfScience } from '../../../stores/view/qvain'
import { onChange, getCurrentValue } from '../utils/select'
import { LabelLarge } from '../general/form'

class FieldOfScienceField extends React.Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    options: {}
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
    return (
      <Card>
        <LabelLarge htmlFor="fieldOfScienceSelect">
          <Translate content="qvain.description.fieldOfScience.title" />
        </LabelLarge>
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
      </Card>
    )
  }
}

export default inject('Stores')(observer(FieldOfScienceField));
