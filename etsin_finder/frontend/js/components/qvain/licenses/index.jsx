import React, { Component } from 'react'
import Translation from 'react-translate-component'
import Select from '../../general/select'

const accessOptions = [
  { value: "OPEN", label: "Open" },
  { value: "CLOSED", label: "Closed" }
]

const licenseOptions = [
  { value: "CC0", label: "CC0" },
  { value: "PROPRIETARY", label: "Proprietary" }
]

class RightsAndLicenses extends Component {

  render() {
    return (
      <React.Fragment>
        <h1>Rights And Licenses</h1>
        <div>
          <h3>Access Type</h3>
          <Select
            name="accessType"
            options={accessOptions}
            placeholder="Choose option"
            clearable={true}
            onChange={() => {
              console.log("changed access type")
            }}
            onBlur={() => {}}>
          </Select>
        </div>
        <div>
          <h3>License</h3>
          <Select
            name="license"
            options={licenseOptions}
            placeholder="Choose option"
            clearable={true}
            onChange={() => {
              console.log("changed license")
            }}
            onBlur={() => {}}>
          </Select>
        </div>
      </React.Fragment>
    )
  }
}

export default RightsAndLicenses
