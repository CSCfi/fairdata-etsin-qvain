import { useState } from 'react'
import { observer } from 'mobx-react'

import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import TranslationTab from '@/components/qvain/general/V2/TranslationTab'
import { useStores } from '@/stores/stores'
import DescriptionFieldInput from './DescriptionFieldInput'
import DescriptionFieldTextField from './DescriptionFieldTextField'

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
    <TranslationTab
      language={activeLang}
      setLanguage={setActiveLang}
      useTitleLanguages
      id="title-and-description"
    >
      <DescriptionFieldInput propName="title" fieldName="Title" activeLang={activeLang} />
      <DescriptionFieldTextField activeLang={activeLang} />
    </TranslationTab>
  )
}

export default withFieldErrorBoundary(
  observer(DescriptionField),
  'qvain.description.description.description.label'
)
