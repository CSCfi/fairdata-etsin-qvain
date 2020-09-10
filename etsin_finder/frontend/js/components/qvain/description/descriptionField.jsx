import React, { useState } from 'react'
import Translate from 'react-translate-component'

import { titleSchema, descriptionSchema } from '../utils/formValidation'
import TranslationsTab from '../general/translationTab'
import DescriptionFieldInput from './descriptionFieldInput'
import DescriptionFieldTextField from './descriptionFieldTextField'

const DescriptionField = () => {
  const [activeLang, setActiveLang] = useState('fi')

  return (
    <TranslationsTab language={activeLang} setLanguage={setActiveLang}>
      <DescriptionFieldInput propName="title" schema={titleSchema} activeLang={activeLang} />
      <DescriptionFieldTextField
        propName="description"
        schema={descriptionSchema}
        activeLang={activeLang}
      />
      <Translate component="div" content="qvain.description.description.instructions" />
    </TranslationsTab>
  )
}

export default DescriptionField
