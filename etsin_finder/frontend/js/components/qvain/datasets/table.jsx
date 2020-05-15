import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { reaction } from 'mobx'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import moment from 'moment'
import {
  Table,
  TableHeader,
  Row,
  HeaderCell,
  TableBody,
  BodyCell,
  TableNote,
} from '../general/table'
import { DataCatalogIdentifiers } from '../utils/constants'
import Modal from '../../general/modal'
import DatasetPagination from './pagination'
import Label from '../general/label'
import { TableButton, RemoveButton, DangerButton } from '../general/buttons'
import { FormField, Input, Label as inputLabel } from '../general/form'
import TablePasState from './tablePasState'

const USER_DATASETS_URL = '/api/datasets/'

class DatasetTable extends Component {
  minOfDataSetsForSearchTool = 5

  static propTypes = {
    history: PropTypes.object.isRequired,
    Stores: PropTypes.object.isRequired,
  }

  state = {
    datasets: [], // all datasets from METAX
    filtered: [], // narrowed datasets based on searchTerm
    count: 0, // how many there are, used to calculate page count
    limit: 20, // how many on one page, used to slice filtered into onPage content
    onPage: [], // what we see on the page
    page: 1, // current page
    loading: false, // used to display loading notification in the table
    error: false, // error notification status
    errorMessage: '', // error notification itself
    removeModalOpen: false, // delete/remove modal state
    removableDatasetIdentifier: undefined, // used to send the delete request to backend to target the correct dataset
    searchTerm: '', // used to narrow down content
    currentTimestamp: undefined, // Only need to set this once, when the page is loaded
  }

  componentDidMount() {
    this.state.currentTimestamp = new Date()
    this.getDatasets()
    // once we get login info, reload
    reaction(
      () => this.props.Stores.Auth.user.name,
      () => this.getDatasets()
    )
  }

  getDatasets = () => {
    this.setState({ loading: true, error: false, errorMessage: '' })
    const url = `${USER_DATASETS_URL}${this.props.Stores.Auth.user.name}?no_pagination=true`
    return axios
      .get(url)
      .then((result) => {
        const datasets = [...result.data]
        this.setState(
          {
            count: datasets.length,
            datasets,
            filtered: datasets,
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
  }

  handleRemove = (identifier) => (event) => {
    event.preventDefault()
    axios
      .delete(`/api/dataset/${identifier}`)
      .then(() => {
        const datasets = [...this.state.datasets.filter((d) => d.identifier !== identifier)]
        this.setState(
          (state) => ({
            datasets,
            filtered: this.filterByTitle(state.searchTerm, datasets),
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
    this.props.Stores.Qvain.editDataset(dataset)
    this.props.history.push(`/qvain/dataset/${dataset.identifier}`)
  }

  handleChangePage = (pageNum) => () => {
    const actualNum = pageNum - 1
    this.setState((state) => ({
      count: state.datasets.length,
      onPage: state.filtered.slice(actualNum * state.limit, actualNum * state.limit + state.limit),
      page: pageNum,
    }))
  }

  formatDatasetDateCreated = (datasetDateCreated) => {
    const timestampCurrentTime = moment(this.state.currentTimestamp)
    const timestampDateCreated = moment(datasetDateCreated)

    const secondsSinceCreation = timestampCurrentTime.diff(timestampDateCreated, 'seconds')

    let formattedDate

    // Time intervals retrieved from Moment.js documentation
    // For instance, 45 seconds is not exactly a minute, but roughly a minute, and can be displayed as one.
    if (secondsSinceCreation < 45) {
      formattedDate = translate('qvain.datasets.tableRows.dateFormat.moments')
    } else if (secondsSinceCreation < 90) {
      formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneMinute')
    } else if (secondsSinceCreation < 3700) {
      formattedDate = `${timestampCurrentTime.diff(timestampDateCreated, 'minutes')} ${translate(
        'qvain.datasets.tableRows.dateFormat.minutes'
      )}`
    } else if (secondsSinceCreation < 5400) {
      formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneHour')
    } else if (secondsSinceCreation < 79200) {
      formattedDate = `${timestampCurrentTime.diff(timestampDateCreated, 'hours')} ${translate(
        'qvain.datasets.tableRows.dateFormat.hours'
      )}`
    } else if (secondsSinceCreation < 129600) {
      formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneDay')
    } else if (secondsSinceCreation < 2160000) {
      formattedDate = `${timestampCurrentTime.diff(timestampDateCreated, 'days')} ${translate(
        'qvain.datasets.tableRows.dateFormat.days'
      )}`
    } else {
      // More than a month ago, compare by months
      const monthsSinceCreation = timestampCurrentTime.diff(timestampDateCreated, 'months')

      if (monthsSinceCreation >= 1) {
        formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneMonth')
      } else if (monthsSinceCreation >= 10) {
        formattedDate = `${monthsSinceCreation} ${translate(
          'qvain.datasets.tableRows.dateFormat.months'
        )}`
      } else if (monthsSinceCreation >= 18) {
        formattedDate = translate('qvain.datasets.tableRows.dateFormat.oneYear')
      } else {
        // Years (in plural), compare by years
        formattedDate = `${timestampCurrentTime.diff(timestampDateCreated, 'years')} ${translate(
          'qvain.datasets.tableRows.dateFormat.years'
        )}`
      }
    }

    return formattedDate
  }

  createDatasetPagination = (id) => {
    const { page, count, limit, datasets } = this.state
    const noOfVisibleDatasets = count || datasets.length
    return noOfVisibleDatasets > limit ? (
      <DatasetPagination
        id={id}
        page={page}
        count={count}
        limit={limit}
        onChangePage={this.handleChangePage}
      />
    ) : null
  }

  filterByTitle(searchStr, datasets) {
    return searchStr.trim().length > 0
      ? datasets.filter((ds) => {
          const titles = Object.values(ds.research_dataset.title)
          const matches = titles.map((title) =>
            title.toLowerCase().includes(searchStr.toLowerCase())
          ) // ignore cases
          return matches.includes(true)
        })
      : datasets
  }

  render() {
    const { onPage, loading, error, errorMessage, page, searchTerm, datasets } = this.state

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
                    filtered: this.filterByTitle(searchStr, state.datasets),
                  }),
                  () => {
                    // as the callback, set count to reflect the new filtered datasets
                    this.setState((state) => ({ count: state.filtered.length }))
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
        {this.createDatasetPagination('pagination-top')}
        <Translate component={'h3'} content="qvain.datasets.tableHeader" />
        <TablePadded className="table">
          <TableHeader>
            <Row>
              <Translate component={HeaderCell} content="qvain.datasets.tableRows.title" />
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
              onPage.map((dataset) => (
                <Row key={dataset.identifier} tabIndex="0">
                  <BodyCellWordWrap>
                    {dataset.research_dataset.title.en || dataset.research_dataset.title.fi}
                    {dataset.next_dataset_version !== undefined && (
                      <Translate
                        color="yellow"
                        content="qvain.datasets.oldVersion"
                        component={DatasetLabel}
                      />
                    )}
                    {dataset.deprecated && (
                      <Translate
                        color="error"
                        content="qvain.datasets.deprecated"
                        component={DatasetLabel}
                      />
                    )}
                    {(dataset.preservation_state > 0 ||
                      dataset.data_catalog.identifier === DataCatalogIdentifiers.PAS) && (
                      <TablePasState preservationState={dataset.preservation_state} />
                    )}
                  </BodyCellWordWrap>
                  <BodyCell>{this.formatDatasetDateCreated(dataset.date_created)}</BodyCell>
                  <BodyCellActions>
                    <Translate
                      component={TableButton}
                      onClick={this.handleEnterEdit(dataset)}
                      content="qvain.datasets.editButton"
                    />
                    <Translate
                      component={TableButton}
                      onClick={() => window.open(`/dataset/${dataset.identifier}`, '_blank')}
                      content="qvain.datasets.goToEtsin"
                    />
                    <Translate
                      component={RemoveButton}
                      onClick={this.openRemoveModal(dataset.identifier)}
                      content="qvain.datasets.deleteButton"
                    />
                  </BodyCellActions>
                </Row>
              ))}
          </TableBody>
        </TablePadded>
        {this.createDatasetPagination('pagination-bottom')}
        <Modal
          isOpen={this.state.removeModalOpen}
          onRequestClose={this.closeRemoveModal}
          contentLabel="removeDatasetModal"
        >
          <Translate component="p" content="qvain.datasets.confirmDelete" />
          <TableButton onClick={this.closeRemoveModal}>Cancel</TableButton>
          <DangerButton onClick={this.handleRemove(this.state.removableDatasetIdentifier)}>
            Remove
          </DangerButton>
        </Modal>
      </Fragment>
    )
  }
}

const DatasetLabel = styled(Label)`
  margin-left: 10px;
  text-transform: uppercase;
`

const ErrorMessage = styled.span`
  margin-left: 10px;
`

const TablePadded = styled(Table)`
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 30px;
  margin-bottom: 30px;
`
const SearchLabel = styled.div`
  font-family: 'Lato', sans-serif;
  margin-bottom: 7px;
`

const SearchField = styled(FormField)`
  vertical-align: middle;
  width: 100%;
  align-items: center;
`

const SearchInput = styled(Input)`
  margin-bottom: inherit;
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

export default withRouter(inject('Stores')(observer(DatasetTable)))
