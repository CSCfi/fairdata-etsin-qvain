import React, { Component } from 'react'
import Translation from 'react-translate-component'
import Select from 'react-select'
import Card from '../general/card'

const licenseOptions = [
  { value: "CC0", label: "CC0" },
  { value: "PROPRIETARY", label: "Proprietary" }
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
          clearable={true}
          onChange={() => {
            console.log("changed license")
          }}
          onBlur={() => {}}>
        </Select>
      </Card>
    )
  }
}

export default RightsAndLicenses
