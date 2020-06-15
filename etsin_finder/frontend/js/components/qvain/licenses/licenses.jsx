import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import getReferenceData from '../utils/getReferenceData'
import Card from '../general/card'
import { Label, Input, LabelLarge } from '../general/form'
import { License as LicenseConstructor } from '../../../stores/view/qvain'
import { onChange, getCurrentValue } from '../utils/select'
import { licenseSchema } from '../utils/formValidation'
import ValidationError from '../general/validationError'

const otherOptValue = 'other'

const otherOptLabel = locale => {
  const labels = {
    en: 'Other (URL)',
    fi: 'Muu (URL)',
  }
  return labels[locale]
}

const otherOpt = locale => ({
  value: otherOptValue,
  label: otherOptLabel(locale),
})

export class License extends Component {
  promises = []

  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    options: {
      en: [],
      fi: [],
    },
    errorMessage: undefined,
  }

  componentDidMount = () => {
    const { license, setLicenseName } = this.props.Stores.Qvain
    this.promises.push(getReferenceData('license')
      .then(res => {
        const list = res.data.hits.hits
        const refsEn = list.map(ref => ({
          value: ref._source.uri,
          label: ref._source.label.en,
        }))
        const refsFi = list.map(ref => ({
          value: ref._source.uri,
          label: ref._source.label.fi || ref._source.label.en, // use english label when finnish is not available
        }))
        refsEn.push(otherOpt('en'))
        refsFi.push(otherOpt('fi'))
        this.setState({
          options: {
            en: refsEn,
            fi: refsFi,
          },
        })
        if (license && license.identifier) {
          setLicenseName({
            en: refsEn.find(opt => opt.value === license.identifier).label,
            fi: refsFi.find(opt => opt.value === license.identifier).label,
          })
        }
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

  handleOnBlur = () => {
    const { otherLicenseUrl, idaPickerOpen } = this.props.Stores.Qvain
    const { identifier, name } = this.props.Stores.Qvain.license
    const validationObject = { idaPickerOpen, identifier, name, otherLicenseUrl }
    licenseSchema
      .validate(validationObject)
      .then(() => {
        this.setState({
          errorMessage: undefined,
        })
      })
      .catch(err => {
        this.setState({
          errorMessage: err.errors,
        })
      })
  }

  render() {
    const { options, errorMessage } = this.state
    const { lang } = this.props.Stores.Locale
    const { license, setLicense, otherLicenseUrl, readonly } = this.props.Stores.Qvain
    return (
      <Card>
        <LabelLarge htmlFor="licenseSelect">
          <Translate content="qvain.rightsAndLicenses.license.title" />
        </LabelLarge>
        <Translate
          component={Select}
          inputId="licenseSelect"
          name="license"
          isDisabled={readonly}
          value={getCurrentValue(license, options, lang)}
          options={options[lang]}
          isClearable
          onChange={onChange(options, lang, setLicense, LicenseConstructor)}
          onBlur={() => { }}
          attributes={{ placeholder: 'qvain.rightsAndLicenses.license.placeholder' }}
        />
        {license && license.identifier === otherOptValue && (
          <Fragment>
            <Translate
              htmlFor="otherLicenseURL"
              component={Label}
              content="qvain.rightsAndLicenses.license.other.label"
              style={{ marginTop: '20px' }}
            />
            <Input
              id="otherLicenseURL"
              disabled={readonly}
              value={otherLicenseUrl}
              onChange={event => {
                this.props.Stores.Qvain.otherLicenseUrl = event.target.value
              }}
              placeholder="https://"
              onBlur={this.handleOnBlur}
            />
            {errorMessage && <ValidationError>{errorMessage}</ValidationError>}
            <Translate component="p" content="qvain.rightsAndLicenses.license.other.help" />
          </Fragment>
        )}
      </Card>
    )
  }
}

export default inject('Stores')(observer(License))
