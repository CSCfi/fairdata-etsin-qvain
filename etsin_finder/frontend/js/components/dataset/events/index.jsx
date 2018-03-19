import React, { Component } from 'react'
// import Translate from 'react-translate-component'
import styled from 'styled-components'
import DatasetQuery from 'Stores/view/datasetquery'
import checkDataLang from 'Utils/checkDataLang'
import dateFormat from 'Utils/dateFormat'

const Table = styled.table`
  overflow-x: scroll;
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
    border-top: ${props => (props.noHead ? '' : 0)};
    tr:nth-child(odd) {
      background-color: ${props => props.theme.color.superlightgray};
    }
    tr:nth-child(even) {
      background-color: ${props => props.theme.color.white};
    }
    td {
      overflow-wrap: break-word;
      padding: 0.75rem;
    }
  }
`

const ID = styled.span`
  margin-left: 0.2em;
  color: ${props => props.theme.color.darkgray};
  font-size: 0.9em;
`

export default class Events extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: DatasetQuery.results,
    }
  }

  render() {
    return (
      <div>
        <h2>Events</h2>
        {this.state.results.research_dataset.provenance && (
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
              {this.state.results.research_dataset.provenance.map(single => (
                <tr key={`provenance-${checkDataLang(single.title)}`}>
                  {console.log(single)}
                  <td>
                    {single.lifecycle_event !== undefined
                      ? checkDataLang(single.lifecycle_event.pref_label)
                      : checkDataLang(single.preservation_event.pref_label)}
                  </td>
                  <td>
                    {/* eslint-disable react/jsx-indent */}
                    {single.was_associated_with
                      ? single.was_associated_with.map(associate => (
                          <span key={checkDataLang(associate.name)}>
                            {checkDataLang(associate.name)}
                          </span>
                        ))
                      : 'None'}
                    {/* eslint-enable react/jsx-indent */}
                  </td>
                  <td>
                    {`${dateFormat(single.temporal.start_date)} - ${dateFormat(
                      single.temporal.end_date
                    )}`}
                  </td>
                  <td>{checkDataLang(single.description)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {this.state.results.research_dataset.other_identifier && (
          <div>
            <h2>Other identifiers</h2>
            <div>
              {this.state.results.research_dataset.other_identifier.map(single => (
                <p key={single.notation}>{single.notation}</p>
              ))}
            </div>
          </div>
        )}
        {this.state.results.research_dataset.relation && (
          <div>
            <h2>Relations</h2>
            <Table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Identifier</th>
                </tr>
              </thead>
              <tbody>
                {this.state.results.research_dataset.relation.map(single => (
                  <tr key={single.entity.identifier}>
                    <td>{checkDataLang(single.relation_type.pref_label)}</td>
                    <td>{checkDataLang(single.entity.title)}.</td>
                    <td>
                      <span className="sr-only">Identifier:</span>
                      <ID>{single.entity.identifier}</ID>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    )
  }
}
