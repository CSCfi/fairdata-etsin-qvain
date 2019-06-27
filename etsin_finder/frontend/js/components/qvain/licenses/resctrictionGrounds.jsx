import React, { Component } from 'react'
import styled from 'styled-components';
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import Translate from 'react-translate-component'

import { RestrictionGrounds as RestrictionGroundsConstructor } from '../../../stores/view/qvain'
import { onChange, getCurrentValue } from '../utils/select'
import getReferenceData from '../utils/getReferenceData';
import { restrictionGroundsSchema } from '../utils/formValidation';
import ValidationError from '../general/validationError';

class RestrictionGrounds extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    options: {
      en: [],
      fi: []
    },
    errorMessage: null
  }

  componentDidMount = () => {
    getReferenceData('restriction_grounds')
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

  componentWillUnmount = () => {
    this.props.Stores.Qvain.removeRestrictionGrounds();
  }

  handleBlur = () => {
    const { identifier } = this.props.Stores.Qvain.restrictionGrounds || ''
    restrictionGroundsSchema.validate(identifier)
      .then(() => {
        this.setState({
          errorMessage: null
        })
      })
      .catch((err) => {
        this.setState({
          errorMessage: err.errors
        })
      })
  }

  render() {
    const { options, errorMessage } = this.state
    const { lang } = this.props.Stores.Locale
    const { restrictionGrounds, setRestrictionGrounds } = this.props.Stores.Qvain
    return (
      <RestrictionGroundsContainer>
        <Translate component="h3" content="qvain.rightsAndLicenses.restrictionGrounds.title" />
        <Translate
          component={Select}
          name="restrictionGrounds"
          value={getCurrentValue(restrictionGrounds, options, lang)}
          options={options[lang]}
          isClearable
          onChange={
            onChange(options, lang, setRestrictionGrounds, RestrictionGroundsConstructor)
          }
          onBlur={this.handleBlur}
          attributes={{
            placeholder: 'qvain.rightsAndLicenses.restrictionGrounds.placeholder'
          }}
        />
        {errorMessage && <ValidationError>{errorMessage}</ValidationError>}        <Text><Translate content="qvain.rightsAndLicenses.restrictionGrounds.text" /></Text>
      </RestrictionGroundsContainer>
    )
  }
}

const RestrictionGroundsContainer = styled.div`
  margin-top: 20px;
`
const Text = styled.p`
  margin-top: 10px;
`

export default inject('Stores')(observer(RestrictionGrounds))
