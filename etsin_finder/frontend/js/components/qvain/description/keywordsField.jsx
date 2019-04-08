import React from 'react'
import Select from 'react-select';

import Card from '../general/card';

const KeywordsField = () => (
  <Card>
    <h3>Keywords</h3>
    <Select
      isMulti
      name="keywords"
      placeholder="E.g. Economy"
      className="basic-multi-select"
      classNamePrefix="select"
    />
  </Card>
)

export default KeywordsField;
