import React from 'react'
import Translate from 'react-translate-component'
import DescriptionFeild from './descriptionField';
import OtherIdentifierField from './otherIdentifierField';
import FieldOfScienceField from './fieldOfScienceField';
import KeywordsField from './keywordsField';
import { SectionTitle } from '../general/section'

const Description = () => (
  <div className="container">
    <Translate component={SectionTitle} content="qvain.description.title" />
    <div>
      <DescriptionFeild />
      <OtherIdentifierField />
      <FieldOfScienceField />
      <KeywordsField />
    </div>
  </div>
)

export default Description;
