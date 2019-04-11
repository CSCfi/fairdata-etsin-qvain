import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import Card from '../general/card'

const licenseOptions = [
  { value: 'CC0', label: 'CC0', labelFi: 'CC0' },
  { value: 'PROPRIETARY', label: 'Proprietary', labelFi: 'Yksityinen' }
]

const licenseOptionsFi = licenseOptions.map(option => ({ ...option, label: option.labelFi }))

class License extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  render() {
    return (
      <Card>
        <Translate component="h3" content="qvain.rightsAndLicenses.license.title" />
        <Translate
          component={Select}
          name="license"
          options={this.props.Stores.Locale.lang === 'en' ? licenseOptions : licenseOptionsFi}
          clearable
          onChange={(license) => {
            this.props.Stores.Qvain.setLicence(license)
          }}
          onBlur={() => {}}
          attributes={{ placeholder: 'qvain.rightsAndLicenses.license.placeholder' }}
        />
      </Card>
    )
  }
}

export default inject('Stores')(observer(License))
