import React from 'react'
import Translate from 'react-translate-component'
import DescriptionFeild from './descriptionField';
import OtherIdentifierField from './otherIdentifierField';
import FieldOfScienceField from './fieldOfScienceField';
import KeywordsField from './keywordsField';

const Description = () => (
  <div className="container">
    <h2><Translate content="qvain.description.title" /></h2>
    <div>
      <DescriptionFeild />
      <OtherIdentifierField />
      <FieldOfScienceField />
      <KeywordsField />
    </div>
  </div>
)

export default Description;
