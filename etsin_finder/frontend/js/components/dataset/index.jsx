/* eslint-disable react/jsx-indent */
/* eslint-disable space-before-function-paren */
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
require('@babel/polyfill')

import React from 'react'
import PropTypes from 'prop-types'
import translate from 'counterpart'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import { NavLink } from 'react-router-dom'

import axios from 'axios'
import DatasetQuery from '../../stores/view/datasetquery'
import Accessibility from '../../stores/view/accessibility'
import Sidebar from './sidebar'
import Content from './content'
import ErrorPage from '../errorpage'
import ErrorBoundary from '../general/errorBoundary'
import NoticeBar from '../general/noticeBar'
import Loader from '../general/loader'


const BackButton = styled(NavLink)`
  color: ${props => props.theme.color.primary};
  padding: 0;
  margin: 0 0 0.5em 0;
`

class Dataset extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dataset: DatasetQuery.results,
      email_info: DatasetQuery.email_info,
      error: false,
      identifier: props.match.params.identifier,
      versionInfo: {},
    }

    this.query = this.query.bind(this)
    this.goBack = this.goBack.bind(this)
  }


  componentDidMount() {
    Accessibility.resetFocus()
    this.query()
  }


  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.props.match.params.identifier !== newProps.match.params.identifier) {
      this.setState(
        {
          loaded: false,
        },
        () => {
          this.query(newProps.match.params.identifier)
        }
      )
    }
  }

  query(customId) {
    let identifier = this.props.match.params.identifier
    if (customId !== undefined) {
      identifier = customId
    }
    if (process.env.NODE_ENV === 'production' && /^\d+$/.test(identifier)) {
      console.log('Using integer as identifier not permitted')
      this.setState({ error: 'wrong identifier', loaded: true })
      return
    }
    Accessibility.announcePolite(translate('dataset.loading'))
    DatasetQuery.getData(identifier)
      .then(result => {
        // TODO: The code below needs to be revised
        // Somewhere we need to think how 1) harvested, 2) accumulative, 3) deprecated, 4) removed, 5) ordinary
        // datasets are rendered. Maybe not here?
        this.setState({
          identifier: this.props.match.params.identifier,
          dataset: result.catalog_record,
          email_info: result.email_info,
          hasFiles:
            (result.catalog_record.research_dataset.directories
              || result.catalog_record.research_dataset.files) !== undefined,
          hasRemote: result.catalog_record.research_dataset.remote_resources !== undefined,
          harvested: result.catalog_record.data_catalog.catalog_json.harvested,
          deprecated: result.catalog_record.deprecated,
          removed: result.catalog_record.removed,
          loaded: true,
        })
        this.getAllVersions(result.catalog_record.dataset_version_set)
      })
      .catch(error => {
        console.log(error)
        this.setState({ error })
      })
  }

  // goes back to previous page, which might be outside
  goBack() {
    this.props.history.goBack()
  }

  async getAllVersions(data) {
    const promises = [];

    for (const k of data.keys()) {
      const versionUrl = `/api/dataset/${data[k].identifier}`;
      promises.push(axios.get(versionUrl))
    }

    const retval = await axios.all(promises) //will fetch all dataset versions
    let stateInfo = '';
    let urlText = '';
    let latestDate = '';
    const currentDate = new Date(this.state.dataset.date_created);
    let ID = '';
    let linkToOtherVersion = '';

    if (this.state.removed) {
      stateInfo = 'tombstone.removedInfo'
    } else if (this.state.deprecated) {
      stateInfo = 'tombstone.deprecatedInfo'
    }

    if (retval.length > 1) { // / If there are more than 1 version
     latestDate = new Date(Math.max.apply(null, retval // /Date of the latest existing version
      .filter(version => !version.data.catalog_record.removed && !version.data.catalog_record.deprecated)
      .map((version) =>
        new Date(version.data.catalog_record.date_created)
      )));

      if (latestDate.getTime() > currentDate.getTime()) {
        urlText = 'tombstone.urlToNew'
      } else if (latestDate.getTime() < currentDate.getTime()) {
        urlText = 'tombstone.urlToOld'
      }

      linkToOtherVersion = 'tombstone.link'

      for (const k of data.keys()) {
        if (new Date(data[k].date_created).getTime() === latestDate.getTime()) {
          ID = data[k].identifier;
          break
        }
      }

    this.setState({ versionInfo: {
      stateInfo,
      urlText,
      ID,
      linkToOtherVersion
    } })
    }
  }


  render() {
    // CASE 1: Houston, we have a problem
    if (this.state.error !== false) {
      return <ErrorPage error={{ type: 'notfound' }} />
    }
    // CASE 2: Business as usual
    return this.state.loaded ? (
      <div>
        <article className="container regular-row">
          <div className="row">
            <div className="col-12">
              <div>
              {(this.state.removed || this.state.deprecated) && (
                <NoticeBar bg="error">
                  <Translate content={this.state.versionInfo.stateInfo} /><br />
                  <Translate content={this.state.versionInfo.urlText} />
                  <Link href={this.state.versionInfo.ID} target="_blank" rel="noopener noreferrer" content={'tombstone.link'}>
                    <Translate content={this.state.versionInfo.linkToOtherVersion} />
                  </Link>
                </NoticeBar>
              )}
              </div>
              <BackButton
                exact
                to="/datasets"
                onClick={() => {
                  Accessibility.announce(
                    translate('changepage', { page: translate('nav.datasets') })
                  )
                }}
              >
                <span aria-hidden>{'< '}</span>
                <Translate content={'dataset.goBack'} />
              </BackButton>
            </div>
          </div>
          <div className="row">
            <Content
              identifier={this.state.identifier}
              dataset={this.state.dataset}
              harvested={this.state.harvested}
              cumulative={this.state.cumulative}
              hasFiles={this.state.hasFiles}
              hasRemote={this.state.hasRemote}
              isDeprecated={this.state.deprecated}
              isRemoved={this.state.removed}
              emails={this.state.email_info}
            />
            <div className="col-lg-4">
              <ErrorBoundary>
                <Sidebar dataset={this.state.dataset} />
              </ErrorBoundary>
            </div>
          </div>
        </article>
      </div>
    ) : (
      <LoadingSplash>
        <Loader active />
      </LoadingSplash>
      )
  }
}

const LoadingSplash = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Link = styled.a`
  font-size: 0.9em;
`

Dataset.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(Dataset))
