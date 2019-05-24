import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from 'react-select';
import Translate from 'react-translate-component';

import getReferenceData from '../utils/getReferenceData';
import Card from '../general/card';
import { FieldOfScience } from '../../../stores/view/qvain'
import { toJS } from 'mobx'

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

  getCurrentValue = (fieldOfScience, options, lang) => {
    let current
    if (fieldOfScience !== undefined && options[lang] !== undefined) {
      current = options[lang].find(opt => opt.value === fieldOfScience.url)
    }
    console.log('fieldOfScience ', toJS(fieldOfScience))
    if (current === undefined && fieldOfScience !== undefined) {
      current = {
        value: fieldOfScience.url,
        label: fieldOfScience.name[lang] || Object.values(fieldOfScience.name)[0]
      }
    }
    return current
  }

  render() {
    const { fieldOfScience } = this.props.Stores.Qvain
    const { lang } = this.props.Stores.Locale
    const { options } = this.state
    return (
      <Card>
        <Translate component="h3" content="qvain.description.fieldOfScience.title" />
        <Translate
          name="field-of-science"
          component={Select}
          attributes={{ placeholder: 'qvain.description.fieldOfScience.placeholder' }}
          value={this.getCurrentValue(fieldOfScience, options, lang)}
          className="basic-single"
          classNamePrefix="select"
          options={options[lang]}
          onChange={(selection) => {
            const name = {}
            name[lang] = selection.label
            const otherLocales = Object.keys(options).filter(o => o !== lang)
            if (otherLocales.length > 0) {
              name[otherLocales[0]] = options[otherLocales[0]].find(o => o.value === selection.value).label
            }
            this.props.Stores.Qvain.setFieldOfScience(FieldOfScience(name, selection.value))
          }}
        />
      </Card>
    )
  }
}

export default inject('Stores')(observer(FieldOfScienceField));
