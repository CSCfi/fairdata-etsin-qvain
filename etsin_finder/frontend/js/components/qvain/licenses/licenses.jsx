import React, { Component } from 'react'
import Select from 'react-select'
import Card from '../general/card'

const licenseOptions = [
  { value: 'CC0', label: 'CC0' },
  { value: 'PROPRIETARY', label: 'Proprietary' }
]

class RightsAndLicenses extends Component {
  render() {
    return (
      <Card>
        <h3>License</h3>
        <Select
          name="license"
          options={licenseOptions}
          placeholder="Select option"
          clearable
          onChange={() => {
            console.log('changed license')
          }}
          onBlur={() => {}}
        />
      </Card>
    )
  }
}

export default RightsAndLicenses
