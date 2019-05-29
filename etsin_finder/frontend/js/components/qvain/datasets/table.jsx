import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import {
  Table,
  TableHeader,
  Row,
  HeaderCell,
  TableBody,
  BodyCell,
  TableNote
} from '../general/table'
import { CancelButton, ButtonGroup } from '../general/buttons'

const USER_DATASETS_URL = '/api/datasets/'
const tempuser = 'abc-user-123'

class DatasetTable extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    Stores: PropTypes.object.isRequired
  }

  state = {
    datasets: [],
    count: 0,
    limit: 5,
    page: 1,
    loading: false,
    error: false,
    errorMessage: ''
  }

  componentDidMount() {
    this.getDatasets((this.state.page - 1) * this.state.limit)
  }

  getDatasets = (offset) => {
    this.setState({ loading: true, error: false, errorMessage: '' })
    const { limit } = this.state
    const url = `${USER_DATASETS_URL}${tempuser}?limit=${limit}&offset=${offset}`
    return axios
      .get(url)
      .then(result => {
        const { count, results } = result.data
        const datasets = [...results]
        console.log('datasets ', datasets)
        this.setState({ count, datasets, loading: false })
      })
      .catch(e => {
        console.log(e.message)
        this.setState({ loading: false, error: true, errorMessage: 'Failed to load datasets' })
      })
  }

  handleRemove = (identifier) => (event) => {
    event.preventDefault()
    this.setState((state) => ({
      datasets: [...state.datasets.filter(d => d.identifier !== identifier)]
    }))
  }

  noDatasets = () => {
    const { loading, datasets, error } = this.state
    return !loading && !error && datasets.length === 0
  }

  handleEnterEdit = (dataset) => () => {
    this.props.Stores.Qvain.editDataset(dataset)
    this.props.history.push('/qvain/dataset')
  }

  handleNextPage = () => {
    this.getDatasets(this.state.offset + this.state.limit).then(() => {
      this.setState((state) => ({
        page: state.page + 1,
        offset: state.offset + state.limit
      }))
    })
  }

  handleChangePage = (pageNum) => () => {
    this.setState({ page: pageNum, datasets: [] })
    this.getDatasets((this.state.page - 1) * this.state.limit)
  }

  renderPageButtons = () => {
    let buttons = []
    const { count, limit, page } = this.state
    for (let i = 1; i <= (count / limit); i += 1) {
      buttons = [...buttons, (
        <button key={i} onClick={this.handleChangePage(i)} disabled={i === page} type="button">{i}</button>
      )]
    }
    return buttons
  }

  render() {
    const { datasets, loading, count, page, limit, error, errorMessage } = this.state
    return (
      <Fragment>
        <ButtonGroup>
          <button disabled={(page * limit) - limit === 0} onClick={this.handleChangePage(page - 1)} type="button">Back</button>
          {this.renderPageButtons()}
          <button disabled={(page * limit) + limit > count} onClick={this.handleChangePage(page + 1)} type="button">Next</button>
        </ButtonGroup>
        <Table className="table">
          <TableHeader>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Name</HeaderCell>
              <HeaderCell>Edit</HeaderCell>
              <HeaderCell>Remove</HeaderCell>
            </Row>
          </TableHeader>
          <TableBody striped>
            {loading && <TableNote>Loading...</TableNote>}
            {error && <TableNote style={{ color: 'red' }}>{errorMessage}</TableNote>}
            {this.noDatasets() && <TableNote>You have no datasets</TableNote>}
            {datasets.map(dataset => (
              <Row key={dataset.identifier}>
                <BodyCell>{dataset.identifier}</BodyCell>
                <BodyCell>{dataset.research_dataset.title.en}</BodyCell>
                <BodyCell>
                  <CancelButton onClick={this.handleEnterEdit(dataset)}>Edit</CancelButton>
                </BodyCell>
                <BodyCell>
                  <CancelButton onClick={this.handleRemove(dataset.identifier)}>Delete</CancelButton>
                </BodyCell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </Fragment>
    );
  }
}

export default withRouter(inject('Stores')(observer(DatasetTable)))
