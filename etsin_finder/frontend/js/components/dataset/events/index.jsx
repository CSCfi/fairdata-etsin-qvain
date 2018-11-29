{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import Accessibility from '../../../stores/view/accessibility'
import GetLang from '../../general/getLang'
import dateFormat from '../../../utils/dateFormat'
import Tracking from '../../../utils/tracking'

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

const IDLink = styled.a`
  margin-left: 0.2em;
  font-size: 0.9em;
`

const OtherID = styled.li`
  margin: 0;
`

const Margin = styled.section`
  margin: 1.5em 0em;
`

class Events extends Component {
  componentDidMount() {
    Tracking.newPageView(
      `Dataset: ${this.props.match.params.identifier} | Events`,
      this.props.location.pathname
    )
    Accessibility.handleNavigation('idnAndEvents', false)
  }
  checkProvenance = prov => {
    if (prov) {
      if (prov.length > 1) {
        return true
      }
      if (prov[0].preservation_event || prov[0].lifecycle_event) {
        return true
      }
      if (prov[0].was_associated_with) {
        return true
      }
      if (prov[0].temporal) {
        if (
          prov[0].temporal.end_date &&
          prov[0].temporal.end_date !== '' &&
          (prov[0].temporal.start_date && prov[0].temporal.start_date !== '')
        ) {
          return true
        }
      }
      if (prov[0].description) {
        return true
      }
    }
    return false
  }

  printDate = temp => {
    if (temp.start_date === temp.end_date) {
      return dateFormat(temp.start_date)
    }
    return (
      <span>
        {dateFormat(temp.start_date)} - {dateFormat(temp.end_date)}
      </span>
    )
  }

  relationIdentifierIsUrl(identifier) {
    return identifier.startsWith('http://') || identifier.startsWith('https://')
  }

  render() {
    return (
      <Margin>
        {this.checkProvenance(this.props.provenance) && (
          <Margin>
            <h2>
              <Translate content="dataset.events_idn.events.title" />
            </h2>
            <Table>
              <thead>
                <tr>
                  <th className="rowIcon" scope="col">
                    <Translate content="dataset.events_idn.events.event" />
                  </th>
                  <th className="rowIcon" scope="col">
                    <Translate content="dataset.events_idn.events.who" />
                  </th>
                  <th className="rowIcon" scope="col">
                    <Translate content="dataset.events_idn.events.when" />
                  </th>
                  <th className="rowIcon" scope="col">
                    <Translate content="dataset.events_idn.events.description" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.props.provenance.map(single => (
                  <GetLang
                    content={[
                      single.title,
                      single.lifecycle_event !== undefined
                        ? single.lifecycle_event.pref_label
                        : undefined,
                      single.preservation_event && single.preservation_event.pref_label,
                    ]}
                    render={data => (
                      <tr key={`provenance-${data.translation[0]}`} lang={data.lang[0]}>
                        <td>
                          {/* if contains both it will display to tags in one box */}
                          {single.lifecycle_event !== undefined && (
                            <span lang={data.lang[1]}>data.translation[1]</span>
                          )}
                          {single.preservation_event && (
                            <span lang={data.lang[2]}>{data.translation[2]}</span>
                          )}
                        </td>
                        <td>
                          {/* eslint-disable react/jsx-indent */}
                          {single.was_associated_with &&
                            single.was_associated_with.map((associate, i) => (
                              <GetLang
                                content={associate.name}
                                render={d => (
                                  <span key={d.translation} lang={d.lang}>
                                    {i === 0 ? '' : ', '}
                                    {d.translation}
                                  </span>
                                )}
                              />
                            ))}
                          {/* eslint-enable react/jsx-indent */}
                        </td>
                        <td>
                          {/* some datasets have start_date and some startDate */}
                          {single.temporal && this.printDate(single.temporal)}
                        </td>
                        <GetLang
                          content={single.description && single.description}
                          render={d => <td lang={d.lang}>{d.translation}</td>}
                        />
                      </tr>
                    )}
                  />
                ))}
              </tbody>
            </Table>
          </Margin>
        )}
        {this.props.other_identifier && this.props.other_identifier.length > 0 && (
          <Margin>
            <h2>
              <Translate content="dataset.events_idn.other_idn" />
            </h2>
            <ul>
              {this.props.other_identifier.map(single => (
                <OtherID key={single.notation}>{single.notation}</OtherID>
              ))}
            </ul>
          </Margin>
        )}
        {this.props.relation && (
          <Margin>
            <h2>
              <Translate content="dataset.events_idn.relations.title" />
            </h2>
            <Table>
              <thead>
                <tr>
                  <th>
                    <Translate content="dataset.events_idn.relations.type" />
                  </th>
                  <th>
                    <Translate content="dataset.events_idn.relations.name" />
                  </th>
                  <th>
                    <Translate content="dataset.events_idn.relations.idn" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.props.relation.map(single => (
                  <tr key={single.entity.identifier}>
                    <GetLang
                      content={single.relation_type.pref_label}
                      render={data => <td lang={data.lang}>{data.translation}</td>}
                    />
                    <GetLang
                      content={single.entity.title}
                      render={data => <td lang={data.lang}>{data.translation}.</td>}
                    />
                    <td>
                      <span className="sr-only">Identifier:</span>
                      {this.relationIdentifierIsUrl(single.entity.identifier) ? (
                        <IDLink
                          href={single.entity.identifier}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {single.entity.identifier}
                        </IDLink>
                      ) : (
                        <ID>{single.entity.identifier}</ID>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Margin>
        )}
      </Margin>
    )
  }
}

Events.defaultProps = {
  relation: false,
  provenance: false,
  other_identifier: false,
}

Events.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      identifier: PropTypes.string,
    }),
  }).isRequired,
  relation: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  provenance: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  other_identifier: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
}

export default inject('Stores')(observer(Events))
