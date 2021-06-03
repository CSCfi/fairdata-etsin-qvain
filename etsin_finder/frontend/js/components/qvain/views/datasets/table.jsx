import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { reaction } from 'mobx'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import { Table, TableHeader, Row, HeaderCell, TableBody, TableNote } from '../../general/card/table'
import RemoveModal from './removeModal'
import DatasetPagination from './pagination'
import { TableButton } from '../../general/buttons'
import DatasetGroup from './datasetGroup'
import etsinTheme from '../../../../styles/theme'
import { withStores } from '../../../../stores/stores'
import SearchInput from './searchInput'

export class DatasetTable extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    currentTimestamp: new Date(), // Only need to set this once, when the page is loaded,
  }

  componentDidMount() {
    const { loadDatasets } = this.props.Stores.QvainDatasets
    loadDatasets()
    reaction(
      () => this.props.Stores.Auth.user.name,
      () => loadDatasets()
    )
  }

  componentWillUnmount() {
    const { reset } = this.props.Stores.QvainDatasets
    reset()
  }

  noDatasets = () => {
    const { error, count, isLoadingDatasets } = this.props.Stores.QvainDatasets
    return !isLoadingDatasets && !error && count === 0
  }

  render() {
    const {
      error,
      count,
      page,
      setPage,
      datasetGroupsOnPage,
      isLoadingDatasets,
      loadDatasets,
      publishedDataset,
      datasetsPerPage,
    } = this.props.Stores.QvainDatasets

    return (
      <>
        <SearchInput />
        <TablePadded className="table">
          <TableHeader>
            <Row>
              <Translate component={HeaderCell} content="qvain.datasets.tableRows.title" />
              <Translate component={HeaderCell} content="qvain.datasets.tableRows.state" />
              <Translate component={HeaderCell} content="qvain.datasets.tableRows.created" />
              <Translate component={HeaderCell} content="qvain.datasets.tableRows.actions" />
            </Row>
          </TableHeader>
          <TableBody striped>
            {isLoadingDatasets && (
              <Translate component={TableNote} content="qvain.datasets.loading" />
            )}
            {error && (
              <>
                <TableNote style={{ color: etsinTheme.color.redText }}>
                  <Translate content="qvain.datasets.errorOccurred" />:
                  <ErrorMessage>{error.message || error.toString()}</ErrorMessage>
                </TableNote>
                <TableNote>
                  <Translate
                    style={{ height: '100%' }}
                    component={TableButton}
                    onClick={loadDatasets}
                    content="qvain.datasets.reload"
                  />
                </TableNote>
              </>
            )}
            {this.noDatasets() && (
              <Translate component={TableNote} content="qvain.datasets.noDatasets" />
            )}
            {!error &&
              datasetGroupsOnPage.map(group => (
                <DatasetGroup
                  datasets={group}
                  key={group[0].identifier}
                  currentTimestamp={this.state.currentTimestamp}
                  handleEnterEdit={this.handleEnterEdit}
                  handleUseAsTemplate={this.handleUseAsTemplate}
                  handleCreateNewVersion={this.handleCreateNewVersion}
                  highlight={publishedDataset}
                />
              ))}
          </TableBody>
        </TablePadded>
        <DatasetPagination
          id="pagination-bottom"
          page={page}
          count={count}
          limit={datasetsPerPage}
          onChangePage={setPage}
        />
        <RemoveModal />
      </>
    )
  }
}

const ErrorMessage = styled.span`
  color: ${props => props.theme.color.redText};
  margin-left: 10px;
`

const TablePadded = styled(Table)`
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 30px;
  margin-bottom: 30px;
`

export default withStores(observer(DatasetTable))
