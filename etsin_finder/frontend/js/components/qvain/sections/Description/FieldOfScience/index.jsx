import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import Select from '@/components/qvain/general/V2/Select'
import { useStores } from '@/stores/stores'
import { FieldGroup, Title, InfoText, FieldWrapper } from '@/components/qvain/general/V2'

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
    return parentItems.map(group => ({
      label: group._source.label,
      url: group._source.uri,
      options: list
        .filter(ref => ref._source.parent_ids?.[0] === group._id)
        .map(ref => Model(ref._source.label, ref._source.uri)),
    }))
  }

  return (
    <FieldGroup>
      <FieldWrapper>
        <Title htmlFor="fieldOfScience-select">
          <Translate content="qvain.description.fieldOfScience.title" />
        </Title>
        <Select
          name="fieldOfScience"
          metaxIdentifier="field_of_science"
          isMulti
          isClearable={false}
          model={Model}
          getter={storage}
          setter={set}
          getRefGroups={getRefGroups}
          modifyOptionLabel={addCode}
          modifyGroupLabel={addCode}
          sortFunc={sortFunc}
          placeholder=""
        />
      </FieldWrapper>
      <Translate component={InfoText} content="qvain.description.fieldOfScience.infoText" />
    </FieldGroup>
  )
}

export default withFieldErrorBoundary(
  observer(FieldOfScienceField),
  'qvain.description.fieldOfScience.title'
)
