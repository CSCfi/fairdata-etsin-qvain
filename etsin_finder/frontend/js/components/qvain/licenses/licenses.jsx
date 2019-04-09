import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import Card from '../general/card'

const licenseOptions = [
  { value: 'CC0', label: 'CC0' },
  { value: 'PROPRIETARY', label: 'Proprietary' }
]

class License extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  render() {
    return (
      <Card>
        <h3>License</h3>
        <Select
          name="license"
          options={licenseOptions}
          placeholder="Select option"
          clearable
          onChange={(license) => {
            this.props.Stores.Qvain.setLicence(license)
          }}
          onBlur={() => {}}
        />
      </Card>
    )
  }
}

export default inject('Stores')(observer(License))
