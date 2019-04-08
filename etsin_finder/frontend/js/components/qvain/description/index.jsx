import React from 'react'

import OtherIdentifierField from './otherIdentifierField';
import FieldOfScienceField from './fieldOfScienceField';
import KeywordsField from './keywordsField';

const Description = () => (
  <div className="container">
    <h2>DESCRIPTION</h2>
    <div>
      <OtherIdentifierField />
      <FieldOfScienceField />
      <KeywordsField />
    </div>
  </div>
)

export default Description;
