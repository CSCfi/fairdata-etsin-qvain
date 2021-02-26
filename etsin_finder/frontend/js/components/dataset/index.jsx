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

import React from 'react'
import PropTypes from 'prop-types'
import translate from 'counterpart'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import { NavLink } from 'react-router-dom'

import { opacify } from 'polished'
import axios from 'axios'
import Sidebar from './sidebar'
import Content from './content'
import ErrorPage from '../errorpage'
import ErrorBoundary from '../general/errorBoundary'
import NoticeBar from '../general/noticeBar'
import Loader from '../general/loader'
import { withStores } from '../../stores/stores'

const BackButton = styled(NavLink)`
  color: ${props => props.theme.color.primary};
  padding: 0;
  margin: 0 0 0.5em 0;
`

class Dataset extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      error: false,
      versionInfo: {},
      loaded: false,
    }

    this.query = this.query.bind(this)
    this.goBack = this.goBack.bind(this)
  }

  componentDidMount() {
    this.props.Stores.Accessibility.resetFocus()
    this.query()
  }

  async getAllVersions(data) {
    const datasetVersionSet = data.dataset_version_set
    let stateInfo = ''

    let retval = {}
    let urlText = ''
    let latestDate = ''
    const currentDate = new Date(data.date_created)
    let ID = ''
    let linkToOtherVersion = ''

    if (data.removed) {
      stateInfo = 'tombstone.removedInfo'
    } else if (data.deprecated) {
      stateInfo = 'tombstone.deprecatedInfo'
    }

    const promises = []

    if (typeof datasetVersionSet !== 'undefined') {
      // If there are more than 1 version
      for (const k of datasetVersionSet.keys()) {
        const versionUrl = `/api/dataset/${datasetVersionSet[k].identifier}`
        promises.push(axios.get(versionUrl))
      }

      retval = await axios.all(promises) // will fetch all dataset versions

      latestDate = new Date(
        Math.max.apply(
          null,
          retval // Date of the latest existing version
            .filter(
              version =>
                !version.data.catalog_record.removed && !version.data.catalog_record.deprecated
            )
            .map(version => new Date(version.data.catalog_record.date_created))
        )
      )

      if (latestDate.getTime() > currentDate.getTime()) {
        urlText = 'tombstone.urlToNew'
        linkToOtherVersion = 'tombstone.linkTextToNew'
      } else if (latestDate.getTime() < currentDate.getTime()) {
        urlText = 'tombstone.urlToOld'
        linkToOtherVersion = 'tombstone.linkTextToOld'
      }

      for (const k of datasetVersionSet.keys()) {
        if (new Date(datasetVersionSet[k].date_created).getTime() === latestDate.getTime()) {
          ID = datasetVersionSet[k].identifier
          break
        }
      }
    }

    this.setState({
      versionInfo: {
        stateInfo,
        urlText,
        ID,
        linkToOtherVersion,
      },
    })
  }

  // goes back to previous page, which might be outside
  goBack() {
    this.props.history.goBack()
  }

  query(customId) {
    const { Accessibility, DatasetQuery } = this.props.Stores
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
      .then(async result => {
        await DatasetQuery.fetchAndStoreFiles() // needed for API V2
        this.setState({
          loaded: true,
        })
        this.getAllVersions(result.catalog_record)
      })
      .catch(error => {
        console.log(error)
        this.setState({ error })
      })
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

  render() {
    const { Accessibility, DatasetQuery, Env, Auth } = this.props.Stores
    const { metaxApiV2 } = Env
    const { cscUserLogged } = Auth
    const { location } = this.props
    const { identifier } = this.props.match.params

    // CASE 1: Houston, we have a problem
    if (this.state.error !== false) {
      // If preview query parameter is enabled, user should try logging in
      if (location && location.search) {
        const params = new URLSearchParams(location.search)
        if (params.get('preview') === '1' && !cscUserLogged) {
          return <ErrorPage error={{ type: 'cscloginrequired' }} />
        }
      }
      return <ErrorPage error={{ type: 'notfound' }} />
    }

    const isDraft = DatasetQuery.results && DatasetQuery.results.state === 'draft'
    let draftInfoText = null
    if (isDraft) {
      draftInfoText = DatasetQuery.results.draft_of
        ? 'dataset.draftInfo.changes'
        : 'dataset.draftInfo.draft'
    }

    if (!this.state.loaded || !DatasetQuery.results) {
      return (
        <LoadingSplash>
          <Loader active />
        </LoadingSplash>
      )
    }

    const dataset = DatasetQuery.results
    const cumulative = DatasetQuery.cumulative_state === 1
    const emailInfo = DatasetQuery.emailInfo
    const hasV2Files =
      metaxApiV2 && DatasetQuery.Files.root && DatasetQuery.Files.root.directChildCount > 0
    const hasFiles =
      (dataset.research_dataset.directories || dataset.research_dataset.files) !== undefined ||
      hasV2Files ||
      false
    const hasRemote = dataset.research_dataset.remote_resources !== undefined
    const harvested = dataset.data_catalog.catalog_json.harvested
    const deprecated = dataset.deprecated
    const removed = dataset.removed

    // CASE 2: Business as usual
    return (
      <div>
        <article className="container regular-row">
          <div className="row">
            <div className="col-12">
              <div>
                {(removed || deprecated) && (
                  <NoticeBar bg="error">
                    <Translate content={this.state.versionInfo.stateInfo} />
                    <br />
                    <Translate content={this.state.versionInfo.urlText} />
                    <Link
                      href={this.state.versionInfo.ID}
                      target="_blank"
                      rel="noopener noreferrer"
                      content={'tombstone.link'}
                    >
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
            {draftInfoText && (
              <div className="col-12">
                <Translate component={DraftInfo} content={draftInfoText} />
              </div>
            )}
            <Content
              identifier={identifier}
              dataset={dataset}
              harvested={harvested}
              cumulative={cumulative}
              hasFiles={hasFiles}
              hasRemote={hasRemote}
              isDeprecated={deprecated}
              isRemoved={removed}
              emails={emailInfo}
            />
            <div className="col-lg-4">
              <ErrorBoundary>
                <Sidebar dataset={dataset} />
              </ErrorBoundary>
            </div>
          </div>
        </article>
      </div>
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

const DraftInfo = styled.div`
  background-color: ${p => p.theme.color.primaryLight};
  text-align: center;
  color: ${p => p.theme.color.primaryDark};
  border: 1px solid ${p => opacify(-0.5, p.theme.color.primary)};
  padding: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`

Dataset.propTypes = {
  Stores: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default withStores(observer(Dataset))
