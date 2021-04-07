import React from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'

import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import Tooltip from '../../../../general/tooltipHover'
import Card from '../../../general/card'
import { LabelLarge } from '../../../general/modal/form'
import { useStores } from '../../../utils/stores'
import StringArray from '../../../general/input/stringArray'
import { keywordsSchema } from '../../../utils/formValidation'

const KeywordsField = () => {
  const {
    Qvain: {
      readonly,
      Keywords: {
        itemStr,
        setItemStr,
        set,
        addKeyword,
        storage,
        validationError,
        setValidationError,
      },
    },
  } = useStores()

  return (
    <Card>
      <LabelLarge htmlFor="keywords-input">
        <Translate
          component={Tooltip}
          attributes={{
            title: 'qvain.description.fieldHelpTexts.requiredToPublish',
          }}
          position="right"
        >
          <Translate content="qvain.description.keywords.title" /> *
        </Translate>
      </LabelLarge>
      <Translate component="p" content="qvain.description.keywords.help" />
      <StringArray
        id="keywords-input"
        itemStr={itemStr}
        setItemStr={setItemStr}
        addItemStr={addKeyword}
        value={storage}
        set={set}
        schema={keywordsSchema}
        addWithComma
        readonly={readonly}
        translationsRoot="qvain.description.keywords"
        validationError={validationError || ''}
        setValidationError={setValidationError}
        required
      />
    </Card>
  )
}

export default withFieldErrorBoundary(observer(KeywordsField), 'qvain.description.keywords.title')
