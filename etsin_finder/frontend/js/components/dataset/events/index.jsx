
/**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import Accessibility from '../../../stores/view/accessibility'
import checkDataLang, { getDataLang } from '../../../utils/checkDataLang'
import dateFormat from '../../../utils/dateFormat'
import Tracking from '../../../utils/tracking'
import Agent from '../agent'


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
  constructor(props) {
    super(props)

    let versions;

    // Error handling for dataset_version_set
    if (this.props.dataset_version_set) {
      versions = this.versions(this.props.dataset_version_set)
    }

    this.state = {
      versions,
    }
  }

  componentDidMount() {
    // Error handling for dataset_version_set
    if (this.props.dataset_version_set) {
      this.versions(this.props.dataset_version_set)
    }

    Tracking.newPageView(
      `Dataset: ${this.props.match.params.identifier} | Events`,
      this.props.location.pathname,
    )
    Accessibility.handleNavigation('idnAndEvents', false)
  }

  versions = set => set
    .map((single, i) => ({
      dateRemoved: single.date_removed ? /[^T]*/.exec(single.date_removed.toString()) : '',
      label: set.length - i,
      identifier: single.identifier,
      removed: single.removed,
      url: this.setUrl(single.identifier)
    }))

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
          prov[0].temporal.end_date
          && prov[0].temporal.end_date !== ''
          && (prov[0].temporal.start_date && prov[0].temporal.start_date !== '')
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
        {dateFormat(temp.start_date)}
        {' '}
        -
        {dateFormat(temp.end_date)}
      </span>
    )
  }

  checkDeleted = () => {
    // Error handling for dataset_version_set
    if (this.props.dataset_version_set) {
      if (this.props.dataset_version_set
        .filter(single => single.removed).length > 0) {
        return true
      }
      return false
    }
    return false
  }

  setUrl = (identifier) => {
    return `/dataset/${identifier}`
  }

  relationIdentifierIsUrl(identifier) {
    return identifier.startsWith('http://') || identifier.startsWith('https://')
  }

  checkRelation(relation) {
    if (relation[0]) {
      relation[0].entity.identifier = relation[0].entity.identifier || '';
      return true
    }
    return false
  }

  render() {
    return (
      <Margin>
        { // Display events table header if provenance exists of if deleted versions exist
          (this.checkProvenance(this.props.provenance) || this.checkDeleted()) && (
          <Margin>
            <h2>
              <Translate content="dataset.events_idn.events.title" />
            </h2>
            <Table>
              <thead>
                <tr>
                  <th className="rowIcon" scope="col"><Translate content="dataset.events_idn.events.event" /></th>
                  <th className="rowIcon" scope="col"><Translate content="dataset.events_idn.events.who" /></th>
                  <th className="rowIcon" scope="col"> <Translate content="dataset.events_idn.events.when" /></th>
                  <th className="rowIcon" scope="col"><Translate content="dataset.events_idn.events.event_title" /></th>
                  <th className="rowIcon" scope="col"><Translate content="dataset.events_idn.events.description" /></th>
                </tr>
              </thead>
              <tbody>
                { // Error handling to make sure provenance is defined
                this.props.provenance && (

                  // Displaying general events
                  this.props.provenance.map(single => (
                    <tr key={`provenance-${checkDataLang(single.title)}`}>
                      <td>
                        {/* If this contains both lifecycle and preservation events, it will display both in one box */}
                        {single.lifecycle_event !== undefined && (
                          <span lang={getDataLang(single.lifecycle_event.pref_label)}>
                            {checkDataLang(single.lifecycle_event.pref_label)}
                          </span>
                        )}
                        {single.preservation_event && (
                          <span lang={getDataLang(single.preservation_event.pref_label)}>
                            {checkDataLang(single.preservation_event.pref_label)}
                          </span>
                        )}
                      </td>
                      <td>
                        {/* eslint-disable react/jsx-indent */}
                        {single.was_associated_with
                          && single.was_associated_with.map((associate, i) => {
                            if (associate.name) {
                              return (
                                <InlineUl key={`ul-${checkDataLang(associate.name)}`}>
                                  <Agent
                                    lang={getDataLang(associate)}
                                    key={checkDataLang(associate) || associate.name}
                                    first={i === 0}
                                    agent={associate}
                                  />
                                </InlineUl>
                              )
                            }
                            return ''
                          })}
                        {/* eslint-enable react/jsx-indent */}
                      </td>
                      <td>
                        {/* Some datasets have start_date and some startDate */}
                        {single.temporal && this.printDate(single.temporal)}
                      </td>
                      <td>
                        {/* Some datasets have start_date and some startDate */}
                        {single.title && checkDataLang(single.title)}
                      </td>
                      <td lang={getDataLang(single.description)}>
                        {single.description && checkDataLang(single.description)}
                      </td>
                    </tr>
                  ))
                )}

                { // Error handling, only display a deleted event if it exists
                this.checkDeleted() && (
                  this.state.versions
                  .filter(single => single.removed)
                  .map(single => (
                    <tr key={single.identifier}>
                      { /* Dataset deletion as event */ }
                      <td>
                        {translate('dataset.events_idn.events.deletionEvent')}
                      </td>
                      { /* Who (none), not recorded */ }
                      <td>
                        -
                      </td>
                      { /* Date of deletion */ }
                      <td>
                        {dateFormat(single.dateRemoved.input)}
                      </td>
                      { /* Event description as header */ }
                      <td>
                        <Translate>
                          <span>
                            {translate('dataset.events_idn.events.deletionOfDatasetVersion')}
                            {single.label}
                          </span>
                        </Translate>
                      </td>
                      { /* Link to deleted dataset */ }
                      <td>
                        {(
                          <IDLink
                            href={single.url}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {single.url}
                          </IDLink>
                        )}
                      </td>
                    </tr>
                  ))
                ) }

              </tbody>
            </Table>
          </Margin>
        )}
        {this.props.other_identifier && this.props.other_identifier.length > 0 && (
          <Margin>
            <h2><Translate content="dataset.events_idn.other_idn" /></h2>
            <ul>
              {this.props.other_identifier.map(single => (
                <OtherID key={single.notation}>{single.notation}</OtherID>
              ))}
            </ul>
          </Margin>
        )}
        {this.checkRelation(this.props.relation) && (
          <Margin>
            <h2><Translate content="dataset.events_idn.relations.title" /></h2>
            <Table>
              <thead>
                <tr>
                  <th><Translate content="dataset.events_idn.relations.type" /></th>
                  <th><Translate content="dataset.events_idn.relations.name" /></th>
                  <th><Translate content="dataset.events_idn.relations.idn" /></th>
                </tr>
              </thead>
              <tbody>
                {this.props.relation.map(single => (
                  <tr key={single.entity.identifier}>
                    <td lang={getDataLang(single.relation_type.pref_label)}>
                      {checkDataLang(single.relation_type.pref_label)}
                    </td>
                    <td lang={getDataLang(single.entity.title)}>
                      {checkDataLang(single.entity.title)}
                      .
                    </td>
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
                      )
                        : (
                          <ID>{single.entity.identifier}</ID>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Margin>
        )}
        {
          this.props.preservation_dataset_origin_version_identifier && (
            <Margin>
              <h2><Translate content="dataset.events_idn.origin_identifier" /></h2>
              <ul>
                <OtherID>
                  {this.props.preservation_dataset_origin_version_identifier.preferred_identifier}
                </OtherID>
              </ul>
            </Margin>
          )
        }
        {this.checkDeleted() && (
          <Margin>
            <h2><Translate content="dataset.events_idn.deleted_versions.title" /></h2>
            <Table>
              <thead>
                <tr>
                  <th><Translate content="dataset.events_idn.deleted_versions.version" /></th>
                  <th><Translate content="dataset.events_idn.deleted_versions.date" /></th>
                  <th><Translate content="dataset.events_idn.deleted_versions.link_to_dataset" /></th>
                </tr>
              </thead>
              <tbody>
                {this.state.versions
                  .filter(single => single.removed)
                  .map(single => (
                    <tr key={single.identifier}>
                      <td lang={single.label}>
                        {single.label}
                      </td>
                      <td lang={single.dateRemoved}>
                        {single.dateRemoved}
                      </td>
                      <td>
                        <span className="sr-only">Identifier:</span>
                        {(
                          <IDLink
                            href={single.url}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {single.url}
                          </IDLink>
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
  preservation_dataset_origin_version_identifier: undefined,
  dataset_version_set: undefined,
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
  preservation_dataset_origin_version_identifier: PropTypes.object,
  dataset_version_set: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
}

const InlineUl = styled.ul`
  display: inline;
  margin: 0;
  padding: 0;
`

export default inject('Stores')(observer(Events))
