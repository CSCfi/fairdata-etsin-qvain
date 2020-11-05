import React, { useState } from 'react'
import Translate from 'react-translate-component'

import TranslationsTab from '../general/input/translationTab'
import DescriptionFieldInput from './descriptionFieldInput'
import DescriptionFieldTextField from './descriptionFieldTextField'

const DescriptionField = () => {
  const [activeLang, setActiveLang] = useState('fi')

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
