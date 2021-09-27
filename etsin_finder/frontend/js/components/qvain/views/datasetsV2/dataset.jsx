import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faEllipsisH, faUsers } from '@fortawesome/free-solid-svg-icons'

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
  if (sources.includes('project')) {
    return (
      <Translate
        component={FontAwesomeIcon}
        icon={faUsers}
        attributes={{ 'aria-label': 'qvain.datasets.owner.project' }}
      />
    )
  }
  return null
}

const Dataset = ({ dataset, canExpand }) => {
  const Stores = useStores()
  const {
    QvainDatasets: { loadTime },
    Locale: { getValueTranslation },
  } = Stores

  const actions = getDatasetActionsV2(Stores, dataset)

  return (
    <StyledDataset key={dataset.id}>
      <Cell className="dataset-title">
        <Title>
          <ExpandIcon visible={canExpand} />
          {getTitle(getValueTranslation, dataset)}
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
        >
          {actions.filter(({ onlyIcon }) => !onlyIcon).map(action => getActionItem(action))}
        </Dropdown>
      </Cell>
    </StyledDataset>
  )
}

Dataset.propTypes = {
  dataset: PropTypes.object.isRequired,
  canExpand: PropTypes.bool.isRequired,
}

const ExpandIcon = ({ ...props }) => (
  <ExpandIconWrapper {...props}>
    <FontAwesomeIcon icon={faChevronRight} />
  </ExpandIconWrapper>
)

const ExpandIconWrapper = styled.span`
  ${p => !p.visible && `visibility: hidden;`}
  margin-right: 1rem;
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
  width: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
`

const StyledDataset = styled.tr`
  :not(:last-child) {
    border-bottom: 1px solid #cecece;
  }
  height: 4rem;
  font-size: 16px;
`

const Cell = styled.td`
  vertical-align: middle;
  padding: 0.25rem;
  text-align: center;

  ${p =>
    p.onlyNarrow &&
    `
    display: none;
  `}
  @media screen and (min-width: ${p => p.theme.breakpoints.md}) {
    display: table-cell;
  }
`

const Title = styled.div`
  word-break: break-word;
  text-align: left;
  display: flex;
`

export default observer(Dataset)
