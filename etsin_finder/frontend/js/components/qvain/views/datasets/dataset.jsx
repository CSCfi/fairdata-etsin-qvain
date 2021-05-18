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

const datasetStateTranslation = dataset => {
  if (dataset.state === 'published') {
    if (dataset.next_draft) {
      return 'qvain.datasets.state.changed'
    }
    return 'qvain.datasets.state.published'
  }
  return 'qvain.datasets.state.draft'
}

const getGoToEtsinButton = (dataset, getEtsinUrl, Matomo) => {
  let identifier = dataset.identifier
  let goToEtsinKey = 'goToEtsin'
  let query = ''
  if (dataset.next_draft) {
    identifier = dataset.next_draft.identifier
    goToEtsinKey = 'goToEtsinDraft'
    query = '?preview=1'
  } else if (dataset.state === 'draft') {
    goToEtsinKey = 'goToEtsinDraft'
    query = '?preview=1'
  }

  return (
    <Translate
      component={TableButton}
      onClick={() => {
        Matomo.recordEvent(`PREVIEW / ${identifier}`)
        window.open(getEtsinUrl(`/dataset/${identifier}${query}`), '_blank')
      }}
      content={`qvain.datasets.${goToEtsinKey}`}
    />
  )
}

const getTitle = (dataset, lang) => {
  let researchDataset = dataset.research_dataset
  if (
    dataset.next_draft &&
    dataset.next_draft.research_dataset &&
    dataset.next_draft.research_dataset.title
  ) {
    researchDataset = dataset.next_draft.research_dataset
  }
  return researchDataset.title[lang] || researchDataset.title.en || researchDataset.title.fi
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

function Dataset({
  dataset,
  currentTimestamp,
  handleCreateNewVersion,
  handleUseAsTemplate,
  handleEnterEdit,
  openRemoveModal,
  indent,
  highlight,
}) {
  const {
    Env: { metaxApiV2, getEtsinUrl },
    Locale: { lang },
    Matomo,
  } = useStores()
  const rowRef = useRef()
  const actions = []

  useEffect(() => {
    if (highlight && rowRef?.current?.scrollIntoView) {
      rowRef.current.scrollIntoView({ block: 'center' })
    }
  }, [highlight])

  actions.push({
    text: 'qvain.datasets.useAsTemplate',
    danger: false,
    handler: () => handleUseAsTemplate(dataset),
  })
  if (
    metaxApiV2 &&
    !dataset.next_draft &&
    dataset.next_dataset_version === undefined &&
    dataset.data_catalog?.identifier === DATA_CATALOG_IDENTIFIER.IDA &&
    dataset.state === 'published'
  ) {
    actions.push({
      text: 'qvain.datasets.createNewVersion',
      handler: () => handleCreateNewVersion(dataset.identifier),
    })
  }
  if (metaxApiV2 && dataset.next_draft) {
    actions.push({
      text: 'qvain.datasets.revertButton',
      danger: true,
      handler: openRemoveModal(dataset, true),
    })
  }
  actions.push({
    text: 'qvain.datasets.deleteButton',
    danger: true,
    handler: openRemoveModal(dataset),
  })

  let titleCellStyle = null
  if (indent) {
    titleCellStyle = { paddingLeft: '1rem', position: 'relative' }
  }

  return (
    <DatasetRow ref={rowRef} key={dataset.identifier} tabIndex="0" highlight={highlight}>
      <BodyCellWordWrap style={titleCellStyle}>
        {indent && <Marker />}
        {getTitle(dataset, lang)}
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
          onClick={handleEnterEdit(dataset)}
          content={
            dataset.next_draft ? 'qvain.datasets.editDraftButton' : 'qvain.datasets.editButton'
          }
        />
        {getGoToEtsinButton(dataset, getEtsinUrl, Matomo)}
        {actions.length === 1 ? (
          getActionButton(actions[0])
        ) : (
          <Dropdown buttonContent="qvain.datasets.moreActions" buttonComponent={DropdownButton}>
            {actions.map(action => getActionItem(action))}
          </Dropdown>
        )}
      </BodyCellActions>
    </DatasetRow>
  )
}

Dataset.propTypes = {
  dataset: PropTypes.object.isRequired,
  currentTimestamp: PropTypes.object.isRequired,
  handleEnterEdit: PropTypes.func.isRequired,
  handleUseAsTemplate: PropTypes.func.isRequired,
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
