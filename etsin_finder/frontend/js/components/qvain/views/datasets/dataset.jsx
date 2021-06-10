import React, { useEffect, useRef } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { tint } from 'polished'

import { Row, BodyCell } from '../../general/card/table'
import { DATA_CATALOG_IDENTIFIER } from '../../../../utils/constants'
import Label from '../../general/card/label'
import { TableButton, RemoveButton } from '../../general/buttons'
import TablePasState from './tablePasState'
import formatAge from './formatAge'
import { Dropdown, DropdownItem } from '../../../general/dropdown'
import { useStores } from '../../utils/stores'
import getDatasetActions from './datasetActions'

const datasetStateTranslation = dataset => {
  if (dataset.state === 'published') {
    if (dataset.next_draft) {
      return 'qvain.datasets.state.changed'
    }
    return 'qvain.datasets.state.published'
  }
  return 'qvain.datasets.state.draft'
}

const getTitle = (getValueTranslation, dataset) => {
  let researchDataset = dataset.research_dataset
  if (dataset.next_draft?.research_dataset?.title) {
    researchDataset = dataset.next_draft.research_dataset
  }
  return getValueTranslation(researchDataset.title)
}

const getActionButton = action => {
  const { text, handler, danger } = action
  const ButtonComponent = danger ? RemoveButton : TableButton
  return (
    <ButtonComponent key={text} onClick={handler}>
      <Translate content={text} />
    </ButtonComponent>
  )
}

const getActionItem = action => {
  const { text, handler, danger } = action
  return (
    <DropdownItem key={text} onClick={handler} danger={danger} color="error">
      <Translate content={text} />
    </DropdownItem>
  )
}

function Dataset({ dataset, currentTimestamp, indent, highlight }) {
  const Stores = useStores()
  const {
    Locale: { getValueTranslation },
  } = Stores
  const rowRef = useRef()

  useEffect(() => {
    if (highlight && rowRef?.current?.scrollIntoView) {
      rowRef.current.scrollIntoView({ block: 'center' })
    }
  }, [highlight])

  let titleCellStyle = null
  if (indent) {
    titleCellStyle = { paddingLeft: '1rem', position: 'relative' }
  }

  const actions = getDatasetActions(Stores, dataset)
  const actionButtons = actions.splice(0, 2)
  if (actions.length === 1) {
    actionButtons.push(actions.splice(0, 1))
  }
  const actionDropdownItems = actions
  const hasDropDownItems = actionDropdownItems.length > 0

  return (
    <DatasetRow ref={rowRef} key={dataset.identifier} tabIndex="0" highlight={highlight}>
      <BodyCellWordWrap style={titleCellStyle}>
        {indent && <Marker />}
        {getTitle(getValueTranslation, dataset)}
        {dataset.next_dataset_version !== undefined && (
          <Translate color="yellow" content="qvain.datasets.oldVersion" component={DatasetLabel} />
        )}
        {dataset.deprecated && (
          <Translate color="error" content="qvain.datasets.deprecated" component={DatasetLabel} />
        )}
        {(dataset.preservation_state > 0 ||
          dataset.data_catalog.identifier === DATA_CATALOG_IDENTIFIER.PAS) && (
          <TablePasState preservationState={dataset.preservation_state} />
        )}
      </BodyCellWordWrap>
      <BodyCell>
        <Translate content={datasetStateTranslation(dataset)} />
      </BodyCell>
      <BodyCell>{formatAge(currentTimestamp, dataset.date_created)}</BodyCell>
      <BodyCellActions>
        {actionButtons.map(action => getActionButton(action))}
        {hasDropDownItems && (
          <Dropdown buttonContent="qvain.datasets.moreActions" buttonComponent={DropdownButton}>
            {actionDropdownItems.map(action => getActionItem(action))}
          </Dropdown>
        )}
      </BodyCellActions>
    </DatasetRow>
  )
}

Dataset.propTypes = {
  dataset: PropTypes.object.isRequired,
  currentTimestamp: PropTypes.object.isRequired,
  indent: PropTypes.bool,
  highlight: PropTypes.bool,
}

Dataset.defaultProps = {
  indent: false,
  highlight: false,
}

const DatasetRow = styled(Row)`
  ${props =>
    props.highlight &&
    `
      background: ${tint(0.7, props.theme.color.success)};
      &:hover {
        background: ${tint(0.8, props.theme.color.success)};
      }
    `}
`

const Marker = styled.div`
  position: absolute;
  width: 2px;
  height: 100%;
  background: ${props => props.theme.color.lightgray};
  left: 0;
  top: 0;
`

const DatasetLabel = styled(Label)`
  color: ${({ color, theme }) => {
    if (color === 'yellow') return theme.color.dark
    return 'white'
  }};
  margin-left: 10px;
  text-transform: uppercase;
`

const BodyCellWordWrap = styled(BodyCell)`
  word-break: break-word;
`

const BodyCellActions = styled(BodyCell)`
  display: flex;
  flex-wrap: wrap;
  margin: -0.1rem -0.15rem;
  > * {
    margin: 0.1rem 0.15rem;
    flex: 1 0 5.5em;
    max-width: none;
  }
`

const DropdownButton = styled(TableButton)`
  max-width: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
`

export default observer(Dataset)
