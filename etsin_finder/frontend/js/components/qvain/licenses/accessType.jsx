import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'
import Translate from 'react-translate-component'
import Card from '../general/card'

const accessOptions = [
  { value: 'OPEN', label: 'Open', labelFi: 'Avoin' },
  { value: 'CLOSED', label: 'Closed', labelFi: 'Suljettu' }
]

const accessOptionsFi = accessOptions.map(option => ({ ...option, label: option.labelFi }))

class AccessType extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  render() {
    return (
      <Card>
        <Translate component="h3" content="qvain.rightsAndLicenses.accessType.title" />
        <Translate
          component={Select}
          name="accessType"
          options={this.props.Stores.Locale.lang === 'en' ? accessOptions : accessOptionsFi}
          clearable
          onChange={(accessType) => {
            this.props.Stores.Qvain.accessType = accessType
          }}
          onBlur={() => {}}
          attributes={{
            placeholder: 'qvain.rightsAndLicenses.accessType.placeholder'
          }}
        />
      </Card>
    )
  }
}

export default inject('Stores')(observer(AccessType))
