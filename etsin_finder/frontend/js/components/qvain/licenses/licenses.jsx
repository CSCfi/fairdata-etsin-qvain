import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import getReferenceData from '../utils/getReferenceData';
import Card from '../general/card'

class License extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    licensesEn: [{ value: '', label: '' }],
    licensesFi: [{ value: '', label: '' }]
  }

  componentDidMount = () => {
    getReferenceData('license')
    .then(res => {
      const list = res.data.hits.hits;
      const refsEn = list.map(ref => (
        {
          value: ref._source.label.en,
          label: ref._source.label.en,
        }
        ))
      const refsFi = list.map(ref => (
        {
          value: ref._source.label.en,
          label: ref._source.label.fi,
        }
        ))
      this.setState({ licensesEn: refsEn })
      this.setState({ licensesFi: refsFi })
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
    return (
      <Card>
        <Translate component="h3" content="qvain.rightsAndLicenses.license.title" />
        <Translate
          component={Select}
          name="license"
          options={
            this.props.Stores.Locale.lang === 'en'
            ? this.state.licensesEn
            : this.state.licensesFi
          }
          clearable
          onChange={(license) => {
            this.props.Stores.Qvain.setLicence(license)
          }}
          onBlur={() => {}}
          attributes={{ placeholder: 'qvain.rightsAndLicenses.license.placeholder' }}
        />
      </Card>
    )
  }
}

export default inject('Stores')(observer(License))
