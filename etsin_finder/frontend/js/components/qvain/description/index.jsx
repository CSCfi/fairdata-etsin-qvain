import React, { useState } from 'react'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import DescriptionField from './descriptionField'
import IssuedDateField from './issuedDateField'
import OtherIdentifierField from './otherIdentifierField'
import FieldOfScienceField from './fieldOfScienceField'
import LanguageField from './languageField'
import KeywordsField from './keywordsField'
import SubjectHeadingsField from './subjectHeadingsField'
import { SectionTitle } from '../general/section'
import Tooltip from '../general/tooltip'
import { HelpIcon } from '../general/form'
import DescriptionInfo from './descriptionInfo'

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
      <React.Fragment>
        {title}
        <DescriptionField />
        <IssuedDateField />
        <OtherIdentifierField />
        <FieldOfScienceField />
        <LanguageField />
        <KeywordsField />
        <SubjectHeadingsField />
      </React.Fragment>
    </div>
  )
}

export default Description
