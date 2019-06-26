import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
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
import DatasetPagination from './pagination'
import { CancelButton } from '../general/buttons'

const USER_DATASETS_URL = '/api/datasets/'
// const tempuser = 'abc-user-123'

class DatasetTable extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    Stores: PropTypes.object.isRequired,
  }

  state = {
    datasets: [],
    count: 0,
    limit: 5,
    page: 1,
    loading: false,
    error: false,
    errorMessage: '',
  }

  componentDidMount() {
    this.getDatasets((this.state.page - 1) * this.state.limit)
  }

  getDatasets = offset => {
    this.setState({ loading: true, error: false, errorMessage: '' })
    const { limit } = this.state
    this.props.Stores.Auth.checkLogin()
      .then(() => {
        const url = `${USER_DATASETS_URL}${
          this.props.Stores.Auth.user.name
        }?limit=${limit}&offset=${offset}`
        console.log(url)
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
      })
      .catch(() =>
        this.setState({
          loading: false,
          error: true,
          errorMessage: 'There was an error loading the datasets',
        })
      )
  }

  handleRemove = identifier => event => {
    event.preventDefault()
    axios
      .delete('/api/dataset/' + identifier)
      .then(this.setState(state => ({
          datasets: [...state.datasets.filter(d => d.identifier !== identifier)],
        })))
      .catch(err => { this.setState({ error: true, errorMessage: err.message })})
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
    this.setState({ page: pageNum, datasets: [] })
    this.getDatasets((pageNum - 1) * this.state.limit)
  }

  render() {
    const { datasets, loading, error, errorMessage, page, count, limit } = this.state
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
              <Translate component={HeaderCell} content="qvain.datasets.tableRows.id" />
              <Translate component={HeaderCell} content="qvain.datasets.tableRows.name" />
              <Translate component={HeaderCell} content="qvain.datasets.tableRows.edit" />
              <Translate component={HeaderCell} content="qvain.datasets.tableRows.remove" />
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
              datasets.map(dataset => (
                <Row key={dataset.identifier}>
                  <BodyCell>{dataset.identifier}</BodyCell>
                  <BodyCell>
                    {dataset.research_dataset.title.en || dataset.research_dataset.title.fi}
                  </BodyCell>
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
                      onClick={this.handleRemove(dataset.identifier)}
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

export default withRouter(inject('Stores')(observer(DatasetTable)))
