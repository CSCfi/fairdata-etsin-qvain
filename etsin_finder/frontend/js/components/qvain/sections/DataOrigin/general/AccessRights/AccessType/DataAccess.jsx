import { observer } from 'mobx-react'
import React, { useState } from 'react'

import { FieldGroup, InfoText, TitleSmall } from '@/components/qvain/general/V2'
import { ExpandCollapse } from '@/components/qvain/general/V2/ExpandCollapse'
import TranslationTab from '@/components/qvain/general/V3/tab/TranslationTab.v3'
import ValidationError from '@/components/qvain/general/errors/validationError'
import { useStores } from '@/stores/stores'
import { DATA_CATALOG_IDENTIFIER } from '@/utils/constants'
import DataAccessTextArea from './DataAccessTextArea'
import REMSApprovalType from './REMSApprovalType'

const DataAccess = () => {
  const {
    Locale: { translate, lang },
    Qvain: {
      DataAccess: {
        applicationInstructions,
        reviewerInstructions,
        terms,
        remsApprovalType,
        validationError,
      },
      dataCatalog,
      isREMSAllowed,
    },
    Env: {
      Flags: { flagEnabled },
    },
  } = useStores()
  const [language, setLanguage] = useState(lang)

  // Expand if some field has value
  const hasValue = () =>
    [applicationInstructions, reviewerInstructions, terms].some(v => v.value.fi || v.value.en) ||
    remsApprovalType.value
  const [isExpanded, setIsExpanded] = useState(hasValue)

  if (!flagEnabled('QVAIN.REMS')) {
    return null
  }

  const handleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const isRemote = dataCatalog === DATA_CATALOG_IDENTIFIER.ATT

  return (
    <FieldGroup data-cy="data-access">
      <div>&nbsp;</div>
      <div>
        <ExpandCollapse
          isExpanded={isExpanded}
          onClick={handleExpand}
          aria-controls="data-access-fields"
          data-testid="toggle-data-access"
        />
        <TitleSmall onClick={handleExpand}>
          {translate('qvain.rightsAndLicenses.dataAccess.title')}
        </TitleSmall>
      </div>
      {isExpanded && (
        <div id="data-access-fields" data-testid="data-access-fields">
          {isRemote && (
            <InfoText>
              {translate('qvain.rightsAndLicenses.dataAccess.remoteResourcesInfo')}
            </InfoText>
          )}
          <TranslationTab language={language} setLanguage={setLanguage}>
            <DataAccessTextArea
              id="data-access-application-instructions"
              title="qvain.rightsAndLicenses.dataAccess.applicationInstructions"
              language={language}
              field={applicationInstructions}
            />
            <DataAccessTextArea
              id="data-access-reviewer-instructions"
              title="qvain.rightsAndLicenses.dataAccess.reviewerInstructions"
              language={language}
              field={reviewerInstructions}
            />
            <DataAccessTextArea
              id="data-access-terms"
              title="qvain.rightsAndLicenses.dataAccess.terms"
              language={language}
              field={terms}
            />
          </TranslationTab>
          {isREMSAllowed && <REMSApprovalType />}
        </div>
      )}
      {validationError && <ValidationError>{validationError}</ValidationError>}
    </FieldGroup>
  )
}

export default observer(DataAccess)
