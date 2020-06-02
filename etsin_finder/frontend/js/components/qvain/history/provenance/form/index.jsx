import React, { useState } from 'react'
import ProvenanceInput from './ProvenanceInput'
import TranslationTab from './translationTab'
import PeriodOfTimePicker from './PeriodOfTimePicker';
import AddSpatialCoverage from '../../../temporalAndSpatial/spatial/AddSpatialCoverage';

const Form = () => {
  const [language, setLanguage] = useState('fi');
  return (
    <>
      <TranslationTab language={language} setLanguage={(lang) => setLanguage(lang)}>
        <>
          <ProvenanceInput language={language} type="text" datum="name" error="" />
          <ProvenanceInput language={language} type="text" datum="description" error="" />
          <ProvenanceInput language={language} type="text" datum="outcomeDescription" error="" />
        </>
      </TranslationTab>
      <PeriodOfTimePicker />
      <AddSpatialCoverage />
    </>
)
}
export default Form
