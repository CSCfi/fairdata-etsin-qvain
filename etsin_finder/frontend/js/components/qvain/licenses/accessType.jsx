import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import Card from '../general/card'

const accessOptions = [
  { value: 'OPEN', label: 'Open' },
  { value: 'CLOSED', label: 'Closed' }
]

class AccessType extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  render() {
    return (
      <Card>
        <h3>Access type</h3>
        <Select
          name="accessType"
          options={accessOptions}
          placeholder="Select option"
          clearable
          onChange={(accessType) => {
            this.props.Stores.Qvain.accessType = accessType
          }}
          onBlur={() => {}}
        />
      </Card>
    )
  }
}

export default inject('Stores')(observer(AccessType))
