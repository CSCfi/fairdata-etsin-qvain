import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import Dataset from './dataset'

const DatasetGroup = ({ group }) => (
  <tbody>
    <Dataset dataset={group[0]} canExpand={group.length > 1} />
  </tbody>
)

DatasetGroup.propTypes = {
  group: PropTypes.array.isRequired,
}

export default observer(DatasetGroup)
