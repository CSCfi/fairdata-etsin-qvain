import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withTheme } from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import CreatableSelect from 'react-select/creatable'

import getReferenceData from '../../utils/getReferenceData'
import Card from '../../general/card'
import { LabelLarge } from '../../general/modal/form'
import { License as LicenseConstructor } from '../../../../stores/view/qvain'
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
    this.promises.push(
      getReferenceData('license')
        .then(res => {
          const list = res.data.hits.hits
          const options = list.map(ref => LicenseConstructor(ref._source.label, ref._source.uri))
          const { lang } = this.props.Stores.Locale
          sortOptions(LicenseConstructor, lang, options)
          this.setState({
            options,
          })
          autoSortOptions(this, this.props.Stores.Locale, LicenseConstructor)
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
    this.props.Stores.Qvain.removeLicense(license)
  }

  validateLicenses = () => {
    const { licenseArray } = this.props.Stores.Qvain
    const licenseErrors = {}
    licenseArray.forEach(license => {
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
    const { setLicenseArray } = this.props.Stores.Qvain
    onChangeMulti(setLicenseArray)(values)
    this.validateLicenses()
  }

  createLicense = url =>
    LicenseConstructor({ fi: `Muu (URL): ${url}`, en: `Other (URL): ${url}` }, url)

  render() {
    const { options, licenseErrors } = this.state
    const { lang } = this.props.Stores.Locale
    const { licenseArray, readonly } = this.props.Stores.Qvain

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
          getOptionLabel={getOptionLabel(LicenseConstructor, lang)}
          getOptionValue={getOptionValue(LicenseConstructor)}
          value={getCurrentOption(LicenseConstructor, options, licenseArray)}
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

export default withTheme(inject('Stores')(observer(License)))
