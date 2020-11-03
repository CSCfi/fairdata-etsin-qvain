import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import Select from '../general/input/select'
import Card from '../general/card'
import { LabelLarge } from '../general/modal/form'
import { useStores } from '../utils/stores'

const FieldOfScienceField = () => {
  const {
    Qvain: {
      FieldOfSciences: { storage, set, Model },
    },
  } = useStores()

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

export default observer(FieldOfScienceField)
