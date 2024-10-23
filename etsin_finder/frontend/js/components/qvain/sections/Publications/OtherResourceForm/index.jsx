import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useStores } from '@/stores/stores'

import { FormContainer } from '@/components/qvain/general/V2'

import { RelationType } from '@/stores/view/qvain/qvain.relatedResources'
import TranslationTab from '@/components/qvain/general/V2/TranslationTab'
import TabInput from '@/components/qvain/general/V2/TabInput'
import ModalInput from '@/components/qvain/general/V2/ModalInput'
import ModalReferenceInput from '@/components/qvain/general/V2/ModalReferenceInput'
import useScrollToTop from '@/utils/useScrollToTop'

const Form = ({ Field, hideRelationType }) => {
  const {
    Locale: { getMatchingLang },
  } = useStores()
  const { inEdit } = Field
  const ref = useScrollToTop()

  const translations = [inEdit.name, inEdit.description]
  const [language, setLanguage] = useState(getMatchingLang(translations))

  return (
    <FormContainer ref={ref}>
      <ModalReferenceInput
        Field={Field}
        datum="entityType"
        metaxIdentifier="resource_type"
        model={RelationType}
        translationsRoot={`${Field.translationsRoot}.otherResources`}
        isRequired
      />
      {!hideRelationType && (
        <ModalReferenceInput
          Field={Field}
          datum="relationType"
          metaxIdentifier="relation_type"
          model={RelationType}
          translationsRoot={`${Field.translationsRoot}.otherResources`}
          isRequired
        />
      )}
      <TranslationTab language={language} setLanguage={setLanguage} id="tt-test">
        <TabInput
          Field={Field}
          datum="name"
          language={language}
          translationsRoot={`${Field.translationsRoot}.otherResources`}
          isRequired
        />
        <TabInput
          Field={Field}
          datum="description"
          language={language}
          translationsRoot={`${Field.translationsRoot}.otherResources`}
        />
      </TranslationTab>
      <ModalInput
        Field={Field}
        datum="identifier"
        translationsRoot={`${Field.translationsRoot}.otherResources`}
      />
    </FormContainer>
  )
}

Form.propTypes = {
  Field: PropTypes.object.isRequired,
  hideRelationType: PropTypes.bool,
}

Form.defaultProps = {
  hideRelationType: false,
}

export default Form
