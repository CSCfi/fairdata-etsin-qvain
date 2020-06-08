import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

import { Row, BodyCell } from '../general/table'
import Dataset, { GroupMarker } from './dataset'

class DatasetGroup extends Component {
  state = {
    showAll: false,
  }

  setShowAll = (value) => {
    this.setState({ showAll: value })
  }

  render() {
    const { datasets } = this.props

    if (datasets.length <= 1) {
      return (
        <Dataset
          dataset={datasets[0]}
          currentTimestamp={this.props.currentTimestamp}
          handleEnterEdit={this.props.handleEnterEdit}
          handleCreateNewVersion={this.props.handleCreateNewVersion}
          openRemoveModal={this.props.openRemoveModal}
        />
      )
    }

    let visibleDatasets = [datasets[0]]

    const { showAll } = this.state

    const moreText = showAll ? 'qvain.datasets.hideVersions' : 'qvain.datasets.moreVersions'
    const more = (
      <Row>
        <BodyCell colSpan="5">
          <GroupMarker position="end" />
          <MoreButton onClick={() => this.setShowAll(!showAll)}>
            <MoreIcon icon={showAll ? faChevronUp : faChevronDown} />
            <Translate content={moreText} with={{ count: datasets.length - 1 }} />
          </MoreButton>
        </BodyCell>
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
            currentTimestamp={this.props.currentTimestamp}
            handleEnterEdit={this.props.handleEnterEdit}
            handleCreateNewVersion={this.props.handleCreateNewVersion}
            openRemoveModal={this.props.openRemoveModal}
            inGroup
            groupPosition={index === 0 ? 'start' : 'middle'}
          />
        ))}
        {more}
      </>
    )
  }
}

DatasetGroup.propTypes = {
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentTimestamp: PropTypes.object.isRequired,
  handleEnterEdit: PropTypes.func.isRequired,
  handleCreateNewVersion: PropTypes.func.isRequired,
  openRemoveModal: PropTypes.func.isRequired,
}

const MoreButton = styled.button.attrs(() => ({ type: 'button' }))`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  color: inherit;
  padding: 0.125rem;
  width: 100%;
`

const MoreIcon = styled(FontAwesomeIcon)`
  margin: 0 0.5rem;
`

export default observer(DatasetGroup)
