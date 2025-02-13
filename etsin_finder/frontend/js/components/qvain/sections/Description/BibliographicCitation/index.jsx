import React from 'react'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'

import {
  FieldGroup,
  FieldWrapper,
  Title,
  FieldInput,
  InfoText,
} from '@/components/qvain/general/V2'
import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'

const CitationField = () => {
  const {
    Qvain: {
      BibliographicCitation: { value, set },
    },
  } = useStores()

  return (
    <FieldGroup>
      <FieldWrapper>
        <Title htmlFor="citation-input">
          <Translate content="qvain.description.bibliographicCitation.title" />
        </Title>
        <Translate
          component={FieldInput}
          type="text"
          id="citation-input"
          value={value || ''}
          onChange={event => {
            set(event.target.value)
          }}
        />
      </FieldWrapper>
      <Translate component={InfoText} content="qvain.description.bibliographicCitation.infoText" />
    </FieldGroup>
  )
}

export default withFieldErrorBoundary(
  observer(CitationField),
  'qvain.description.bibliographicCitation.title'
)
