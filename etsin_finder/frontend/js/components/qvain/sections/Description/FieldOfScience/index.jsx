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

  const getRefGroups = options => {
    const parentItems = options.filter(opt => opt.parents.length === 0)
    return parentItems.map(group => ({
      ...Model(group.label, group.value),
      options: options
        .filter(opt => opt.parents?.[0] === group.id)
        .map(opt => Model(opt.label, opt.value)),
    }))
  }

  return (
    <FieldGroup data-cy="field-of-science-select">
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
