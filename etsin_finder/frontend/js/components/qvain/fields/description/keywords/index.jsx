import React from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'

import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import Tooltip from '../../../../general/tooltipHover'
import Card from '../../../general/card'
import { LabelLarge } from '../../../general/modal/form'
import StringArray from '../../../general/input/stringArray'

const KeywordsField = () => (
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
    <Translate component="p" content="qvain.description.keywords.infoText" />
    <StringArray id="keywords-input" fieldName="Keywords" addWithComma required />
  </Card>
)

export default withFieldErrorBoundary(observer(KeywordsField), 'qvain.description.keywords.title')
