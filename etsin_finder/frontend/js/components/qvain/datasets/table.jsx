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

const USER_DATASETS_URL = '/api/datasets/'
const tempuser = 'abc-user-123'

class DatasetTable extends Component {
  state = {
    datasets: [],
    count: 0,
    limit: 20
  }

  componentDidMount() {
    this.getDatasets()
  }

  getDatasets = () => {
    axios
      .get(USER_DATASETS_URL + tempuser)
      .then(result => {
        console.log('result: ', result)
        const datasets = [...result.data.results]
        console.log('datasets: ', datasets)
        this.setState({ datasets })
      })
  }

  render() {
    const { datasets } = this.state
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
        <TableBody>
          {datasets.map(dataset => (
            <Row>
              <BodyCell>{dataset.identifier}</BodyCell>
              <BodyCell>{dataset.title ? dataset.title.en : 'No title'}</BodyCell>
              <BodyCell>asd</BodyCell>
              <BodyCell>asd</BodyCell>
            </Row>
          ))}
          <Row>
            <BodyCell>asd</BodyCell>
            <BodyCell>asd</BodyCell>
            <BodyCell>asd</BodyCell>
          </Row>
        </TableBody>
      </Table>
    );
  }
}

export default DatasetTable;
