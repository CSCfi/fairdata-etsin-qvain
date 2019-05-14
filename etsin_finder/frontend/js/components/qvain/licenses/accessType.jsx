import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import Translate from 'react-translate-component'

import getReferenceData from '../utils/getReferenceData';
import Card from '../general/card'

class AccessType extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    accessTypesEn: [{ value: '', label: '' }],
    accessTypesFi: [{ value: '', label: '' }]
  }

  componentDidMount = () => {
    getReferenceData('access_type')
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
      this.setState({ accessTypesEn: refsEn })
      this.setState({ accessTypesFi: refsFi })
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
        <Translate component="h3" content="qvain.rightsAndLicenses.accessType.title" />
        <Translate
          component={Select}
          name="accessType"
          options={
            this.props.Stores.Locale.lang === 'en'
            ? this.state.accessTypesEn
            : this.state.accessTypesFi
          }
          clearable
          onChange={(accessType) => {
            this.props.Stores.Qvain.accessType = accessType
          }}
          onBlur={() => {}}
          attributes={{
            placeholder: 'qvain.rightsAndLicenses.accessType.placeholder'
          }}
        />
      </Card>
    )
  }
}

export default inject('Stores')(observer(AccessType))
