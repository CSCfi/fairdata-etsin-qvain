import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import {
  FieldGroup,
  FieldWrapper,
  Title,
  InfoText,
  Required,
  RequiredText,
} from '@/components/qvain/general/V2'
import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import StringArray from '@/components/qvain/general/V2/StringArray'

const KeywordsField = () => (
  <FieldGroup>
    <FieldWrapper>
      <Title htmlFor="keywords-input">
        <Translate content="qvain.description.keywords.title" />
        <Required />
      </Title>
      <StringArray id="keywords-input" fieldName="Keywords" addWithComma hideButton required />
    </FieldWrapper>
    <RequiredText weight={3} />
    <Translate component={InfoText} content="qvain.description.keywords.infoText" />
  </FieldGroup>
)

export default withFieldErrorBoundary(observer(KeywordsField), 'qvain.description.keywords.title')
