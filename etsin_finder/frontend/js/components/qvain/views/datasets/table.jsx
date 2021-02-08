import React, { Component, Fragment } from 'react'
import { observer } from 'mobx-react'
import { reaction } from 'mobx'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import { Table, TableHeader, Row, HeaderCell, TableBody, TableNote } from '../../general/card/table'
import urls from '../../utils/urls'
import RemoveModal from './removeModal'
import DatasetPagination from './pagination'
import { TableButton } from '../../general/buttons'
import { FormField, Input, Label as inputLabel } from '../../general/modal/form'
import DatasetGroup from './datasetGroup'
import { filterGroupsByTitle, groupDatasetsByVersionSet } from './filter'
import etsinTheme from '../../../../styles/theme'
import { withStores } from '../../../../stores/stores'

class DatasetTable extends Component {
  promises = []

  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
    Stores: PropTypes.object.isRequired,
  }

  state = {
    datasets: [], // all datasets from METAX
    datasetGroups: [], // datasets grouped by version set
    filteredGroups: [], // narrowed datasets based on searchTerm
    count: 0, // how many there are, used to calculate page count
    onPage: [], // what we see on the page
    page: 1, // current page
    loading: true, // used to display loading notification in the table
    error: false, // error notification status
    errorMessage: '', // error notification itself
    removeModalDataset: undefined, // used to send the delete request to backend to target the correct dataset
    removeModalOnlyChanges: false, // if true, delete only unpublished changes, not the entire dataset
    searchTerm: '', // used to narrow down content
    currentTimestamp: new Date(), // Only need to set this once, when the page is loaded,
  }

  componentDidMount() {
    const { publishedDataset } = this.props.Stores.QvainDatasets
    this.getDatasets().then(() => this.showDataset(publishedDataset))
    // once we get login info, reload
    reaction(
      () => this.props.Stores.Auth.user.name,
      () => this.getDatasets().then(() => this.showDataset(publishedDataset))
    )
  }

  componentWillUnmount() {
    const { setPublishedDataset } = this.props.Stores.QvainDatasets
    setPublishedDataset(null)
    this.promises.forEach(promise => promise.cancel())
  }

  attachDrafts = (datasets, drafts) => {
    // Assign draft dataset to next_draft field of original dataset, so all fields
    // of the draft are available from the original dataset instead of just identifiers.
    const datasetsById = {}
    datasets.forEach(dataset => {
      datasetsById[dataset.identifier] = dataset
    })
    drafts.forEach(draft => {
      const dataset = datasetsById[draft.draft_of.identifier]
      if (dataset && dataset.next_draft && dataset.next_draft.identifier === draft.identifier) {
        Object.assign(dataset.next_draft, draft)
      }
    })
  }

  showDataset = identifier => {
    // move dataset to beginning of list
    const index = this.state.datasets.findIndex(dataset => dataset.identifier === identifier)
    if (index > 0) {
      this.setState(
        state => {
          const datasets = [...state.datasets]
          const dataset = datasets.splice(index, 1)[0]
          datasets.unshift(dataset)
          const datasetGroups = groupDatasetsByVersionSet(datasets)
          return {
            datasets,
            datasetGroups,
            filteredGroups: datasetGroups,
          }
        },
        () => {
          // and refresh
          this.handleChangePage(this.state.page)()
        }
      )
    }
  }

  getDatasets = async () => {
    if (!this.props.Stores.Auth.user.name) {
      return null
    }

    this.setState({ loading: true, error: false, errorMessage: '' })
    let url
    if (this.props.Stores.Env.metaxApiV2) {
      url = urls.v2.datasets()
    } else {
      url = urls.v1.datasets()
    }
    const promise = axios
      .get(url, { params: { no_pagination: true } })
      .then(result => {
        const data = result.data || []
        const datasets = data.filter(dataset => !dataset.draft_of)
        const datasetDrafts = data.filter(dataset => dataset.draft_of)
        this.attachDrafts(datasets, datasetDrafts)
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
      .catch(e => {
        console.error(e.message)
        this.setState({ loading: false, error: true, errorMessage: 'Failed to load datasets' })
      })
    this.promises.push(promise)
    return promise
  }

  handleCreateNewVersion = async identifier => {
    const { metaxApiV2, getQvainUrl } = this.props.Stores.Env
    if (!metaxApiV2) {
      console.error('Metax API V2 is required for creating a new version')
      return
    }
    const promise = axios.post(urls.v2.rpc.createNewVersion(), null, {
      params: { identifier },
    })
    this.promises.push(promise)
    const res = await promise
    const newIdentifier = res.data.identifier
    this.props.history.push(getQvainUrl(`/dataset/${newIdentifier}`))
  }

  postRemoveUpdate = (dataset, onlyChanges) => {
    // update dataset list after dataset removal
    let datasets = [...this.state.datasets]
    const identifier = dataset.identifier
    if (onlyChanges) {
      const datasetIndex = datasets.findIndex(d => d.identifier === identifier)
      if (datasetIndex >= 0) {
        const datasetCopy = { ...datasets[datasetIndex] }
        delete datasetCopy.next_draft
        datasets[datasetIndex] = datasetCopy
      }
    } else {
      datasets = datasets.filter(d => d.identifier !== identifier)
    }
    const datasetGroups = groupDatasetsByVersionSet(datasets)
    this.setState(state => ({
      datasets,
      datasetGroups,
      filteredGroups: filterGroupsByTitle(state.searchTerm, datasetGroups),
    }))
    this.handleChangePage(this.state.page)()
  }

  openRemoveModal = (dataset, onlyChanges) => () => {
    this.setState({
      removeModalDataset: dataset,
      removeModalOnlyChanges: onlyChanges,
    })
  }

  closeRemoveModal = () => {
    this.setState({
      removeModalDataset: null,
      removeModalOnlyChanges: null,
    })
  }

  noDatasets = () => {
    const { loading, datasets, error } = this.state
    return !loading && !error && datasets.length === 0
  }

  handleEnterEdit = dataset => () => {
    const { getQvainUrl } = this.props.Stores.Env
    if (dataset.next_draft) {
      this.props.history.push(getQvainUrl(`/dataset/${dataset.next_draft.identifier}`))
      return
    }
    this.props.Stores.Qvain.editDataset(dataset)
    this.props.history.push(getQvainUrl(`/dataset/${dataset.identifier}`))
  }

  handleUseAsTemplate = dataset => {
    const { getQvainUrl } = this.props.Stores.Env
    this.props.history.push(getQvainUrl('/dataset'))

    if (dataset.next_draft?.identifier) {
      this.props.Stores.Qvain.resetWithTemplate(dataset.next_draft)
    } else {
      this.props.Stores.Qvain.resetWithTemplate(dataset)
    }
  }

  handleChangePage = pageNum => () => {
    const { datasetsPerPage } = this.props.Stores.QvainDatasets

    const actualNum = pageNum - 1
    this.setState(state => ({
      onPage: state.filteredGroups.slice(
        actualNum * datasetsPerPage,
        (actualNum + 1) * datasetsPerPage
      ),
      page: pageNum,
    }))
  }

  render() {
    const { onPage, loading, error, errorMessage, page, searchTerm, datasets, count } = this.state

    const { metaxApiV2 } = this.props.Stores.Env
    const {
      publishedDataset,
      datasetsPerPage,
      minDatasetsForSearchTool,
    } = this.props.Stores.QvainDatasets

    const noOfDatasets = datasets.length
    const searchInput = noOfDatasets > minDatasetsForSearchTool && (
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
            onChange={event => {
              const searchStr = event.target.value
              this.setState(
                state => ({
                  searchTerm: searchStr,
                  // if we have a search term, look through all the titles of all the datasets and return the matching datasets
                  filteredGroups: filterGroupsByTitle(searchStr, state.datasetGroups),
                }),
                () => {
                  // as the callback, set count to reflect the new filtered datasets
                  this.setState(state => ({ count: state.filteredGroups.length }))
                  // reload
                  this.handleChangePage(page)()
                }
              )
            }}
          />
        </SearchField>
      </>
    )

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
                <TableNote style={{ color: etsinTheme.color.redText }}>
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
              onPage.map(group => (
                <DatasetGroup
                  datasets={group}
                  key={group[0].identifier}
                  currentTimestamp={this.state.currentTimestamp}
                  handleEnterEdit={this.handleEnterEdit}
                  handleUseAsTemplate={this.handleUseAsTemplate}
                  handleCreateNewVersion={this.handleCreateNewVersion}
                  openRemoveModal={this.openRemoveModal}
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
          onChangePage={this.handleChangePage}
        />
        <RemoveModal
          dataset={this.state.removeModalDataset}
          onlyChanges={this.state.removeModalOnlyChanges}
          onClose={this.closeRemoveModal}
          postRemoveUpdate={this.postRemoveUpdate}
        />
      </Fragment>
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

export default withRouter(withStores(observer(DatasetTable)))
