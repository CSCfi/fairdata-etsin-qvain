import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TranslationTab from '../../../../general/input/translationTab'
import TabInput from '../../../../general/input/translationTabInputModal'
import { FormContainer } from '../../../../general/modal/form'
import ModalInput from '../../../../general/modal/modalInput'
import ModalReferenceInput from '../../../../general/modal/modalReferenceInput'
import { RelationType } from '../../../../../../stores/view/qvain/qvain.relatedResources'
import ModalSeparator from '../../../../general/modal/modalSeparator'
import { useStores } from '../../../../utils/stores'

const Form = ({ Field, hideRelationType }) => {
  const {
    Locale: { getMatchingLang },
  } = useStores()
  const { inEdit } = Field

  const translations = [inEdit.name, inEdit.description]
  const [language, setLanguage] = useState(getMatchingLang(translations))

  return (
    <FormContainer>
      <TranslationTab language={language} setLanguage={setLanguage}>
        <TabInput Field={Field} datum="name" language={language} isRequired />
        <TabInput Field={Field} datum="description" language={language} />
      </TranslationTab>
      <ModalInput Field={Field} datum="identifier" />
      <ModalReferenceInput
        Field={Field}
        datum="entityType"
        metaxIdentifier="resource_type"
        model={RelationType}
      />
      <ModalSeparator />
      {!hideRelationType && (
        <ModalReferenceInput
          Field={Field}
          datum="relationType"
          metaxIdentifier="relation_type"
          model={RelationType}
          isRequired
        />
      )}
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
