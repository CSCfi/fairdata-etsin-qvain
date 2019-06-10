import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import Translate from 'react-translate-component'

import getReferenceData from '../utils/getReferenceData';
import Card from '../general/card';
import RestrictionGrounds from './resctrictionGrounds';
import { accessTypeSchema } from '../utils/formValidation';
import ValidationError from '../general/validationError';
import EmbargoExpires from './embargoExpires'
import { onChange, getCurrentValue } from '../utils/select'
import { AccessType as AccessTypeConstructor } from '../../../stores/view/qvain'

const EMBARGO = 'http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo'
const OPEN = 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open'

class AccessType extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    options: {
      en: [],
      fi: []
    },
    accessTypeRestricted: false,
    accessTypeValidationError: null
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

  handleChange = (selection) => {
    const { lang } = this.props.Stores.Locale
    const { options } = this.state
    const { setAccessType } = this.props.Stores.Qvain
    onChange(options, lang, setAccessType, AccessTypeConstructor)(selection)
    if (selection.value !== 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open') {
      this.setState({ accessTypeRestricted: true })
    } else if (selection.value === 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open') {
      this.setState({ accessTypeRestricted: false })
    }
    this.setState({ accessTypeValidationError: null })
  }

  handleBlur = () => {
    accessTypeSchema.validate(this.props.Stores.Qvain.accessType)
      .then(() => {
        this.setState({ accessTypeValidationError: null })
      })
      .catch((err) => {
        this.setState({ accessTypeValidationError: err.errors })
      })
  }

  render() {
    const { lang } = this.props.Stores.Locale
    const { options } = this.state
    const { accessType } = this.props.Stores.Qvain
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
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          attributes={{
            placeholder: 'qvain.rightsAndLicenses.accessType.placeholder'
          }}
        />
        <ValidationError>{this.state.accessTypeValidationError}</ValidationError>
        {(accessType !== undefined && accessType.url === EMBARGO) && (<EmbargoExpires />)}
        { this.state.accessTypeRestricted
          ? <RestrictionGrounds /> : null}
      </Card>
    )
  }
}

export default inject('Stores')(observer(AccessType))
