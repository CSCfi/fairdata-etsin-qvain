import React, { useState } from 'react'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import DescriptionField from './titleAndDescription'
import IssuedDateField from './issuedDate'
import OtherIdentifierField from './otherIdentifier'
import FieldOfScienceField from './fieldOfScience'
import LanguageField from './language'
import KeywordsField from './keywords'
import { SectionTitle } from '../../general/section'
import Tooltip from '../../general/section/tooltip'
import { HelpIcon } from '../../general/modal/form'
import DescriptionInfo from './descriptionInfo'
import SubjectHeadings from './subjectHeadings'

const Description = () => {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const title = (
    <SectionTitle>
      <Translate content="qvain.description.title" />
      <Tooltip
        isOpen={tooltipOpen}
        close={() => setTooltipOpen(!tooltipOpen)}
        align="Right"
        text={<DescriptionInfo />}
      >
        <HelpIcon
          aria-label={translate('qvain.description.infoTitle')}
          onClick={() => setTooltipOpen(!tooltipOpen)}
        />
      </Tooltip>
    </SectionTitle>
  )

  return (
    <div className="container">
      {title}
      <DescriptionField />
      <IssuedDateField />
      <OtherIdentifierField />
      <FieldOfScienceField />
      <LanguageField />
      <KeywordsField />
      <SubjectHeadings />
    </div>
  )
}

export default Description
