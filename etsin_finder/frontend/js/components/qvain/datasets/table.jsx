import React, { Component } from 'react';
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
import { CancelButton } from '../general/buttons'

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
    limit: 20,
    offset: 0,
    loading: false
  }

  componentDidMount() {
    this.getDatasets()
  }

  getDatasets = () => {
    this.setState({ loading: true })
    const { limit, offset } = this.state
    const url = `${USER_DATASETS_URL}${tempuser}?limit=${limit}&offset=${offset}`
    axios
      .get(url)
      .then(result => {
        const { count, results } = result.data
        const datasets = [...results]
        this.setState({ count, datasets, loading: false })
      })
  }

  handleRemove = (identifier) => (event) => {
    event.preventDefault()
    this.setState((state) => ({
      datasets: [...state.datasets.filter(d => d.identifier !== identifier)]
    }))
  }

  noDatasets = () => {
    const { loading, datasets } = this.state
    return !loading && datasets.length === 0
  }

  handleEnterEdit = (dataset) => () => {
    this.props.Stores.Qvain.editDataset(dataset)
    this.props.history.push('/qvain/dataset')
  }

  render() {
    const { datasets, loading } = this.state
    return (
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
    );
  }
}

export default withRouter(inject('Stores')(observer(DatasetTable)))
