import React from 'react'

import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import Select from '../../../general/input/searchSelect'
import { DatasetLanguage } from '../../../../../stores/view/qvain'
import Card from '../../../general/card'
import { LabelLarge } from '../../../general/modal/form'

const LanguageField = ({ Stores }) => {
  const { datasetLanguageArray, setDatasetLanguageArray } = Stores.Qvain

  return (
    <Card>
      <LabelLarge htmlFor="datasetLanguage">
        <Translate content="qvain.description.datasetLanguage.title" />
      </LabelLarge>
      <Translate component="p" content="qvain.description.datasetLanguage.help" />
      <Select
        name="dataset-language"
        id="datasetLanguage"
        getter={datasetLanguageArray}
        setter={setDatasetLanguageArray}
        isMulti
        isClearable={false}
        model={DatasetLanguage}
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

LanguageField.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(LanguageField))
