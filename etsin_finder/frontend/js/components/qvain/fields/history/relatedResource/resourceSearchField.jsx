import React from 'react'
import Select from 'react-select/async'
import Translate from 'react-translate-component'
import { useStores } from '../../../utils/stores'

const ResourcesSearchField = () => {
  const {
    CrossRef: { search, setTerm, term, defaultOptions, translationPath },
    Qvain: {
      RelatedResources: { prefillInEdit, create },
    },
  } = useStores()

  const handleChange = selection => {
    if (selection) {
      if (selection.value === 'create') {
        create()
      } else {
        prefillInEdit(selection.value)
      }
      setTerm('')
    }
  }

  return (
    <Translate
      component={Select}
      loadOptions={search}
      onChange={handleChange}
      onInputChange={setTerm}
      defaultOptions={defaultOptions}
      attributes={{ placeholder: translationPath('placeholder') }}
      value={term}
      isClearable
    />
  )
}

export default ResourcesSearchField
