import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from 'react-select';

import Card from '../general/card';

const scienceOptions = [
  { value: 'PHYSICS', label: 'Physics' },
  { value: 'MEDICINE', label: 'Medicine' }
]

class FieldOfScienceField extends React.Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  render() {
    return (
      <Card>
        <h3>Field on Science</h3>
        <Select
          name="field-of-science"
          placeholder="Select option"
          options={scienceOptions}
          className="basic-single"
          classNamePrefix="select"
          onChange={(fieldOfScience) => {
            this.props.Stores.Qvain.setFieldOfScience(fieldOfScience)
          }}
        />
      </Card>
    )
  }
}

export default inject('Stores')(observer(FieldOfScienceField));
