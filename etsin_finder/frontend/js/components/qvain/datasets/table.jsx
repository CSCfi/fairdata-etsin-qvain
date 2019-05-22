import React, { Component } from 'react';
import axios from 'axios'
import {
  Table,
  TableHeader,
  Row,
  HeaderCell,
  TableBody,
  BodyCell
} from '../general/table'
import { CancelButton } from '../general/buttons'

const USER_DATASETS_URL = '/api/datasets/'
const tempuser = 'abc-user-123'

class DatasetTable extends Component {
  state = {
    datasets: [],
    count: 0,
    limit: 20,
    offset: 0,
    loading: false
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.getDatasets()
  }

  getDatasets = () => {
    const { limit, offset } = this.state
    const url = `${USER_DATASETS_URL}${tempuser}?limit=${limit}&offset=${offset}`
    axios
      .get(url)
      .then(result => {
        console.log('result: ', result)
        const { count, results } = result.data
        const datasets = [...results]
        console.log('datasets: ', datasets)
        this.setState({ count, datasets, loading: false })
      })
  }

  handleRemove = (identifier) => (event) => {
    event.preventDefault()
    this.setState((state) => ({
      datasets: [...state.datasets.filter(d => d.identifier !== identifier)]
    }))
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
          {loading && <p>Loading...</p>}
          {datasets.map(dataset => (
            <Row key={dataset.identifier}>
              <BodyCell>{dataset.identifier}</BodyCell>
              <BodyCell>{dataset.research_dataset.title.en}</BodyCell>
              <BodyCell>
                <CancelButton>Edit</CancelButton>
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

export default DatasetTable;
