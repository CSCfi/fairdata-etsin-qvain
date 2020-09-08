import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TranslationTab from '../../../general/input/translationTab'
import TabInput from '../../../general/input/translationTabInputModal'
import { FormContainer } from '../../../general/modal/form'
import ModalInput from '../../../general/modal/modalInput'
import ModalReferenceInput from '../../../general/modal/modalReferenceInput'
import { RelationType } from '../../../../../stores/view/qvain.relatedResources'

const Form = props => {
  const [language, setLanguage] = useState('fi')

  return (
    <FormContainer>
      <TranslationTab language={language} setLanguage={setLanguage}>
        <TabInput {...props} datum="name" language={language} isRequired />
        <TabInput {...props} datum="description" language={language} />
      </TranslationTab>
      <ModalInput {...props} datum="identifier" />
      {!props.hideRelationType && (
        <ModalReferenceInput
          {...props}
          datum="relationType"
          metaxIdentifier="relation_type"
          model={RelationType}
        />
      )}
      <ModalReferenceInput
        {...props}
        datum="entityType"
        metaxIdentifier="resource_type"
        model={RelationType}
      />
    </FormContainer>
  )
}

Form.propTypes = {
  Field: PropTypes.object.isRequired,
  translationsRoot: PropTypes.string.isRequired,
  hideRelationType: PropTypes.bool,
}

Form.defaultProps = {
  hideRelationType: false,
}

export default Form
