import React from 'react'
import Select from 'react-select';

import Card from '../general/card';

const FieldOfScienceField = () => (
  <Card>
    <h3>Field on Science</h3>
    <Select
      name="field-of-science"
      placeholder="Select option"
      className="basic-single"
      classNamePrefix="select"
    />
  </Card>
)

export default FieldOfScienceField;
