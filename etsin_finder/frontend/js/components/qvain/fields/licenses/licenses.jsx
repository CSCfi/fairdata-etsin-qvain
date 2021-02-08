import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withTheme } from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import CreatableSelect from 'react-select/creatable'

import { withFieldErrorBoundary } from '../../general/errors/fieldErrorBoundary'
import getReferenceData from '../../utils/getReferenceData'
import Card from '../../general/card'
import { LabelLarge } from '../../general/modal/form'
import { licenseSchema } from '../../utils/formValidation'
import {
  onChangeMulti,
  getCurrentOption,
  getOptionLabel,
  getOptionValue,
  sortOptions,
  autoSortOptions,
} from '../../utils/select'
import { ValidationErrors } from '../../general/errors/validationError'
import { withStores } from '../../utils/stores'

export class License extends Component {
  promises = []

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
    this.promises.push(
      getReferenceData('license')
        .then(res => {
          const list = res.data.hits.hits
          const options = list.map(ref => Model(ref._source.label, ref._source.uri))
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

  removeLicense = license => {
    this.props.Stores.Qvain.Licenses.remove(license)
  }

  validateLicenses = () => {
    const { storage } = this.props.Stores.Qvain.Licenses
    const licenseErrors = {}
    storage.forEach(license => {
      const { identifier, name } = license
      const validationObject = { identifier, name, otherLicenseUrl: identifier }
      try {
        licenseSchema.validateSync(validationObject)
      } catch (err) {
        licenseErrors[identifier] = err.message
      }
    })
    this.setState({ licenseErrors })
  }

  onChange = values => {
    const { set } = this.props.Stores.Qvain.Licenses
    onChangeMulti(set)(values)
    this.validateLicenses()
  }

  createLicense = url =>
    this.props.Stores.Qvain.Licenses.Model(
      { fi: `Muu (URL): ${url}`, en: `Other (URL): ${url}` },
      url
    )

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
      <Card>
        <LabelLarge htmlFor="licenseSelect">
          <Translate content="qvain.rightsAndLicenses.license.title" />
        </LabelLarge>
        <Translate component="p" content="qvain.rightsAndLicenses.license.infoText" />
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
          attributes={{ placeholder: 'qvain.rightsAndLicenses.license.placeholder' }}
          styles={styles}
        />
        {licenseErrors && (
          <ValidationErrors
            errors={Object.entries(licenseErrors).map(([url, err]) => `${url}: ${err}`)}
          />
        )}
      </Card>
    )
  }
}

export default withFieldErrorBoundary(
  withTheme(withStores(observer(License))),
  'qvain.rightsAndLicenses.license.title'
)
