import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { reaction } from 'mobx'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { Table, TableHeader, Row, HeaderCell, TableBody, TableNote } from '../general/table'
import { DatasetUrls } from '../utils/constants'
import Modal from '../../general/modal'
import DatasetPagination from './pagination'
import { TableButton, DangerButton } from '../general/buttons'
import { FormField, Input, Label as inputLabel } from '../general/form'
import DatasetGroup from './datasetGroup'
import { filterGroupsByTitle, groupDatasetsByVersionSet } from './filter'

class DatasetTable extends Component {
  minOfDataSetsForSearchTool = 5

  promises = []

  static propTypes = {
    history: PropTypes.object.isRequired,
    Stores: PropTypes.object.isRequired,
  }

  state = {
    datasets: [], // all datasets from METAX
    datasetGroups: [], // datasets grouped by version set
    filteredGroups: [], // narrowed datasets based on searchTerm
    count: 0, // how many there are, used to calculate page count
    limit: 20, // how many on one page, used to slice filtered into onPage content
    onPage: [], // what we see on the page
    page: 1, // current page
    loading: true, // used to display loading notification in the table
    error: false, // error notification status
    errorMessage: '', // error notification itself
    removeModalOpen: false, // delete/remove modal state
    removableDatasetIdentifier: undefined, // used to send the delete request to backend to target the correct dataset
    searchTerm: '', // used to narrow down content
    currentTimestamp: new Date(), // Only need to set this once, when the page is loaded,
  }

  componentDidMount() {
    this.getDatasets()
    // once we get login info, reload
    reaction(
      () => this.props.Stores.Auth.user.name,
      () => this.getDatasets()
    )
  }

  componentWillUnmount() {
    this.promises.forEach((promise) => promise.cancel())
  }

  getDatasets = () => {
    if (!this.props.Stores.Auth.user.name) {
      return null
    }

    this.setState({ loading: true, error: false, errorMessage: '' })
    let url
    if (this.props.Stores.Qvain.metaxApiV2) {
      url = `${DatasetUrls.V2_USER_DATASETS_URL}${this.props.Stores.Auth.user.name}?no_pagination=true`
    } else {
      url = `${DatasetUrls.USER_DATASETS_URL}${this.props.Stores.Auth.user.name}?no_pagination=true`
    }
    const promise = axios
      .get(url)
      .then((result) => {
        const datasets = result.data.filter((dataset) => !dataset.draft_of)
        const datasetGroups = groupDatasetsByVersionSet(datasets)

        this.setState(
          {
            count: datasets.length,
            datasets,
            datasetGroups,
            filteredGroups: datasetGroups,
            loading: false,
            error: false,
            errorMessage: undefined,
          },
          this.handleChangePage(1)
        )
      })
      .catch((e) => {
        console.log(e.message)
        this.setState({ loading: false, error: true, errorMessage: 'Failed to load datasets' })
      })
    this.promises.push(promise)
    return promise
  }

  handleCreateNewVersion = async (identifier) => {
    const { metaxApiV2 } = this.props.Stores.Qvain
    if (!metaxApiV2) {
      console.error('Metax API V2 is required for creating a new version')
      return
    }
    const promise = axios.post(DatasetUrls.V2_CREATE_NEW_VERSION, null, {
      params: { identifier },
    })
    this.promises.push(promise)
    const res = await promise
    const newIdentifier = res.data.identifier
    this.props.history.replace(`/qvain/dataset/${newIdentifier}`)
  }

  handleRemove = (identifier) => (event) => {
    event.preventDefault()
    const { metaxApiV2 } = this.props.Stores.Qvain

    let url = `${DatasetUrls.DATASET_URL}/${identifier}`
    if (metaxApiV2) {
      url = `${DatasetUrls.V2_DATASET_URL}/${identifier}`
    }

    const promise = axios
      .delete(url)
      .then(() => {
        const datasets = [...this.state.datasets.filter((d) => d.identifier !== identifier)]
        this.setState(
          (state) => ({
            datasets,
            filteredGroups: filterGroupsByTitle(state.searchTerm, state.datasetGroups),
            removeModalOpen: false,
            removableDatasetIdentifier: undefined,
          }),
          () => {
            // and refresh
            this.handleChangePage(this.state.page)()
          }
        )
      })
      .catch((err) => {
        this.setState({ error: true, errorMessage: err.message })
      })
    this.promises.push(promise)
    return promise
  }

  openRemoveModal = (identifier) => () => {
    this.setState({
      removeModalOpen: true,
      removableDatasetIdentifier: identifier,
    })
  }

  closeRemoveModal = () => {
    this.setState({
      removeModalOpen: false,
      removableDatasetIdentifier: undefined,
    })
  }

  noDatasets = () => {
    const { loading, datasets, error } = this.state
    return !loading && !error && datasets.length === 0
  }

  handleEnterEdit = (dataset) => () => {
    if (dataset.next_draft) {
      this.props.history.push(`/qvain/dataset/${dataset.next_draft.identifier}`)
      return
    }
    this.props.Stores.Qvain.editDataset(dataset)
    this.props.history.push(`/qvain/dataset/${dataset.identifier}`)
  }

  handleChangePage = (pageNum) => () => {
    const actualNum = pageNum - 1
    this.setState((state) => ({
      onPage: state.filteredGroups.slice(
        actualNum * state.limit,
        actualNum * state.limit + state.limit
      ),
      page: pageNum,
    }))
  }

  render() {
    const {
      onPage,
      loading,
      error,
      errorMessage,
      page,
      searchTerm,
      datasets,
      count,
      limit,
    } = this.state

    const { metaxApiV2 } = this.props.Stores.Qvain

    const noOfDatasets = datasets.length
    const searchInput =
      noOfDatasets > this.minOfDataSetsForSearchTool ? (
        <>
          <Translate component={SearchLabel} content="qvain.datasets.search.searchTitle" />
          <SearchField>
            <Translate
              className="visuallyhidden"
              htmlFor="datasetSearchInput"
              component={inputLabel}
              content="qvain.datasets.search.hidden"
            />
            <Translate
              component={SearchInput}
              id="datasetSearchInput"
              attributes={{ placeholder: 'qvain.datasets.search.placeholder' }}
              value={searchTerm}
              onChange={(event) => {
                const searchStr = event.target.value
                this.setState(
                  (state) => ({
                    searchTerm: searchStr,
                    // if we have a search term, look through all the titles of all the datasets and return the matching datasets
                    filteredGroups: filterGroupsByTitle(searchStr, state.datasetGroups),
                  }),
                  () => {
                    // as the callback, set count to reflect the new filtered datasets
                    this.setState((state) => ({ count: state.filteredGroups.length }))
                    // reload
                    this.handleChangePage(page)()
                  }
                )
              }}
            />
          </SearchField>
        </>
      ) : null
    return (
      <Fragment>
        {searchInput}
        <TablePadded className="table">
          <TableHeader>
            <Row>
              <Translate component={HeaderCell} content="qvain.datasets.tableRows.title" />
              {metaxApiV2 && (
                <Translate component={HeaderCell} content="qvain.datasets.tableRows.state" />
              )}
              <Translate component={HeaderCell} content="qvain.datasets.tableRows.created" />
              <Translate component={HeaderCell} content="qvain.datasets.tableRows.actions" />
            </Row>
          </TableHeader>
          <TableBody striped>
            {loading && <Translate component={TableNote} content="qvain.datasets.loading" />}
            {error && (
              <Fragment>
                <TableNote style={{ color: 'red' }}>
                  <Translate content="qvain.datasets.errorOccurred" />:
                  <ErrorMessage>{errorMessage}</ErrorMessage>
                </TableNote>
                <TableNote>
                  <Translate
                    style={{ height: '100%' }}
                    component={TableButton}
                    onClick={this.handleChangePage(page)}
                    content="qvain.datasets.reload"
                  />
                </TableNote>
              </Fragment>
            )}
            {this.noDatasets() && (
              <Translate component={TableNote} content="qvain.datasets.noDatasets" />
            )}
            {!error &&
              onPage.map((group) => (
                <DatasetGroup
                  datasets={group}
                  key={group[0].identifier}
                  dataset={group[0]}
                  currentTimestamp={this.state.currentTimestamp}
                  handleEnterEdit={this.handleEnterEdit}
                  handleCreateNewVersion={this.handleCreateNewVersion}
                  openRemoveModal={this.openRemoveModal}
                />
              ))}
          </TableBody>
        </TablePadded>
        <DatasetPagination
          id="pagination-bottom"
          page={page}
          count={count}
          limit={limit}
          onChangePage={this.handleChangePage}
        />
        <Modal
          isOpen={this.state.removeModalOpen}
          onRequestClose={this.closeRemoveModal}
          contentLabel="removeDatasetModal"
        >
          <Translate component="p" content="qvain.datasets.confirmDelete.text" />
          <TableButton onClick={this.closeRemoveModal}>
            <Translate content="qvain.datasets.confirmDelete.cancel" />
          </TableButton>
          <DangerButton onClick={this.handleRemove(this.state.removableDatasetIdentifier)}>
            <Translate content="qvain.datasets.confirmDelete.ok" />
          </DangerButton>
        </Modal>
      </Fragment>
    )
  }
}

const ErrorMessage = styled.span`
  margin-left: 10px;
`

const TablePadded = styled(Table)`
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 30px;
  margin-bottom: 30px;
`

const SearchField = styled(FormField)`
  vertical-align: middle;
  width: 100%;
  align-items: center;
`

const SearchLabel = styled.div`
  font-family: 'Lato', sans-serif;
  margin-bottom: 7px;
`

const SearchInput = styled(Input)`
  margin-bottom: inherit;
`

export default withRouter(inject('Stores')(observer(DatasetTable)))
