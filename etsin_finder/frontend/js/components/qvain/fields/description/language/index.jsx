import React from 'react'

import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import Select from '../../../general/input/searchSelect'
import Card from '../../../general/card'
import { LabelLarge } from '../../../general/modal/form'
import { useStores } from '../../../utils/stores'

const LanguageField = () => {
  const Stores = useStores()
  const { storage, set, Model } = Stores.Qvain.DatasetLanguages

  return (
    <Card>
      <LabelLarge htmlFor="dataset-language-select">
        <Translate content="qvain.description.datasetLanguage.title" />
      </LabelLarge>
      <Translate component="p" content="qvain.description.datasetLanguage.help" />
      <Select
        name="dataset-language"
        id="datasetLanguage"
        getter={storage}
        setter={set}
        isMulti
        isClearable={false}
        model={Model}
        noOptionsMessage={({ inputValue }) => {
          if (inputValue) {
            return translate('qvain.description.datasetLanguage.noResults')
          }
          return translate('qvain.description.datasetLanguage.placeholder')
        }}
        metaxIdentifier="language"
        placeholder="qvain.description.datasetLanguage.placeholder"
        search
      />
    </Card>
  )
}

export default withFieldErrorBoundary(
  observer(LanguageField),
  'qvain.description.datasetLanguage.title'
)
