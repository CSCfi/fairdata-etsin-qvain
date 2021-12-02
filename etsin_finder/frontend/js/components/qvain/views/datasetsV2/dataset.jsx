import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronRight,
  faChevronDown,
  faEllipsisH,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'

import { useStores } from '../../utils/stores'
import formatAge from '../datasets/formatAge'
import { getDatasetActionsV2 } from '../datasets/datasetActions'
import { Dropdown, DropdownItem } from '../../../general/dropdown'

const getActionItem = action => {
  const { text, handler, danger, moreIfNarrow } = action
  return (
    <DropdownItem
      key={text}
      onClick={handler}
      danger={danger}
      color="error"
      onlyNarrow={!!moreIfNarrow}
    >
      <Translate content={text} />
    </DropdownItem>
  )
}

const getActionButton = action => (
  <Cell key={action.text} onlyNarrow={action.moreIfNarrow}>
    <Translate
      onClick={action.handler}
      component={IconButton}
      icon={action.icon}
      attributes={{ 'aria-label': action.text }}
    />
  </Cell>
)

const getTitle = (getValueTranslation, dataset) => {
  let researchDataset = dataset.research_dataset
  if (dataset.next_draft?.research_dataset?.title) {
    researchDataset = dataset.next_draft.research_dataset
  }
  return getValueTranslation(researchDataset.title)
}

const datasetStateTranslation = dataset => {
  if (dataset.state === 'published') {
    if (dataset.next_draft) {
      return 'qvain.datasets.state.changed'
    }
    return 'qvain.datasets.state.published'
  }
  return 'qvain.datasets.state.draft'
}

const datasetOwner = dataset => {
  const { sources = ['creator'] } = dataset
  if (sources.includes('creator')) {
    return <Translate content="qvain.datasets.owner.me" />
  }
  // shared with user
  return (
    <Translate
      component={FontAwesomeIcon}
      icon={faUsers}
      attributes={{ 'aria-label': 'qvain.datasets.owner.project' }}
    />
  )
}

const Dataset = ({ dataset, isExpanded, expandGroup, isLatest, versionNumber }) => {
  const Stores = useStores()
  const {
    QvainDatasets: { loadTime },
    Locale: { getValueTranslation },
  } = Stores

  const actions = getDatasetActionsV2(Stores, dataset)
  return (
    <StyledDataset isLatest={isLatest} key={dataset.id}>
      <PadCell />
      <Cell className="dataset-title" onClick={expandGroup}>
        <Title>
          {expandGroup && <ExpandIcon isExpanded={!!isExpanded} />}
          {versionNumber && <VersionNumber number={versionNumber} />}
          <span>{getTitle(getValueTranslation, dataset)}</span>
        </Title>
      </Cell>
      <Translate
        className="dataset-state"
        component={Cell}
        content={datasetStateTranslation(dataset)}
      />
      <Cell className="dataset-owner">{datasetOwner(dataset)}</Cell>
      <Cell className="dataset-created">{formatAge(loadTime, dataset.date_created)}</Cell>
      {actions.filter(action => action.icon).map(action => getActionButton(action))}
      <Cell className="dataset-more">
        <Dropdown
          buttonContent="qvain.datasets.moreActions"
          buttonComponent={IconButton}
          buttonProps={{ icon: faEllipsisH }}
          align="left"
        >
          {actions.filter(({ onlyIcon }) => !onlyIcon).map(action => getActionItem(action))}
        </Dropdown>
      </Cell>
      <PadCell />
    </StyledDataset>
  )
}

Dataset.propTypes = {
  dataset: PropTypes.object.isRequired,
  isLatest: PropTypes.bool,
  versionNumber: PropTypes.number,
  expandGroup: PropTypes.func,
  isExpanded: PropTypes.bool,
}

Dataset.defaultProps = {
  isLatest: false,
  versionNumber: undefined,
  expandGroup: undefined,
  isExpanded: false,
}

const ExpandIcon = ({ isExpanded, ...props }) => (
  <ExpandIconWrapper {...props}>
    <Translate
      component={FontAwesomeIcon}
      icon={isExpanded ? faChevronDown : faChevronRight}
      attributes={{
        'aria-label': `qvain.datasets.previousVersions.${isExpanded ? 'hide' : 'show'}`,
      }}
    />
  </ExpandIconWrapper>
)

ExpandIcon.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
}

const ExpandIconWrapper = styled.span`
  margin-right: 0.5rem;
  width: 1rem;
`

const IconButton = ({ icon, ...props }) => (
  <StyledIconButton {...props}>
    <FontAwesomeIcon icon={icon} />
  </StyledIconButton>
)

IconButton.propTypes = {
  icon: PropTypes.object.isRequired,
}

const StyledIconButton = styled.button.attrs({ type: 'button' })`
  color: inherit;
  border: none;
  background: transparent;
  height: 2.5rem;
  width: 4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
`

const StyledDataset = styled.tr`
  height: 4rem;
  font-size: 16px;
  ${p => p.isLatest && `td:not(${PadCell}) { border-top: 1px solid #cecece; }`}
`

const Cell = styled.td`
  vertical-align: middle;
  padding: 0.25rem;
  text-align: center;

  ${p => p.onClick && 'cursor: pointer; '}

  ${p =>
    p.onlyNarrow &&
    `
    display: none;
  `}
  @media screen and (min-width: ${p => p.theme.breakpoints.md}) {
    display: table-cell;
  }
`

const PadCell = styled.td.attrs({ 'aria-hidden': true })``

const Title = styled.div`
  word-break: break-word;
  text-align: left;
  display: flex;
  padding-left: 0.5rem;
`

const VersionNumber = ({ number }) => (
  <StyledVersionNumber>{`Version ${number}`}</StyledVersionNumber>
)

VersionNumber.propTypes = {
  number: PropTypes.number.isRequired,
}

const StyledVersionNumber = styled.span`
  margin-left: 0.5rem;
  margin-right: 1rem;
  font-weight: bold;
  display: none;
  @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
    display: inline;
  }
`

export default observer(Dataset)
