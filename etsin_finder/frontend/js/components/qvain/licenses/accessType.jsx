import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import Translate from 'react-translate-component'

import getReferenceData from '../utils/getReferenceData';
import Card from '../general/card'
import { onChange, getCurrentValue } from '../utils/select'
import { AccessType as AccessTypeConstructor } from '../../../stores/view/qvain'

const OPEN = 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open'

class AccessType extends Component {
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
    getReferenceData('access_type')
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
    const { lang } = this.props.Stores.Locale
    const { options } = this.state
    const { accessType, setAccessType } = this.props.Stores.Qvain
    return (
      <Card>
        <Translate component="h3" content="qvain.rightsAndLicenses.accessType.title" />
        <Translate
          component={Select}
          name="accessType"
          options={this.state.options[lang]}
          clearable
          value={
            getCurrentValue(accessType, options, lang) ||
            options[lang].find(opt => opt.value === OPEN) // access is OPEN by default - 28.5.2019
          }
          onChange={onChange(options, lang, setAccessType, AccessTypeConstructor)}
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
