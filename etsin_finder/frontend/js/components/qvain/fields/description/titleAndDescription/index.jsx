import React, { useState } from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'

import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import TranslationTab from '../../../general/input/translationTab'
import DescriptionFieldInput from './descriptionFieldInput'
import DescriptionFieldTextField from './descriptionFieldTextField'
import { useStores } from '../../../utils/stores'

const DescriptionField = () => {
  const {
    Locale: { getMatchingLang },
    Qvain: {
      Title: { value: titleValue },
      Description: { value: descriptionValue },
    },
  } = useStores()
  const [activeLang, setActiveLang] = useState(getMatchingLang([titleValue, descriptionValue]))

  return (
    <TranslationTab language={activeLang} setLanguage={setActiveLang}>
      <DescriptionFieldInput propName="title" fieldName="Title" activeLang={activeLang} />
      <DescriptionFieldTextField
        propName="description"
        fieldName="Description"
        activeLang={activeLang}
      />
      <Translate component="div" content="qvain.description.description.instructions" />
    </TranslationTab>
  )
}

export default withFieldErrorBoundary(
  observer(DescriptionField),
  'qvain.description.description.description.label'
)
