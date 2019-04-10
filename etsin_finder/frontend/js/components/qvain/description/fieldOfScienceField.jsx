import React from 'react'
import Select from 'react-select';
import Translate from 'react-translate-component'

import Card from '../general/card';

const FieldOfScienceField = () => (
  <Card>
    <Translate component="h3" content="qvain.description.fieldOfScience.title" />
    <Select
      name="field-of-science"
      placeholder="Select option"
      className="basic-single"
      classNamePrefix="select"
    />
  </Card>
)

export default FieldOfScienceField;
