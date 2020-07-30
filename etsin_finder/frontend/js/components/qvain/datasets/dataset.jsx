import React from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { tint } from 'polished'

import { Row, BodyCell } from '../general/table'
import { DATA_CATALOG_IDENTIFIER } from '../../../utils/constants'
import Label from '../general/label'
import { TableButton, RemoveButton } from '../general/buttons'
import TablePasState from './tablePasState'
import formatAge from './formatAge'

const datasetStateTranslation = dataset => {
  if (dataset.state === 'published') {
    if (dataset.next_draft) {
      return 'qvain.datasets.state.changed'
    }
    return 'qvain.datasets.state.published'
  }
  return 'qvain.datasets.state.draft'
}

const getGoToEtsinButton = dataset => {
  let identifier = dataset.identifier
  let goToEtsinKey = 'goToEtsin'
  if (dataset.next_draft) {
    identifier = dataset.next_draft.identifier
    goToEtsinKey = 'goToEtsinDraft'
  } else if (dataset.state === 'draft') {
    goToEtsinKey = 'goToEtsinDraft'
  }

  return (
    <Translate
      component={TableButton}
      onClick={() => window.open(`/dataset/${identifier}`, '_blank')}
      content={`qvain.datasets.${goToEtsinKey}`}
    />
  )
}

function Dataset(props) {
  const { metaxApiV2 } = props.Stores.Qvain

  let titleCellStyle = null
  if (props.indent) {
    titleCellStyle = { paddingLeft: '1rem', position: 'relative' }
  }

  const { dataset, currentTimestamp } = props

  return (
    <DatasetRow key={dataset.identifier} tabIndex="0" highlight={props.highlight}>
      <BodyCellWordWrap style={titleCellStyle}>
        {props.indent && <Marker />}
        {dataset.research_dataset.title.en || dataset.research_dataset.title.fi}
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
      {metaxApiV2 && (
        <BodyCell>
          <Translate content={datasetStateTranslation(dataset)} />
        </BodyCell>
      )}
      <BodyCell>{formatAge(currentTimestamp, dataset.date_created)}</BodyCell>
      <BodyCellActions>
        <Translate
          component={TableButton}
          onClick={props.handleEnterEdit(dataset)}
          content={
            dataset.next_draft ? 'qvain.datasets.editDraftButton' : 'qvain.datasets.editButton'
          }
        />
        {getGoToEtsinButton(dataset)}
        {metaxApiV2 &&
          dataset.next_dataset_version === undefined &&
          dataset.state === 'published' && (
            <Translate
              component={TableButton}
              onClick={() => props.handleCreateNewVersion(dataset.identifier)}
              content="qvain.datasets.createNewVersion"
            />
          )}
        <Translate
          component={RemoveButton}
          onClick={props.openRemoveModal(dataset.identifier)}
          content="qvain.datasets.deleteButton"
        />
      </BodyCellActions>
    </DatasetRow>
  )
}

Dataset.propTypes = {
  Stores: PropTypes.object.isRequired,
  dataset: PropTypes.object.isRequired,
  currentTimestamp: PropTypes.object.isRequired,
  handleEnterEdit: PropTypes.func.isRequired,
  handleCreateNewVersion: PropTypes.func.isRequired,
  openRemoveModal: PropTypes.func.isRequired,
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
  }
`

export default inject('Stores')(observer(Dataset))
