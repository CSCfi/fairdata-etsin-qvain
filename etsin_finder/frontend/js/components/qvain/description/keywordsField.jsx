import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Select from 'react-select';

import Card from '../general/card';

const keywordOptions = [
  { value: 'ECONOMY', label: 'Economy' },
  { value: 'FORESTRY', label: 'Forestry' }
]

class KeywordsField extends React.Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  render() {
    return (
      <Card>
        <h3>Keywords</h3>
        <Select
          isMulti
          name="keywords"
          options={keywordOptions}
          placeholder="E.g. Economy"
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={(keywords) => this.props.Stores.Qvain.setKeywords(keywords)}
        />
      </Card>
    )
  }
}

KeywordsField.propTypes = {
  Stores: PropTypes.object.isRequired
}

export default inject('Stores')(observer(KeywordsField));
