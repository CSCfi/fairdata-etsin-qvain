import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import getReferenceData from '../utils/getReferenceData';
import Card from '../general/card'
import { Label, Input } from '../general/form'

const otherOptValue = 'other'

const otherOptLabel = locale => {
  const labels = {
    en: 'Other (URL)',
    fi: 'Muu (URL)'
  }
  return labels[locale]
}

const otherOpt = locale => ({
  value: otherOptValue,
  label: otherOptLabel(locale)
})

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
          value: ref._source.uri,
          label: ref._source.label.en,
        }
        ))
      const refsFi = list.map(ref => (
        {
          value: ref._source.uri,
          label: ref._source.label.fi || ref._source.label.en // use english label when finnish is not available
        }
        ))
      this.setState({ licensesEn: [...refsEn, otherOpt('en')] })
      this.setState({ licensesFi: [...refsFi, otherOpt('fi')] })
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
    const { license, otherLicenseUrl } = this.props.Stores.Qvain
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
            this.props.Stores.Qvain.setLicence(license.value)
          }}
          onBlur={() => {}}
          attributes={{ placeholder: 'qvain.rightsAndLicenses.license.placeholder' }}
        />
        {(license === otherOptValue) && (
          <Fragment>
            <Translate
              component={Label}
              content="qvain.rightsAndLicenses.license.other.label"
              style={{ marginTop: '20px' }}
            />
            <Input
              value={otherLicenseUrl}
              onChange={(event) => {
                this.props.Stores.Qvain.otherLicenseUrl = event.target.value
              }}
              placeholder="https://"
            />
            <Translate component="p" content="qvain.rightsAndLicenses.license.other.help" />
          </Fragment>
        )}
      </Card>
    )
  }
}

export default inject('Stores')(observer(License))
