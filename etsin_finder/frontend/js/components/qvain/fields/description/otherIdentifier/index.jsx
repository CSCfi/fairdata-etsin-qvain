import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import Card from '../../../general/card'
import { otherIdentifiersArraySchema, otherIdentifierSchema } from '../../../utils/formValidation'
import { LabelLarge } from '../../../general/modal/form'
import { useStores } from '../../../utils/stores'
import StringArray from '../../../general/input/stringArray'

const OtherIdentifierField = () => {
  const {
    Qvain: {
      OtherIdentifiers: {
        storage,
        itemStr,
        addItemStr,
        setItemStr,
        set,
        readonly,
        validationError,
        setValidationError,
      },
    },
  } = useStores()

  return (
    <Card bottomContent>
      <LabelLarge htmlFor="other-identifiers-input">
        <Translate content="qvain.description.otherIdentifiers.title" />
      </LabelLarge>
      <Translate component="p" content="qvain.description.otherIdentifiers.instructions" />
      <StringArray
        id="other-identifiers-input"
        itemStr={itemStr}
        setItemStr={setItemStr}
        addItemStr={addItemStr}
        itemSchema={otherIdentifierSchema}
        value={storage}
        set={set}
        schema={otherIdentifiersArraySchema}
        addWithComma
        readonly={readonly}
        translationsRoot="qvain.description.otherIdentifiers"
        validationError={validationError || ''}
        setValidationError={setValidationError}
      />
    </Card>
  )
}

export default withFieldErrorBoundary(
  observer(OtherIdentifierField),
  'qvain.description.otherIdentifiers.title'
)
