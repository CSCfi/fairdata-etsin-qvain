import React, { useState } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronUp } from '@fortawesome/free-solid-svg-icons'

import { Row, BodyCell } from '../../general/card/table'
import Dataset from './dataset'

const DatasetGroup = ({
  datasets,
  currentTimestamp,
  handleEnterEdit,
  handleUseAsTemplate,
  handleCreateNewVersion,
  openRemoveModal,
  highlight,
}) => {
  const [showAll, setShowAll] = useState(false)

  if (datasets.length <= 1) {
    return (
      <Dataset
        dataset={datasets[0]}
        currentTimestamp={currentTimestamp}
        handleEnterEdit={handleEnterEdit}
        handleUseAsTemplate={handleUseAsTemplate}
        handleCreateNewVersion={handleCreateNewVersion}
        openRemoveModal={openRemoveModal}
        highlight={datasets[0].identifier === highlight}
      />
    )
  }

  let visibleDatasets = [datasets[0]]

  const moreText = showAll ? 'qvain.datasets.hideVersions' : 'qvain.datasets.moreVersions'
  const more = (
    <Row>
      <MoreButtonCell colSpan="5">
        <MoreButton onClick={() => setShowAll(!showAll)}>
          <MoreIcon icon={showAll ? faChevronUp : faChevronRight} />
          <Translate content={moreText} with={{ count: datasets.length - 1 }} />
        </MoreButton>
      </MoreButtonCell>
    </Row>
  )
  if (showAll) {
    visibleDatasets = datasets
  }

  return (
    <>
      {visibleDatasets.map((dataset, index) => (
        <Dataset
          key={dataset.identifier}
          dataset={dataset}
          currentTimestamp={currentTimestamp}
          handleEnterEdit={handleEnterEdit}
          handleUseAsTemplate={handleUseAsTemplate}
          handleCreateNewVersion={handleCreateNewVersion}
          openRemoveModal={openRemoveModal}
          indent={index !== 0}
          highlight={dataset.identifier === highlight}
        />
      ))}
      {more}
    </>
  )
}

DatasetGroup.propTypes = {
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentTimestamp: PropTypes.object.isRequired,
  handleEnterEdit: PropTypes.func.isRequired,
  handleUseAsTemplate: PropTypes.func.isRequired,
  handleCreateNewVersion: PropTypes.func.isRequired,
  openRemoveModal: PropTypes.func.isRequired,
  highlight: PropTypes.string,
}

DatasetGroup.defaultProps = {
  highlight: null,
}

const MoreButtonCell = styled(BodyCell)`
  padding: 0;
`

export const MoreButton = styled.button.attrs(() => ({ type: 'button' }))`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  color: inherit;
  padding: 0.25rem 0.125rem;
  width: 100%;
`

const MoreIcon = styled(FontAwesomeIcon)`
  margin: 0 0.5rem 0 0.5rem;
`

export default observer(DatasetGroup)
