import React from 'react'

import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import Select from '@/components/qvain/general/V2/SearchSelect'
import { useStores } from '@/stores/stores'
import { FieldGroup, FieldWrapper, Title, InfoText } from '@/components/qvain/general/V2'

const LanguageField = () => {
  const Stores = useStores()
  const { storage, set, Model } = Stores.Qvain.DatasetLanguages

  return (
    <FieldGroup data-cy="language-select">
      <FieldWrapper>
        <Title htmlFor="dataset-language-select">
          <Translate content="qvain.description.datasetLanguage.title" />
        </Title>
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
          placeholder=""
          search
        />
      </FieldWrapper>
      <Translate component={InfoText} content="qvain.description.datasetLanguage.infoText" />
    </FieldGroup>
  )
}

export default withFieldErrorBoundary(
  observer(LanguageField),
  'qvain.description.datasetLanguage.title'
)
