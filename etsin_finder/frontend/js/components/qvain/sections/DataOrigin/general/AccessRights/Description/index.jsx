import { useState } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import {
  FieldGroup,
  TitleSmall,
  TextArea,
  FieldWrapper,
  InfoText,
} from '@/components/qvain/general/V2'
import TranslationTab from '@/components/qvain/general/V2/TranslationTab'
import { ValidationError } from '@/components/qvain/general/errors'
import { ExpandCollapse } from '@/components/qvain/general/V2/ExpandCollapse'

const AccessRightsDescription = () => {
  const {
    Locale: { lang },
    Qvain: {
      AccessRightsDescription: { set, value, validate, validationError, charactersRemaining },
      readonly,
    },
  } = useStores()
  const [language, setLanguage] = useState(lang)
  const [isExpanded, setIsExpanded] = useState(Boolean(value?.fi || value?.en))

  const handleChange = e => set(e.target.value, language)

  const handleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const id = 'access-rights-description-input'

  return (
    <FieldGroup>
      <FieldWrapper>
        <div>
          <ExpandCollapse isExpanded={isExpanded} onClick={handleExpand} />
          <Translate
            component={TitleSmall}
            content="qvain.rightsAndLicenses.description.title"
            onClick={handleExpand}
          />
        </div>
        {isExpanded && (
          <TranslationTab language={language} setLanguage={setLanguage} id={id}>
            <Translate
              component={TitleSmall}
              content="qvain.rightsAndLicenses.description.title"
              htmlFor={id}
            />
            <Translate
              component={NarrowTextArea}
              id={id}
              disabled={readonly}
              value={value[language] || ''}
              onChange={handleChange}
              onBlur={validate}
            />
            <span>
              <Translate
                component={InfoText}
                id="access-rights-description-char-counter"
                content="qvain.description.charactersRemaining"
                with={{ charactersRemaining: charactersRemaining[language] }}
              />
            </span>
          </TranslationTab>
        )}
      </FieldWrapper>
      {validationError && <ValidationError>{validationError}</ValidationError>}
    </FieldGroup>
  )
}

const NarrowTextArea = styled(TextArea)`
  min-height: 6rem;
`

export default observer(AccessRightsDescription)
