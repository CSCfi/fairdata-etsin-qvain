import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import getReferenceData from '../utils/getReferenceData'
import Card from '../general/card'
import RestrictionGrounds from './resctrictionGrounds'
import { accessTypeSchema } from '../utils/formValidation'
import ValidationError from '../general/validationError'
import EmbargoExpires from './embargoExpires'
import { onChange, getCurrentValue } from '../utils/select'
import { AccessType as AccessTypeConstructor } from '../../../stores/view/qvain'
import { AccessTypeURLs } from '../utils/constants'
import { LabelLarge, HelpField } from '../general/form'

export class AccessType extends Component {
  promises = []

  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    options: {
      en: [],
      fi: [],
    },
    accessTypeValidationError: null,
  }

  componentDidMount = () => {
    this.promises.push(
      getReferenceData('access_type')
        .then((res) => {
          const list = res.data.hits.hits
          let refsEn = list.map((ref) => ({
            value: ref._source.uri,
            label: ref._source.label.en,
          }))
          let refsFi = list.map((ref) => ({
            value: ref._source.uri,
            label: ref._source.label.fi,
          }))

          const user = this.props.Stores.Auth.user

          if (!user.isUsingRems) {
            refsFi = refsFi.filter((ref) => ref.value !== AccessTypeURLs.RESTRICTED)
            refsEn = refsEn.filter((ref) => ref.value !== AccessTypeURLs.RESTRICTED)
          }

          this.setState({
            options: {
              en: refsEn,
              fi: refsFi,
            },
          })
        })
        .catch((error) => {
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
    this.promises.forEach((promise) => promise && promise.cancel && promise.cancel())
  }

  handleChange = (selection) => {
    const { lang } = this.props.Stores.Locale
    const { options } = this.state
    const { setAccessType } = this.props.Stores.Qvain
    onChange(options, lang, setAccessType, AccessTypeConstructor)(selection)
    this.setState({ accessTypeValidationError: null })
  }

  handleBlur = () => {
    accessTypeSchema
      .validate(this.props.Stores.Qvain.accessType)
      .then(() => {
        this.setState({ accessTypeValidationError: null })
      })
      .catch((err) => {
        this.setState({ accessTypeValidationError: err.errors })
      })
  }

  render() {
    const { lang } = this.props.Stores.Locale
    const { options } = this.state
    const { accessType, readonly } = this.props.Stores.Qvain

    let permitInfo = null
    if (
      accessType &&
      accessType.url === 'http://uri.suomi.fi/codelist/fairdata/access_type/code/permit'
    ) {
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
          options={this.state.options[lang]}
          clearable
          isDisabled={readonly}
          value={
            getCurrentValue(accessType, options, lang) // access is OPEN by default - 28.5.2019
          }
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          attributes={{
            placeholder: 'qvain.rightsAndLicenses.accessType.placeholder',
          }}
        />
        {permitInfo}
        <ValidationError>{this.state.accessTypeValidationError}</ValidationError>
        {accessType !== undefined && accessType.url === AccessTypeURLs.EMBARGO && (
          <EmbargoExpires />
        )}
        {accessType.url !== AccessTypeURLs.OPEN ? <RestrictionGrounds /> : null}
      </Card>
    )
  }
}

const PermitHelp = styled.div`
  margin-top: 0.5rem;
`

export default inject('Stores')(observer(AccessType))
