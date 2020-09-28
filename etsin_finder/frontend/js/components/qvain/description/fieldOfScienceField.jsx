import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'

import Select from '../general/input/select'
import Card from '../general/card'
import { LabelLarge } from '../general/modal/form'

class FieldOfScienceField extends React.Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  render() {
    const { storage, set, Model } = this.props.Stores.Qvain.FieldOfSciences

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
          model={Model}
          getter={storage}
          setter={set}
        />
      </Card>
    )
  }
}

export default inject('Stores')(observer(FieldOfScienceField))
