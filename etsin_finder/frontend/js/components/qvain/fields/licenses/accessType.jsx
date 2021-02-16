import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Select from 'react-select'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import { withFieldErrorBoundary } from '../../general/errors/fieldErrorBoundary'
import getReferenceData from '../../utils/getReferenceData'
import Card from '../../general/card'
import RestrictionGrounds from './restrictionGrounds'
import ValidationError from '../../general/errors/validationError'
import EmbargoExpires from './embargoExpires'
import {
  onChange,
  getCurrentOption,
  getOptionLabel,
  getOptionValue,
  sortOptions,
  autoSortOptions,
} from '../../utils/select'
import { LabelLarge, HelpField } from '../../general/modal/form'
import { ACCESS_TYPE_URL } from '../../../../utils/constants'
import { withStores } from '../../utils/stores'

export class AccessType extends Component {
  promises = []

  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    options: [],
  }

  componentDidMount = () => {
    const { Model, value: accessType } = this.props.Stores.Qvain.AccessType
    this.promises.push(
      getReferenceData('access_type')
        .then(res => {
          const list = res.data.hits.hits
          let options = list.map(ref => Model(ref._source.label, ref._source.uri))

          const user = this.props.Stores.Auth.user

          if (!user.isUsingRems && !(accessType && accessType.url === ACCESS_TYPE_URL.PERMIT)) {
            options = options.filter(ref => ref.url !== ACCESS_TYPE_URL.PERMIT)
          }

          const { lang } = this.props.Stores.Locale
          sortOptions(Model, lang, options)
          this.setState({
            options,
          })

          autoSortOptions(this, this.props.Stores.Locale, Model)
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
    const { set, setValidationError } = this.props.Stores.Qvain.AccessType
    onChange(set)(selection)
    setValidationError(null)
  }

  handleBlur = () => this.props.Stores.Qvain.AccessType.validate

  render() {
    const { lang } = this.props.Stores.Locale
    const { value, Model, validationError, readonly } = this.props.Stores.Qvain.AccessType
    const { options } = this.state

    let permitInfo = null
    if (value && value.url === ACCESS_TYPE_URL.PERMIT) {
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
          value={getCurrentOption(Model, options, value)} // access is OPEN by default - 28.5.2019
          onChange={this.handleChange}
          getOptionLabel={getOptionLabel(Model, lang)}
          getOptionValue={getOptionValue(Model)}
          onBlur={this.handleBlur}
          attributes={{
            placeholder: 'qvain.rightsAndLicenses.accessType.placeholder',
          }}
        />
        {permitInfo}
        <ValidationError>{validationError}</ValidationError>
        {value !== undefined && value.url === ACCESS_TYPE_URL.EMBARGO && <EmbargoExpires />}
        {value.url !== ACCESS_TYPE_URL.OPEN ? <RestrictionGrounds /> : null}
      </Card>
    )
  }
}

const PermitHelp = styled.div`
  margin-top: 0.5rem;
`

export default withFieldErrorBoundary(
  withStores(observer(AccessType)),
  'qvain.rightsAndLicenses.accessType.title'
)
