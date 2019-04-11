import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from 'react-select';
import Translate from 'react-translate-component'

import Card from '../general/card';

const scienceOptions = [
  { value: 'PHYSICS', label: 'Physics', labelFi: 'Fysiikka' },
  { value: 'MEDICINE', label: 'Medicine', labelFi: 'Lääketiede' }
]

const scienceOptionsFi = scienceOptions.map(option => ({ ...option, label: option.labelFi }))

class FieldOfScienceField extends React.Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  render() {
    return (
      <Card>
        <Translate component="h3" content="qvain.description.fieldOfScience.title" />
        <Translate
          name="field-of-science"
          component={Select}
          attributes={{ placeholder: 'qvain.description.fieldOfScience.placeholder' }}
          className="basic-single"
          classNamePrefix="select"
          options={this.props.Stores.Locale.lang === 'en' ? scienceOptions : scienceOptionsFi}
          onChange={(fieldOfScience) => {
            this.props.Stores.Qvain.setFieldOfScience(fieldOfScience)
          }}
        />
      </Card>
    )
  }
}

export default inject('Stores')(observer(FieldOfScienceField));
