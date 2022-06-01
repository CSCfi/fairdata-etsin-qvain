import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FormContainer } from '../../../../general/modal/form'
import TabInput from '../../../../general/input/translationTabInputModal'
import TranslationTab from '../../../../general/input/translationTab'
import LocationInput from './locationInput'
import ModalReferenceInput from '../../../../general/modal/modalReferenceInput'
import { Outcome, Lifecycle } from '../../../../../../stores/view/qvain/qvain.provenances'
import Separator from '../../../../general/modal/modalSeparator'
import ActorsInput from './actorsInput'
import DurationPicker from '../../../../general/input/durationpicker'
import { useStores } from '../../../../utils/stores'

const Form = ({ Field }) => {
  const {
    Locale: { getMatchingLang },
  } = useStores()
  const { inEdit } = Field

  const translations = [inEdit.name, inEdit.description, inEdit.outcomeDescription]
  const [language, setLanguage] = useState(getMatchingLang(translations))

  return (
    <FormContainer>
      <TranslationTab language={language} setLanguage={setLanguage}>
        <TabInput Field={Field} datum="name" language={language} isRequired />
        <TabInput Field={Field} datum="description" language={language} />
        <TabInput Field={Field} datum="outcomeDescription" language={language} />
      </TranslationTab>
      <Separator />
      <DurationPicker
        Field={Field}
        datum="periodOfTime"
        language={language}
        id="provenance-period"
      />
      <LocationInput />
      <Separator />
      <ModalReferenceInput
        Field={Field}
        datum="outcome"
        metaxIdentifier="event_outcome"
        model={Outcome}
      />
      <Separator />
      <ActorsInput Field={Field} datum="actors" />
      <Separator />
      <ModalReferenceInput
        Field={Field}
        datum="lifecycle"
        metaxIdentifier="lifecycle_event"
        model={Lifecycle}
      />
    </FormContainer>
  )
}

Form.propTypes = {
  Field: PropTypes.object.isRequired,
}

export default Form
