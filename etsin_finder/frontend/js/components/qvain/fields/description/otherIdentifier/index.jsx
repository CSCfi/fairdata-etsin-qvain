import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import Card from '../../../general/card'
import { LabelLarge } from '../../../general/modal/form'
import StringArray from '../../../general/input/stringArray'

const OtherIdentifierField = () => (
  <Card bottomContent>
    <LabelLarge htmlFor="other-identifiers-input">
      <Translate content="qvain.description.otherIdentifiers.title" />
    </LabelLarge>
    <Translate component="p" content="qvain.description.otherIdentifiers.instructions" />
    <StringArray id="other-identifiers-input" fieldName="OtherIdentifiers" addWithComma />
  </Card>
)

export default withFieldErrorBoundary(
  observer(OtherIdentifierField),
  'qvain.description.otherIdentifiers.title'
)
