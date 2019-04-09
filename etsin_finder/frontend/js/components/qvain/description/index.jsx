import React from 'react'

import DescriptionFeild from './descriptionField';
import OtherIdentifierField from './otherIdentifierField';
import FieldOfScienceField from './fieldOfScienceField';
import KeywordsField from './keywordsField';
import { SectionTitle } from '../general/section'

const Description = () => (
  <div className="container">
    <SectionTitle>Description</SectionTitle>
    <div>
      <DescriptionFeild />
      <OtherIdentifierField />
      <FieldOfScienceField />
      <KeywordsField />
    </div>
  </div>
)

export default Description;
