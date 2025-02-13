import React from 'react'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import SearchSelect from '@/components/qvain/general/V2/SearchSelect'
import { useStores } from '@/stores/stores'
import { FieldGroup, FieldWrapper, Title, InfoText } from '@/components/qvain/general/V2'

const SubjectHeadingsField = () => {
  const {
    Qvain: {
      SubjectHeadings: { storage, set, Model },
    },
  } = useStores()
  return (
    <FieldGroup data-cy="subject-heading-select">
      <FieldWrapper>
        <Title htmlFor="subjectHeading-select">
          <Translate content="qvain.description.subjectHeadings.title" />
        </Title>

        <SearchSelect
          name="subjectHeading"
          metaxIdentifier="keyword"
          isMulti
          isClearable={false}
          model={Model}
          getter={storage}
          setter={set}
        />
      </FieldWrapper>
      <Translate component={InfoText} content="qvain.description.subjectHeadings.infoText" />
    </FieldGroup>
  )
}

export default withFieldErrorBoundary(
  observer(SubjectHeadingsField),
  'qvain.description.subjectHeadings.title'
)
