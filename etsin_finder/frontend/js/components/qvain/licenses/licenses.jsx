import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import getReferenceData from '../utils/getReferenceData';
import Card from '../general/card'
import { License as LicenseConstructor } from '../../../stores/view/qvain'
import { onChange, getCurrentValue } from '../utils/select'

class License extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    options: {
      en: [],
      fi: []
    }
  }

  componentDidMount = () => {
    getReferenceData('license')
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
    const { options } = this.state
    const { lang } = this.props.Stores.Locale
    const { license, setLicense } = this.props.Stores.Qvain
    return (
      <Card>
        <Translate component="h3" content="qvain.rightsAndLicenses.license.title" />
        <Translate
          component={Select}
          name="license"
          value={getCurrentValue(license, options, lang)}
          options={options[lang]}
          clearable
          onChange={onChange(options, lang, setLicense, LicenseConstructor)}
          onBlur={() => {}}
          attributes={{ placeholder: 'qvain.rightsAndLicenses.license.placeholder' }}
        />
      </Card>
    )
  }
}

export default inject('Stores')(observer(License))
