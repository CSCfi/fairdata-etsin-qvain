import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import SearchSelect from '../../../general/input/searchSelect'
import Card from '../../../general/card'
import { LabelLarge } from '../../../general/modal/form'
import { useStores } from '../../../utils/stores'

const SubjectHeadingsField = () => {
  const {
    Qvain: {
      SubjectHeadings: { storage, set, Model },
    },
  } = useStores()
  return (
    <Card>
      <LabelLarge htmlFor="subjectHeading-select">
        <Translate content="qvain.description.subjectHeadings.title" />
      </LabelLarge>
      <Translate component="p" content="qvain.description.subjectHeadings.help" />

      <SearchSelect
        name="subjectHeading"
        metaxIdentifier="keyword"
        placeholder="qvain.description.subjectHeadings.placeholder"
        isMulti
        isClearable={false}
        model={Model}
        getter={storage}
        setter={set}
      />
    </Card>
  )
}

export default withFieldErrorBoundary(
  observer(SubjectHeadingsField),
  'qvain.description.subjectHeadings.title'
)
