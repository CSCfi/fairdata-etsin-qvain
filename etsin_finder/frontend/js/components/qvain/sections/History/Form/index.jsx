import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import { useStores } from '@/stores/stores'
import { Outcome, Lifecycle } from '@/stores/view/qvain/qvain.provenances'
import { FieldGroup, FormContainer, ModalLabel } from '@/components/qvain/general/V2'
import TabInput from '@/components/qvain/general/V2/TabInput'
import TranslationTab from '@/components/qvain/general/V2/TranslationTab'
import ModalReferenceInput from '@/components/qvain/general/V2/ModalReferenceInput'
import DurationPicker from '@/components/qvain/general/V2/Durationpicker'

import ActorsInput from './ActorsInput'
import LocationInput from './LocationInput'
import useScrollToTop from '@/utils/useScrollToTop'

const Form = ({ Field }) => {
  const {
    Locale: { getMatchingLang, lang },
  } = useStores()
  const { inEdit } = Field
  const ref = useScrollToTop()

  const translations = [inEdit.name, inEdit.description, inEdit.outcomeDescription]
  const [nameLanguage, setNameLanguage] = useState(getMatchingLang(translations))
  const [descLanguage, setDescLanguage] = useState(getMatchingLang(translations))

  return (
    <FormContainer ref={ref}>
      <Translate component={ModalLabel} content="qvain.historyV2.title.general" />
      <FieldGroup>
        <TranslationTab
          language={nameLanguage}
          setLanguage={setNameLanguage}
          id="provenance-descriptions"
        >
          <TabInput Field={Field} datum="name" language={nameLanguage} isRequired />
          <TabInput Field={Field} datum="description" language={nameLanguage} />
        </TranslationTab>
        <ModalReferenceInput
          Field={Field}
          datum="lifecycle"
          metaxIdentifier="lifecycle_event"
          model={Lifecycle}
        />
        <DurationPicker Field={Field} datum="periodOfTime" language={lang} id="provenance-period" />
      </FieldGroup>
      <Translate component={ModalLabel} content="qvain.historyV2.title.outcome" />
      <FieldGroup>
        <ModalReferenceInput
          Field={Field}
          datum="outcome"
          metaxIdentifier="event_outcome"
          model={Outcome}
        />
        <TranslationTab
          language={descLanguage}
          setLanguage={setDescLanguage}
          id="outcome-description"
        >
          <TabInput Field={Field} datum="outcomeDescription" language={descLanguage} />
        </TranslationTab>
      </FieldGroup>
      <Translate component={ModalLabel} content="qvain.historyV2.title.details" />
      <ActorsInput Field={Field} datum="actors" />
      <LocationInput />
    </FormContainer>
  )
}

Form.propTypes = {
  Field: PropTypes.object.isRequired,
}

export default Form
