import { useState } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import Dataset from './dataset'
import withCustomProps from '@/utils/withCustomProps'

const DatasetGroup = ({ group }) => {
  const [expanded, setExpanded] = useState(false)

  const expandGroup = group.length > 1 ? () => setExpanded(!expanded) : undefined
  const canExpand = group.length > 1

  return (
    <Group expanded={canExpand && expanded}>
      <Dataset
        dataset={group[0]}
        group={group}
        canExpand={canExpand}
        isExpanded={canExpand && expanded}
        expandGroup={expandGroup}
        isLatest
      />

      {canExpand && expanded && (
        <>
          <PreviousVersions />
          {group.slice(1).map((ds, index) => (
            <Dataset
              key={ds.identifier}
              dataset={ds}
              group={group}
              versionNumber={group.length - 1 - index}
            />
          ))}
        </>
      )}
    </Group>
  )
}

DatasetGroup.propTypes = {
  group: PropTypes.array.isRequired,
}

const Group = withCustomProps(styled.tbody)`
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
