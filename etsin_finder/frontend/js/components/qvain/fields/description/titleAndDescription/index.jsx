import React, { useState } from 'react'
import Translate from 'react-translate-component'

import TranslationsTab from '../../../general/input/translationTab'
import DescriptionFieldInput from './descriptionFieldInput'
import DescriptionFieldTextField from './descriptionFieldTextField'
import { useStores } from '../../../utils/stores'

const DescriptionField = () => {
  const {
    Locale: { lang },
  } = useStores()
  const [activeLang, setActiveLang] = useState(lang)

  return (
    <TranslationsTab language={activeLang} setLanguage={setActiveLang}>
      <DescriptionFieldInput propName="title" fieldName="Title" activeLang={activeLang} />
      <DescriptionFieldTextField
        propName="description"
        fieldName="Description"
        activeLang={activeLang}
      />
      <Translate component="div" content="qvain.description.description.instructions" />
    </TranslationsTab>
  )
}

export default DescriptionField
