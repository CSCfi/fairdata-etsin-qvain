import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { reaction } from 'mobx'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import {
  Table,
  TableHeader,
  Row,
  HeaderCell,
  TableBody,
  BodyCell,
  TableNote,
} from '../general/table'
import Modal from '../../general/modal'
import DatasetPagination from './pagination'
import Label from '../general/label'
import { CancelButton, RemoveButton, DangerButton } from '../general/buttons'

const USER_DATASETS_URL = '/api/datasets/'

class DatasetTable extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    Stores: PropTypes.object.isRequired,
  }

  state = {
    datasets: [],
    count: 0,
    limit: 20,
    onPage: [],
    page: 1,
    loading: false,
    error: false,
    errorMessage: '',
    removeModalOpen: false,
    removableDatasetIdentifier: undefined
  }

  componentDidMount() {
    this.getDatasets()
    // once we get login info, reload
    reaction(
      () => this.props.Stores.Auth.user.name,
      () => this.getDatasets()
    )
  }

  getDatasets = () => {
    this.setState({ loading: true, error: false, errorMessage: '' })
    const url = `${USER_DATASETS_URL}${
      this.props.Stores.Auth.user.name
    }?no_pagination=true`
    console.log(url)
    return axios
      .get(url)
      .then(result => {
        const datasets = [...result.data]
        this.setState({
          count: datasets.length,
          datasets,
          loading: false,
          error: false,
          errorMessage: undefined
        }, this.handleChangePage(1))
      })
      .catch(e => {
        console.log(e.message)
        this.setState({ loading: false, error: true, errorMessage: 'Failed to load datasets' })
      })
  }

  handleRemove = identifier => event => {
    event.preventDefault()
    axios
      .delete(`/api/dataset/${identifier}`)
      .then(() => {
        this.setState(state => ({
          datasets: [...state.datasets.filter(d => d.identifier !== identifier)],
          removeModalOpen: false,
          removableDatasetIdentifier: undefined
        }))
        if (this.state.datasets.length === 0 && this.state.page !== 1) {
          this.handleChangePage(this.state.page - 1)()
        }
      })
      .catch(err => { this.setState({ error: true, errorMessage: err.message }) })
  }

  openRemoveModal = (identifier) => () => {
    this.setState({
      removeModalOpen: true,
      removableDatasetIdentifier: identifier
    })
  }

  closeRemoveModal = () => {
    this.setState({
      removeModalOpen: false,
      removableDatasetIdentifier: undefined
    })
  }

  noDatasets = () => {
    const { loading, datasets, error } = this.state
    return !loading && !error && datasets.length === 0
  }

  handleEnterEdit = dataset => () => {
    this.props.Stores.Qvain.editDataset(dataset)
    this.props.history.push('/qvain/dataset')
  }

  handleChangePage = pageNum => () => {
    const actualNum = pageNum - 1
    this.setState((state) => ({
      onPage: state.datasets.slice(actualNum * state.limit, (actualNum * state.limit) + state.limit),
      page: pageNum
    }))
  }

  render() {
    const { onPage, loading, error, errorMessage, page, count, limit } = this.state
    return (
      <Fragment>
        <DatasetPagination
          page={page}
          count={count}
          limit={limit}
          onChangePage={this.handleChangePage}
        />
        <TablePadded className="table">
          <TableHeader>
            <Row>
              <Translate component={HeaderCell} content="qvain.datasets.tableRows.name" />
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
                    component={CancelButton}
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
              onPage.map(dataset => (
                <Row key={dataset.identifier}>
                  <BodyCell>
                    {dataset.research_dataset.title.en || dataset.research_dataset.title.fi}
                    {dataset.next_dataset_version !== undefined && (
                      <Translate color="yellow" content="qvain.datasets.oldVersion" component={OldVersionLabel} />
                    )}
                  </BodyCell>
                  <BodyCell>{dataset.date_created}</BodyCell>
                  <BodyCell>
                    <Translate
                      component={CancelButton}
                      onClick={this.handleEnterEdit(dataset)}
                      content="qvain.datasets.editButton"
                    />
                  </BodyCell>
                  <BodyCell>
                    <Translate
                      component={CancelButton}
                      onClick={() => window.open(`/dataset/${dataset.identifier}`, '_blank')}
                      content="qvain.datasets.goToEtsin"
                    />
                  </BodyCell>
                  <BodyCell>
                    <Translate
                      component={RemoveButton}
                      onClick={this.openRemoveModal(dataset.identifier)}
                      content="qvain.datasets.deleteButton"
                    />
                  </BodyCell>
                </Row>
              ))}
          </TableBody>
        </TablePadded>
        <DatasetPagination
          page={page}
          count={count}
          limit={limit}
          onChangePage={this.handleChangePage}
        />
        <Modal isOpen={this.state.removeModalOpen} onRequestClose={this.closeRemoveModal} contentLabel="removeDatasetModal">
          <Translate component="p" content="qvain.datasets.confirmDelete" />
          <CancelButton onClick={this.closeRemoveModal}>Cancel</CancelButton>
          <DangerButton onClick={this.handleRemove(this.state.removableDatasetIdentifier)}>Remove</DangerButton>
        </Modal>
      </Fragment>
    )
  }
}

const OldVersionLabel = styled(Label)`
  margin-left: 10px;
  text-transform: uppercase;
`;

const ErrorMessage = styled.span`
  margin-left: 10px;
`

const TablePadded = styled(Table)`
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 30px;
  margin-bottom: 30px;
`

export default withRouter(inject('Stores')(observer(DatasetTable)))
