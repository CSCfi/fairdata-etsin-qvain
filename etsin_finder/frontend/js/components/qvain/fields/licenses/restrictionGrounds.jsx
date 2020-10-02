import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'

import { RestrictionGrounds as RestrictionGroundsConstructor } from '../../../../stores/view/qvain'
import Select from '../../general/input/select'
import { restrictionGroundsSchema } from '../../utils/formValidation'
import ValidationError from '../../general/errors/validationError'

class RestrictionGrounds extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    errorMessage: null,
  }

  handleBlur = () => {
    const { identifier } = this.props.Stores.Qvain.restrictionGrounds || ''
    restrictionGroundsSchema
      .validate(identifier)
      .then(() => {
        this.setState({
          errorMessage: null,
        })
      })
      .catch(err => {
        this.setState({
          errorMessage: err.errors,
        })
      })
  }

  render() {
    const { errorMessage } = this.state
    const { restrictionGrounds, setRestrictionGrounds } = this.props.Stores.Qvain
    return (
      <RestrictionGroundsContainer>
        <Translate component="h3" content="qvain.rightsAndLicenses.restrictionGrounds.title" />
        <Translate
          name="restrictionGrounds"
          metaxIdentifier="restriction_grounds"
          component={Select}
          attributes={{ placeholder: 'qvain.rightsAndLicenses.restrictionGrounds.placeholder' }}
          model={RestrictionGroundsConstructor}
          getter={restrictionGrounds}
          setter={setRestrictionGrounds}
          onBlur={this.handleBlur}
        />
        {errorMessage && <ValidationError>{errorMessage}</ValidationError>}
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
