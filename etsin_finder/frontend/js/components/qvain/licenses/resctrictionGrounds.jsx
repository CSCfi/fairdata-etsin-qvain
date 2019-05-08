import React, { Component } from 'react'
import styled from 'styled-components';
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import Translate from 'react-translate-component'

import getReferenceData from '../utils/getReferenceData';

class RestrictionGrounds extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    restrictionGroundsEn: [{ value: '', label: '' }],
    restrictionGroundsFi: [{ value: '', label: '' }]
  }

  componentDidMount = () => {
    getReferenceData('restriction_grounds')
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
      this.setState({
        restrictionGroundsEn: refsEn,
        restrictionGroundsFi: refsFi
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
    return (
      <RestrictionGroundsContainer>
        <Translate component="h3" content="qvain.rightsAndLicenses.restrictionGrounds.title" />
        <Translate
          component={Select}
          name="restrictionGrounds"
          options={
            this.props.Stores.Locale.lang === 'en'
            ? this.state.restrictionGroundsEn
            : this.state.restrictionGroundsFi
          }
          clearable
          onChange={(restrictionGrounds) => {
            this.props.Stores.Qvain.setRestrictionGrounds(restrictionGrounds)
          }}
          onBlur={() => {}}
          attributes={{
            placeholder: 'qvain.rightsAndLicenses.restrictionGrounds.placeholder'
          }}
        />
        <Text><Translate content="qvain.rightsAndLicenses.restrictionGrounds.text" /></Text>
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
