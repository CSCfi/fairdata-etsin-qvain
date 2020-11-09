import React from 'react'
import translate from 'counterpart'
import Translate from 'react-translate-component'

import Tooltip from '../../../../general/tooltipHover'
import { LabelLarge } from '../../../general/modal/form'

const ActorTitle = () => (
  <LabelLarge>
    <Tooltip
      title={translate('qvain.description.fieldHelpTexts.requiredToPublish')}
      position="right"
    >
      <Translate content="qvain.actors.added.title" /> *
    </Tooltip>
  </LabelLarge>
)

export default ActorTitle
