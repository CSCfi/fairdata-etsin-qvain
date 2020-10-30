import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Select from 'react-select'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import getReferenceData from '../utils/getReferenceData'
import Card from '../general/card'
import RestrictionGrounds from './restrictionGrounds'
import { accessTypeSchema } from '../utils/formValidation'
import ValidationError from '../general/errors/validationError'
import EmbargoExpires from './embargoExpires'
import {
  onChange,
  getCurrentOption,
  getOptionLabel,
  getOptionValue,
  sortOptions,
  autoSortOptions,
} from '../utils/select'
import { AccessType as AccessTypeConstructor } from '../../../stores/view/qvain'
import { LabelLarge, HelpField } from '../general/modal/form'
import { ACCESS_TYPE_URL } from '../../../utils/constants'
import { withStores } from '../utils/stores'

export class AccessType extends Component {
  promises = []

  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    options: [],
    accessTypeValidationError: null,
  }

  componentDidMount = () => {
    this.promises.push(
      getReferenceData('access_type')
        .then(res => {
          const list = res.data.hits.hits
          let options = list.map(ref => AccessTypeConstructor(ref._source.label, ref._source.uri))

          const user = this.props.Stores.Auth.user
          const { accessType } = this.props.Stores.Qvain

          if (!user.isUsingRems && !(accessType && accessType.url === ACCESS_TYPE_URL.PERMIT)) {
            options = options.filter(ref => ref.url !== ACCESS_TYPE_URL.PERMIT)
          }

          const { lang } = this.props.Stores.Locale
          sortOptions(AccessTypeConstructor, lang, options)
          this.setState({
            options,
          })

          autoSortOptions(this, this.props.Stores.Locale, AccessTypeConstructor)
        })
        .catch(error => {
          if (error.response) {
            // Error response from Metax
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
          } else if (error.request) {
            // No response from Metax
            console.log(error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
          }
        })
    )
  }

  componentWillUnmount() {
    this.promises.forEach(promise => promise && promise.cancel && promise.cancel())
  }

  handleChange = selection => {
    const { setAccessType } = this.props.Stores.Qvain
    onChange(setAccessType)(selection)
    this.setState({ accessTypeValidationError: null })
  }

  handleBlur = () => {
    accessTypeSchema
      .validate(this.props.Stores.Qvain.accessType)
      .then(() => {
        this.setState({ accessTypeValidationError: null })
      })
      .catch(err => {
        this.setState({ accessTypeValidationError: err.errors })
      })
  }

  render() {
    const { lang } = this.props.Stores.Locale
    const { accessType, readonly } = this.props.Stores.Qvain
    const { options } = this.state

    let permitInfo = null
    if (accessType && accessType.url === ACCESS_TYPE_URL.PERMIT) {
      permitInfo = (
        <PermitHelp>
          <Translate
            component={HelpField}
            content="qvain.rightsAndLicenses.accessType.permitInfo"
          />
        </PermitHelp>
      )
    }

    return (
      <Card>
        <LabelLarge htmlFor="accessTypeSelect">
          <Translate content="qvain.rightsAndLicenses.accessType.title" />
        </LabelLarge>
        <Translate
          component={Select}
          inputId="accessTypeSelect"
          name="accessType"
          options={options}
          clearable
          isDisabled={readonly}
          value={getCurrentOption(AccessTypeConstructor, options, accessType)} // access is OPEN by default - 28.5.2019
          onChange={this.handleChange}
          getOptionLabel={getOptionLabel(AccessTypeConstructor, lang)}
          getOptionValue={getOptionValue(AccessTypeConstructor)}
          onBlur={this.handleBlur}
          attributes={{
            placeholder: 'qvain.rightsAndLicenses.accessType.placeholder',
          }}
        />
        {permitInfo}
        <ValidationError>{this.state.accessTypeValidationError}</ValidationError>
        {accessType !== undefined && accessType.url === ACCESS_TYPE_URL.EMBARGO && (
          <EmbargoExpires />
        )}
        {accessType.url !== ACCESS_TYPE_URL.OPEN ? <RestrictionGrounds /> : null}
      </Card>
    )
  }
}

const PermitHelp = styled.div`
  margin-top: 0.5rem;
`

export default withStores(observer(AccessType))
