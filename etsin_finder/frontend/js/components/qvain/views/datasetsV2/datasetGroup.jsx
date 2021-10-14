import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import Dataset from './dataset'

const DatasetGroup = ({ group }) => {
  const [expanded, setExpanded] = useState(false)

  const expandGroup = group.length > 1 ? () => setExpanded(!expanded) : undefined

  return (
    <Group expanded={expanded}>
      <Dataset
        dataset={group[0]}
        canExpand={group.length > 1}
        isExpanded={expanded}
        expandGroup={expandGroup}
        isLatest
      />

      {expanded && (
        <>
          <PreviousVersions />
          {group.slice(1).map((ds, index) => (
            <Dataset key={ds.identifier} dataset={ds} versionNumber={group.length - 1 - index} />
          ))}
        </>
      )}
    </Group>
  )
}

DatasetGroup.propTypes = {
  group: PropTypes.array.isRequired,
}

const Group = styled.tbody`
  ${p => p.expanded && `background: ${p.theme.color.primaryLight};`}
`

const PreviousVersions = () => (
  <tr>
    <Translate component={PreviousVersionsText} content="qvain.datasets.previousVersions.label" />
    <td colSpan="7" />
  </tr>
)

const PreviousVersionsText = styled.td.attrs({
  colSpan: 3,
})`
  font-weight: bold;
  text-align: center;
  padding-left: 0.5rem;
`

export default observer(DatasetGroup)
