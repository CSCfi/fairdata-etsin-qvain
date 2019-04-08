import React, { Component } from 'react'
import Translation from 'react-translate-component'
import Select from 'react-select'
import Card from '../general/card'

const accessOptions = [
  { value: "OPEN", label: "Open" },
  { value: "CLOSED", label: "Closed" }
]

class AccessType extends Component {

  render() {
    return (
      <Card>
        <h3>Access type</h3>
        <Select
          name="accessType"
          options={accessOptions}
          placeholder="Select option"
          clearable={true}
          onChange={() => {
            console.log("changed access type")
          }}
          onBlur={() => {}}>
        </Select>
      </Card>
    )
  }
}

export default AccessType
