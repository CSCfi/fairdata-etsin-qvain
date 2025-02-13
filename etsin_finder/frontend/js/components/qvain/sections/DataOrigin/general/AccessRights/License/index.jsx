import React, { Component } from 'react'
import { observer } from 'mobx-react'
import styled, { withTheme } from 'styled-components'
import PropTypes from 'prop-types'
import CreatableSelect from 'react-select/creatable'
import Translate from '@/utils/Translate'

import { FieldGroup, TitleSmall, InfoText } from '@/components/qvain/general/V2'
import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import {
  onChangeMulti,
  getOptionLabel,
  getOptionValue,
  sortOptions,
  autoSortOptions,
  getCurrentOption,
} from '@/components/qvain/utils/select'
import { ValidationError } from '@/components/qvain/general/errors/validationError'
import { withStores } from '@/stores/stores'
import AbortClient, { isAbort } from '@/utils/AbortClient'

export class License extends Component {
  client = new AbortClient()

  static propTypes = {
    Stores: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  }

  state = {
    options: [],
    licenseErrors: {},
  }

  componentDidMount = () => {
    const { Model } = this.props.Stores.Qvain.Licenses
    const { lang } = this.props.Stores.Locale
    this.props.Stores.Qvain.ReferenceData.getOptions('license', { client: this.client })
      .then(opts => {
        const options = opts.map(ref => Model(ref.label, ref.value))
        sortOptions(Model, lang, options)
        this.setState({
          options,
        })
        autoSortOptions(this, this.props.Stores.Locale, Model)
      })
      .catch(error => {
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
      })
  }

  componentWillUnmount() {
    this.client.abort()
  }

  validateLicenses = () => {
    const { storage, schema } = this.props.Stores.Qvain.Licenses
    const licenseErrors = {}
    storage.forEach(license => {
      const validationObject = { ...license }
      try {
        schema.validateSync(validationObject)
      } catch (err) {
        licenseErrors[license.identifier || license.otherLicenseUrl] = err.message
      }
    })
    this.setState({ licenseErrors })
  }

  onChange = values => {
    const { set } = this.props.Stores.Qvain.Licenses
    onChangeMulti(set)(values)
    this.validateLicenses()
  }

  createLicense = url => {
    const custom = this.props.Stores.Qvain.Licenses.CustomLicenseModel(
      { fi: `Muu (URL): ${url}`, en: `Other (URL): ${url}` },
      url
    )
    return { ...custom, identifier: url }
  }

  render() {
    const { options, licenseErrors } = this.state
    const { lang } = this.props.Stores.Locale
    const { storage, readonly, Model } = this.props.Stores.Qvain.Licenses

    // allow wrap for long license labels
    const styles = {
      multiValue: (style, state) => {
        if (this.state.licenseErrors[state.data.identifier]) {
          return {
            ...style,
            background: this.props.theme.color.error,
            color: 'white',
          }
        }
        return style
      },
      multiValueLabel: style => ({
        ...style,
        whiteSpace: 'normal',
        color: 'inherit',
      }),
    }

    return (
      <FieldGroup data-cy="license-select">
        <TitleSmall htmlFor="licenseSelect">
          <Translate content="qvain.rightsAndLicenses.license.title" />
        </TitleSmall>
        <Translate
          component={CreatableSelect}
          inputId="licenseSelect"
          name="license"
          isDisabled={readonly}
          getOptionLabel={getOptionLabel(Model, lang)}
          getOptionValue={getOptionValue(Model)}
          value={getCurrentOption(Model, options, storage)}
          options={options}
          isMulti
          isClearable={false}
          onChange={this.onChange}
          createOptionPosition="first"
          getNewOptionData={this.createLicense}
          attributes={{
            placeholder: 'qvain.rightsAndLicenses.license.placeholder',
          }}
          styles={styles}
          aria-autocomplete="list"
        />
        <Translate component={InfoText} content="qvain.rightsAndLicenses.license.infoText" />
        {licenseErrors && (
          <Errors>
            {Object.entries(licenseErrors).map(([url, err]) => (
              <ErrorRow key={url}>
                <ErrorLabel>{url}:</ErrorLabel>
                <ValidationError>{err}</ValidationError>
              </ErrorRow>
            ))}
          </Errors>
        )}
      </FieldGroup>
    )
  }
}

const Errors = styled.div`
  color: ${props => props.theme.color.redText};
  margin-top: 0.5rem;
  p {
    margin: 0;
    display: inline;
  }
`

const ErrorRow = styled.div``

export const ErrorLabel = styled.span`
  margin-right: 0.5rem;
`

export default withFieldErrorBoundary(
  withStores(observer(withTheme(License))),
  'qvain.rightsAndLicenses.license.title'
)
