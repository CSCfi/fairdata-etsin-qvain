import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FormContainer } from '../../../general/form'
import TabInput from '../../../general/translationTabInputModal'
import TranslationTab from '../../../general/translationTab'
import LocationInput from './locationInput'
import ModalReferenceInput from '../../../general/modalReferenceInput'
import { Outcome, Lifecycle } from '../../../../../stores/view/qvain.provenances'
import Separator from '../../../general/modalSeparator'
import UsedEntityInput from './usedEntityInput'
import ActorsInput from './actorsInput'
import DurationPicker from '../../../general/input/durationpicker'

const Form = props => {
  const [language, setLanguage] = useState('fi')

  return (
    <FormContainer>
      <TranslationTab language={language} setLanguage={setLanguage}>
        <TabInput {...props} datum="name" language={language} isRequired />
        <TabInput {...props} datum="description" language={language} />
        <TabInput {...props} datum="outcomeDescription" language={language} />
      </TranslationTab>
      <Separator />
      <DurationPicker {...props} datum="periodOfTime" language={language} />
      <LocationInput />
      <Separator />
      <ModalReferenceInput
        {...props}
        datum="outcome"
        metaxIdentifier="event_outcome"
        model={Outcome}
      />
      <Separator />
      <UsedEntityInput />
      <Separator />
      <ActorsInput {...props} datum="actors" language={language} />
      <Separator />
      <ModalReferenceInput
        {...props}
        datum="lifecycle"
        metaxIdentifier="lifecycle_event"
        model={Lifecycle}
      />
    </FormContainer>
  )
}

Form.propTypes = {
  Store: PropTypes.object.isRequired,
  Field: PropTypes.object.isRequired,
  translationsRoot: PropTypes.string.isRequired,
}

export default Form
