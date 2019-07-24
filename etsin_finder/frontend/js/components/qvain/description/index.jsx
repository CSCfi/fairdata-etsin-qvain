import React, { useState } from 'react'
import Translate from 'react-translate-component'
import DescriptionFeild from './descriptionField';
import OtherIdentifierField from './otherIdentifierField';
import FieldOfScienceField from './fieldOfScienceField';
import KeywordsField from './keywordsField';
import { SectionTitle } from '../general/section'
import Tooltip from '../general/tooltip'
import { HelpIcon } from '../general/form'
import DescriptionInfo from './descriptionInfo'

const Description = () => {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <div className="container">
      <SectionTitle>
        <Translate content="qvain.description.title" />
        <Tooltip
          isOpen={tooltipOpen}
          close={() => setTooltipOpen(!tooltipOpen)}
          align="Right"
          text={<DescriptionInfo />}
        >
          <HelpIcon
            onClick={() => setTooltipOpen(!tooltipOpen)}
          />
        </Tooltip>
      </SectionTitle>
      <React.Fragment>
        <DescriptionFeild />
        <OtherIdentifierField />
        <FieldOfScienceField />
        <KeywordsField />
      </React.Fragment>
    </div>
  )
}

export default Description;
