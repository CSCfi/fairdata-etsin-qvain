import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Select from 'react-select'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { TitleSmall, FieldGroup, Divider } from '@/components/qvain/general/V2'

import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import ValidationError from '@/components/qvain/general/errors/validationError'
import {
  onChange,
  getOptionLabel,
  getOptionValue,
  getCurrentOption,
} from '@/components/qvain/utils/select'
import { ACCESS_TYPE_URL } from '@/utils/constants'
import { HelpField } from '@/components/qvain/general/modal/form'
import { withStores } from '@/stores/stores'
import RestrictionGrounds from './RestrictionGrounds'
import EmbargoExpires from './EmbargoExpires'
import { handleAccessTypeReferenceDataResponse } from '../../../IdaCatalog/componentHelpers'
import AbortClient, { isAbort } from '@/utils/AbortClient'
import DataAccess from './DataAccess'

export class AccessType extends Component {
  client = new AbortClient()

  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    options: [],
  }

  componentDidMount = async () => {
    try {
      const res = await this.props.Stores.Qvain.ReferenceData.getOptions('access_type', {
        client: this.client,
      })
      handleAccessTypeReferenceDataResponse(res, this.props.Stores, this)
    } catch (error) {
      if (isAbort(error)) {
        return
      }
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
    }
  }

  componentWillUnmount() {
    this.client.abort()
  }

  handleChange = selection => {
    const { set, setValidationError } = this.props.Stores.Qvain.AccessType
    onChange(set)(selection)
    setValidationError(null)
  }

  render() {
    const { lang, translate } = this.props.Stores.Locale
    const { value, Model, validationError, readonly, validate } = this.props.Stores.Qvain.AccessType
    const { shouldShowDataAccess } = this.props.Stores.Qvain.DataAccess
    const { options } = this.state

    let permitInfo = null
    if (value && value.url === ACCESS_TYPE_URL.PERMIT) {
      permitInfo = (
        <PermitHelp data-testid="permit-help">
          <Translate
            component={HelpField}
            content="qvain.rightsAndLicenses.accessType.permitInfo"
          />
        </PermitHelp>
      )
    }

    return (
      <FieldGroup data-cy="access-type-select">
        <TitleSmall htmlFor="accessTypeSelect">
          {translate('qvain.rightsAndLicenses.accessType.title')}
        </TitleSmall>
        <Select
          inputId="accessTypeSelect"
          name="accessType"
          options={options}
          clearable
          isDisabled={readonly}
          value={getCurrentOption(Model, options, value)} // access is OPEN by default - 28.5.2019
          onChange={this.handleChange}
          getOptionLabel={getOptionLabel(Model, lang)}
          getOptionValue={getOptionValue(Model)}
          onBlur={validate}
          placeholder={translate('qvain.rightsAndLicenses.accessType.placeholder')}
          aria-autocomplete="list"
        />
        {permitInfo}
        <ValidationError>{validationError}</ValidationError>
        {value?.url !== ACCESS_TYPE_URL.OPEN && (
          <>
            <Divider />
            {value?.url === ACCESS_TYPE_URL.EMBARGO && <EmbargoExpires />}
            {value.url !== ACCESS_TYPE_URL.OPEN ? <RestrictionGrounds /> : null}
            {shouldShowDataAccess(value) && <DataAccess />}
          </>
        )}
      </FieldGroup>
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
