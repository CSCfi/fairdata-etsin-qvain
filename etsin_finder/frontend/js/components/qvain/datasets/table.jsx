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
import { DataCatalogIdentifiers, DatasetUrls } from '../utils/constants'
import Modal from '../../general/modal'
import DatasetPagination from './pagination'
import Label from '../general/label'
import { TableButton, RemoveButton, DangerButton } from '../general/buttons'
import { FormField, Input, Label as inputLabel } from '../general/form'
import TablePasState from './tablePasState'

class DatasetTable extends Component {
  minOfDataSetsForSearchTool = 5

  promises = []

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

  componentWillUnmount() {
    this.promises.forEach((promise) => promise.cancel())
  }

  getDatasets = () => {
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
      onPage: state.filtered.slice(actualNum * state.limit, actualNum * state.limit + state.limit),
      page: pageNum,
    }))
  }

  filterByTitle = (searchStr, datasets) => {
    if (searchStr.trim().length > 0) {
      return datasets.filter((ds) => {
        const titles = Object.values(ds.research_dataset.title)
        const matches = titles.map((title) => title.toLowerCase().includes(searchStr.toLowerCase())) // ignore cases
        return matches.includes(true)
      })
    }
    return datasets
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

  formatDatasetState = (dataset) => {
    if (dataset.state === 'published') {
      if (dataset.next_draft) {
        return 'qvain.datasets.state.changed'
      }
      return 'qvain.datasets.state.published'
    }
    return 'qvain.datasets.state.draft'
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

    const getGoToEtsinButton = (dataset) => {
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
                  {metaxApiV2 && (
                    <BodyCell>
                      <Translate content={this.formatDatasetState(dataset)} />
                    </BodyCell>
                  )}
                  <BodyCell>{this.formatDatasetDateCreated(dataset.date_created)}</BodyCell>
                  <BodyCellActions>
                    <Translate
                      component={TableButton}
                      onClick={this.handleEnterEdit(dataset)}
                      content={
                        dataset.next_draft
                          ? 'qvain.datasets.editDraftButton'
                          : 'qvain.datasets.editButton'
                      }
                    />
                    {getGoToEtsinButton(dataset)}
                    {metaxApiV2 &&
                      dataset.next_dataset_version === undefined &&
                      dataset.state === 'published' && (
                        <Translate
                          component={TableButton}
                          onClick={() => this.handleCreateNewVersion(dataset.identifier)}
                          content="qvain.datasets.createNewVersion"
                        />
                      )}
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
