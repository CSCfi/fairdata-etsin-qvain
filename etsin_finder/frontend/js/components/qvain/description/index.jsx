import React from 'react'

import DescriptionFeild from './descriptionField';
import OtherIdentifierField from './otherIdentifierField';
import FieldOfScienceField from './fieldOfScienceField';
import KeywordsField from './keywordsField';

const Description = () => (
  <div className="container">
    <h2>DESCRIPTION</h2>
    <div>
      <DescriptionFeild />
      <OtherIdentifierField />
      <FieldOfScienceField />
      <KeywordsField />
    </div>
  </div>
)

export default Description;
