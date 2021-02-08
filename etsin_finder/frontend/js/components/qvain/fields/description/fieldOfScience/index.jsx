import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import Select from '../../../general/input/select'
import Card from '../../../general/card'
import { LabelLarge } from '../../../general/modal/form'
import { useStores } from '../../../utils/stores'

const addCode = (translation, item) => {
  // parse code number from url, append to label, e.g. "116 Chemical sciences"
  const codeMatch = /\d+$/.exec(item.url)
  if (codeMatch?.[0]) {
    return `${codeMatch[0]} ${translation}`
  }
  return translation
}

// urls differ only by code number, so use them to sort by code number
const sortFunc = (a, b) => a.url.localeCompare(b.url)

const FieldOfScienceField = () => {
  const {
    Qvain: {
      FieldOfSciences: { storage, set, Model },
    },
  } = useStores()

  const getRefGroups = list => {
    const parentItems = list.filter(ref => ref._source.parent_ids.length === 0)
    const groups = parentItems.map(group => ({
      label: group._source.label,
      url: group._source.uri,
      options: list
        .filter(ref => ref._source.parent_ids?.[0] === group._id)
        .map(ref => Model(ref._source.label, ref._source.uri)),
    }))
    return groups
  }

  return (
    <Card>
      <LabelLarge htmlFor="fieldOfScience-select">
        <Translate content="qvain.description.fieldOfScience.title" />
      </LabelLarge>
      <Translate component="p" content="qvain.description.fieldOfScience.help" />
      <Translate
        name="fieldOfScience"
        metaxIdentifier="field_of_science"
        component={Select}
        attributes={{ placeholder: 'qvain.description.fieldOfScience.placeholder' }}
        isMulti
        isClearable={false}
        model={Model}
        getter={storage}
        setter={set}
        getRefGroups={getRefGroups}
        modifyOptionLabel={addCode}
        modifyGroupLabel={addCode}
        sortFunc={sortFunc}
      />
    </Card>
  )
}

export default withFieldErrorBoundary(
  observer(FieldOfScienceField),
  'qvain.description.fieldOfScience.title'
)
