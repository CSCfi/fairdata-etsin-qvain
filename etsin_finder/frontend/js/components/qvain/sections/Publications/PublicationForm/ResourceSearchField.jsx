import Select from 'react-select/async'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import { Title, FieldGroup, FieldWrapper, InfoText } from '@/components/qvain/general/V2'

const ResourcesSearchField = () => {
  const {
    CrossRef: { search, setTerm, term, defaultOptions, translationPath },
    Qvain: {
      RelatedResources: { prefillInEdit },
    },
  } = useStores()

  const handleChange = selection => {
    if (selection) {
      prefillInEdit(selection.value)
    }
  }

  return (
    <FieldGroup>
      <Translate content={translationPath('title')} component={Title} />
      <FieldWrapper>
        <Translate
          component={Select}
          loadOptions={search}
          onChange={handleChange}
          onInputChange={setTerm}
          defaultOptions={defaultOptions}
          placeholder=""
          value={term}
          isClearable
        />
        <Translate component={InfoText} content={translationPath('infoText')} />
      </FieldWrapper>
    </FieldGroup>
  )
}

export default ResourcesSearchField
