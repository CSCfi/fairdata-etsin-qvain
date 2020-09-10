import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'

import Select from '../general/select'
import Card from '../general/card'
import { FieldOfScience } from '../../../stores/view/qvain'
import { LabelLarge } from '../general/form'

class FieldOfScienceField extends React.Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  render() {
    const { fieldOfScienceArray, setFieldOfScienceArray } = this.props.Stores.Qvain

    return (
      <Card>
        <LabelLarge htmlFor="fieldOfScienceSelect">
          <Translate content="qvain.description.fieldOfScience.title" />
        </LabelLarge>
        <Translate component="p" content="qvain.description.fieldOfScience.help" />
        <Translate
          name="fieldOfScienceSelect"
          metaxIdentifier="field_of_science"
          component={Select}
          attributes={{ placeholder: 'qvain.description.fieldOfScience.placeholder' }}
          isMulti
          isClearable={false}
          model={FieldOfScience}
          getter={fieldOfScienceArray}
          setter={setFieldOfScienceArray}
        />
      </Card>
    )
  }
}

export default inject('Stores')(observer(FieldOfScienceField))
