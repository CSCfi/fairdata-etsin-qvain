import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'

import Select from '../general/input/select'
import ValidationError from '../general/errors/validationError'

class RestrictionGrounds extends Component {
  handleBlur = this.props.Stores.Qvain.RestrictionGrounds.validate

  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  render() {
    const { value, set, validationError, Model } = this.props.Stores.Qvain.RestrictionGrounds
    return (
      <RestrictionGroundsContainer>
        <Translate component="h3" content="qvain.rightsAndLicenses.restrictionGrounds.title" />
        <Translate
          name="restrictionGrounds"
          metaxIdentifier="restriction_grounds"
          component={Select}
          attributes={{ placeholder: 'qvain.rightsAndLicenses.restrictionGrounds.placeholder' }}
          model={Model}
          getter={value}
          setter={set}
          onBlur={this.handleBlur}
        />
        <ValidationError>{validationError}</ValidationError>
        <Text>
          <Translate content="qvain.rightsAndLicenses.restrictionGrounds.text" />
        </Text>
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
