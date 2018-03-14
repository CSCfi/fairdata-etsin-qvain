import React, { Component } from 'react'
import Translate from 'react-translate-component'
import styled from 'styled-components'
import DatasetQuery from '../../../stores/view/datasetquery'
import { InvertedButton } from '../../general/button'

const Table = styled.table`
  width: 100%;
  max-width: 100%;
  margin-bottom: 1rem;
  background-color: transparent;
  thead {
    background-color: ${props => props.theme.color.primary};
    color: white;
    tr > th {
      padding: 0.75rem;
      border: 0;
    }
  }
  tbody {
    box-sizing: border-box;
    border: 2px solid ${props => props.theme.color.lightgray};
    border-top: 0;
    tr:nth-child(odd) {
      background-color: ${props => props.theme.color.superlightgray};
    }
    tr:nth-child(even) {
      background-color: ${props => props.theme.color.white};
    }
    td {
      padding: 0.75rem;
    }
  }
`

export default class Events extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div>
        <h2>Events</h2>
        <Table>
          <thead>
            <tr>
              <th className="rowIcon" scope="col">
                Tapahtuma
              </th>
              <th className="rowIcon" scope="col">
                Kuka
              </th>
              <th className="rowIcon" scope="col">
                Milloin
              </th>
              <th className="rowIcon" scope="col">
                Kuvaus
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>NewVersionRelease</td>
              <td>Sigrid Dengel</td>
              <td>2012-04-22T00:00:00Z/2015-01-01T00:00:00Z</td>
              <td>Postprocessing of 2012-2014 tower flux data</td>
            </tr>
            <tr>
              <td>NewVersionRelease</td>
              <td>Sigrid Dengel</td>
              <td>2012-04-22T00:00:00Z/2016-01-01T00:00:00Z</td>
              <td>Improved postprocessing of 2012-2015 tower flux data</td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }
}
