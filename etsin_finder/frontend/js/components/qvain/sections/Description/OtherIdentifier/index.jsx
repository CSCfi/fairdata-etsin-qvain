import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import StringArray from '@/components/qvain/general/V2/StringArray'
import { FieldGroup, FieldWrapper, Title, InfoText } from '@/components/qvain/general/V2'

const OtherIdentifierField = () => (
  <FieldGroup>
    <FieldWrapper>
      <Title htmlFor="other-identifiers-input">
        <Translate content="qvain.description.otherIdentifiers.title" />
      </Title>
      <StringArray
        id="other-identifiers-input"
        fieldName="OtherIdentifiers"
        hideButton
        addWithComma
      />
    </FieldWrapper>
    <Translate
      weight={2.5}
      component={InfoText}
      content="qvain.description.otherIdentifiers.instructions"
    />
  </FieldGroup>
)

export default withFieldErrorBoundary(
  observer(OtherIdentifierField),
  'qvain.description.otherIdentifiers.title'
)
