import { useState } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled, { css } from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronRight,
  faChevronDown,
  faEllipsisH,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import formatAge from './formatAge'
import { getDatasetActionsV2 } from './datasetActions'
import { Dropdown, DropdownItem } from '@/components/general/dropdown'
import { DatasetStateTag } from './tags'
import withCustomProps from '@/utils/withCustomProps'

const getActionMenuItem = action => {
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
      content={action.shortText}
      component={IconButton}
      icon={action.icon}
      onlyIcon={action.onlyIcon}
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

const getDatasetState = dataset => {
  if (dataset.state === 'published') {
    if (dataset.next_draft) {
      return 'changed'
    }
    return 'published'
  }
  return 'draft'
}

const datasetOwner = (dataset, username) => {
  const sources = dataset.sources || [] // sources only used in V2
  if (sources.includes('creator') || dataset.metadata_provider_user === username) {
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

const Dataset = ({ dataset, group, isExpanded, expandGroup, isLatest, versionNumber }) => {
  const Stores = useStores()
  const {
    QvainDatasets: { loadTime },
    Locale,
    Auth,
  } = Stores
  const { getValueTranslation } = Locale

  const actions = getDatasetActionsV2(Stores, dataset, group)
  return (
    <StyledDataset
      isLatest={isLatest}
      key={dataset.id}
      data-cy={`dataset-${getTitle(getValueTranslation, dataset)}`}
    >
      <PadCell />
      <Cell className="dataset-title" onClick={expandGroup}>
        <Title>
          {expandGroup && <ExpandIcon isExpanded={!!isExpanded} />}
          {versionNumber && <VersionNumber number={versionNumber} />}
          <span>{getTitle(getValueTranslation, dataset)}</span>
        </Title>
      </Cell>
      <Cell className="dataset-state">
        <DatasetStateTag state={getDatasetState(dataset)} />
      </Cell>
      <Cell className="dataset-owner">{datasetOwner(dataset, Auth.userName)}</Cell>
      <Cell className="dataset-created">{formatAge(Locale, loadTime, dataset.date_created)}</Cell>
      {actions.filter(action => action.icon).map(action => getActionButton(action))}
      <Cell className="dataset-more">
        <Dropdown
          buttonContent="qvain.datasets.moreActions"
          buttonComponent={IconButton}
          buttonProps={{ icon: faEllipsisH }}
          align="left"
          icon={null}
        >
          {actions
            .filter(({ moreIfNarrow, more }) => moreIfNarrow || more)
            .map(action => getActionMenuItem(action))}
        </Dropdown>
      </Cell>
      <PadCell />
    </StyledDataset>
  )
}

Dataset.propTypes = {
  dataset: PropTypes.object.isRequired,
  group: PropTypes.array.isRequired,
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

const IconButton = ({ icon, children, onlyIcon, ...props }) => {
  const [color, setColor] = useState('darkgray')
  return (
    <StyledIconButton
      {...props}
      onlyIcon={onlyIcon || !children}
      onMouseLeave={() => setColor('darkgray')}
      onMouseEnter={() => setColor('primary')}
      color={color}
    >
      <StyledFontAwesomeIcon icon={icon} color={color} />
      {!onlyIcon && children}
    </StyledIconButton>
  )
}

IconButton.propTypes = {
  icon: PropTypes.object.isRequired,
  onlyIcon: PropTypes.bool,
  children: PropTypes.node,
}

IconButton.defaultProps = {
  onlyIcon: false,
  children: undefined,
}

const onlyIconStyling = css`
  border: solid ${props => props.theme.color.gray} 1px;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 12pt;
  width: 100%;
  gap: 0.25rem;
`

const StyledIconButton = withCustomProps(styled.button).attrs({ type: 'button' })`
  color: ${p => p.theme.color[p.color]};
  border: none;
  background: transparent;
  width: 4rem;
  display: inline-flex;
  align-items: center;
  justify-content: space-evenly;
  cursor: pointer;
  font-size: 20px;
  ${props => !props.onlyIcon && onlyIconStyling}
  &:hover {
    color: ${props => props.theme.color.primary};
    border-color: ${props => props.theme.color.primary};
    background-color: ${props => props.theme.color.primaryLight};
  }
`

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: ${props => props.theme.color[props.color]};
  margin-right: 0.25rem;
`

const StyledDataset = withCustomProps(styled.tr)`
  height: 4rem;
  font-size: 16px;
  ${p => p.isLatest && `td:not(${PadCell}) { border-top: 1px solid #cecece; }`}
`

const Cell = withCustomProps(styled.td)`
  vertical-align: middle;
  padding: 0.25rem 0.5rem;
  text-align: center;

  ${p => p.onClick && 'cursor: pointer; '}

  ${p =>
    p.onlyNarrow &&
    `
    display: none;
  `}
  @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
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
