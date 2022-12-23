/* eslint-disable react/jsx-indent */
/* eslint-disable space-before-function-paren */

/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import React from 'react'
import PropTypes from 'prop-types'
import translate from 'counterpart'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import { opacify } from 'polished'

import Sidebar from './sidebar'
import Content from './content'
import ErrorPage from '../errorpage'
import ErrorBoundary from '../general/errorBoundary'
import Loader from '../general/loader'
import { withStores, useStores } from '@/stores/stores'
import CitationModal from './citation/citationModal'
import urls from '../../utils/urls'
import AbortClient, { isAbort } from '@/utils/AbortClient'

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
    this.client = new AbortClient()
  }

  componentDidMount() {
    this.props.Stores.Accessibility.resetFocus()
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

  async getRelatedDatasets(datasetId) {
    try {
      const res = await this.client.get(urls.common.relatedDatasets(datasetId))
      return res.data
    } catch (e) {
      if (isAbort(e)) {
        throw e
      }
      console.error(e)
      return null
    }
  }

  async getRelatedDatasetsInfo(data, datasetId) {
    if (!data.removed) {
      return null
    }
    const relatedDatasets = await this.getRelatedDatasets(datasetId)
    if (!relatedDatasets?.length) {
      return null
    }

    return relatedDatasets.reduce(
      (obj, val) => {
        if (val.type === 'other_identifier') {
          obj.otherIdentifiers.push(val)
        } else {
          obj.relations.push(val)
        }
        return obj
      },
      { otherIdentifiers: [], relations: [] }
    )
  }

  getStateInfo(data) {
    if (data.removed) {
      return 'tombstone.removedInfo'
    }

    if (data.deprecated) {
      return 'tombstone.deprecatedInfo'
    }

    return null
  }

  async getVersionData(datasetVersionSet) {
    const promises = []
    if (datasetVersionSet === undefined) {
      return []
    }

    for (const k of datasetVersionSet.keys()) {
      const versionUrl = urls.dataset(datasetVersionSet[k].identifier)
      promises.push(this.client.get(versionUrl))
    }

    return Promise.all(promises)
  }

  getVersionTitles(versions) {
    const records = versions.map(response => response?.data?.catalog_record).filter(v => v)
    return records.reduce((obj, val) => {
      obj[val.identifier] = val.research_dataset.title
      return obj
    }, {})
  }

  getLatestVersionDate(versions) {
    return new Date(
      Math.max.apply(
        null,
        versions // Date of the latest existing version
          .filter(
            version =>
              !version.data.catalog_record.removed && !version.data.catalog_record.deprecated
          )
          .map(version => new Date(version.data.catalog_record.date_created))
      )
    )
  }

  getLinkInfo(data, versions) {
    if (!data.dataset_version_set) return {}
    const latestDate = this.getLatestVersionDate(versions)
    const currentDate = new Date(data.date_created)
    const ID = Object.values(data.dataset_version_set).find(
      val => new Date(val.date_created).getTime() === latestDate.getTime()
    )

    if (latestDate.getTime() > currentDate.getTime()) {
      return { ID, urlText: 'tombstone.urlToNew', linkToOtherVersion: 'tombstone.linkTextToNew' }
    }

    if (latestDate.getTime() < currentDate.getTime()) {
      return { ID, urlText: 'tombstone.urlToOld', linkToOtherVersion: 'tombstone.linkTextToOld' }
    }

    return { ID }
  }

  async getAllVersions(data) {
    const stateInfo = this.getStateInfo(data)
    const [versions, relatedDatasetsInfo] = await Promise.all([
      this.getVersionData(data.dataset_version_set),
      this.getRelatedDatasetsInfo(data, data.identifier),
    ])
    const versionTitles = this.getVersionTitles(versions)
    const links = this.getLinkInfo(data, versions)

    this.setState({
      versionInfo: {
        stateInfo,
        versionTitles,
        ...links,
        relatedDatasetsInfo,
        fetchingRelated: false,
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
    if (BUILD === 'production' && /^\d+$/.test(identifier)) {
      console.log('Using integer as identifier not permitted')
      this.setState({ error: 'wrong identifier', loaded: true })
      return
    }
    Accessibility.announcePolite(translate('dataset.loading'))

    DatasetQuery.getData(identifier)
      .then(async result => {
        await DatasetQuery.fetchAndStoreFiles() // needed for API V2
        this.setState(prevState => ({
          loaded: true,
          versionInfo: {
            ...prevState.versionInfo,
            fetchingRelated: !!result.catalog_record.removed,
          },
        }))
        this.getAllVersions(result.catalog_record)
      })
      .catch(error => {
        if (isAbort(error)) {
          return
        }
        console.log(error)
        this.setState({ error })
      })
  }

  render() {
    const { DatasetQuery, Auth } = this.props.Stores

    if (this.state.error !== false) {
      return <DatasetError userLogged={!!Auth.cscUserLogged} />
    }

    if (!this.state.loaded || !DatasetQuery.results) {
      return <DatasetLoadSpinner />
    }

    return <DatasetView versionInfo={this.state.versionInfo} />
  }
}

function DatasetError({ userLogged }) {
  // CASE 1: Houston, we have a problem
  // If preview query parameter is enabled, user should try logging in
  const location = useLocation()
  if (location && location.search) {
    const params = new URLSearchParams(location.search)
    if (params.get('preview') === '1' && !userLogged) {
      return <ErrorPage error={{ type: 'cscloginrequired' }} />
    }
  }
  return <ErrorPage error={{ type: 'notfound' }} />
}

DatasetError.propTypes = {
  userLogged: PropTypes.bool.isRequired,
}

function DatasetLoadSpinner() {
  return (
    <LoadingSplash>
      <Loader active />
    </LoadingSplash>
  )
}

function RelatedDatasetLoadSpinner() {
  return (
    <LoadingSplash margin="1rem">
      <Loader active color="white" />
    </LoadingSplash>
  )
}

function StateInfo({ children }) {
  const {
    DatasetQuery: {
      results: { removed, deprecated },
    },
  } = useStores()
  if (removed) return <div className="fd-alert fd-danger">{children}</div>
  if (deprecated) return <DraftInfo>{children}</DraftInfo>
  return null
}

function OtherIdentifiers({ identifiers }) {
  return identifiers.map(identifier => (
    <div key={identifier.identifier}>
      <Translate
        with={{ identifier: identifier.identifier }}
        content="tombstone.urlToOtherIdentifier"
      />
      <> </>
      <Translate
        href={identifier.metax_identifier}
        component={Link}
        content="tombstone.linkTextToOtherIdentifier"
      />
    </div>
  ))
}

OtherIdentifiers.propTypes = {
  identifiers: PropTypes.array.isRequired,
}

function Relations({ relations }) {
  const {
    Locale: { lang },
  } = useStores()

  return relations.map(relation => (
    <div key={relation.identifier}>
      <Translate with={{ type: relation.type.pref_label[lang] }} content="tombstone.urlToRelated" />
      <> </>
      <Translate
        href={relation.metax_identifier}
        component={Link}
        content="tombstone.linkTextToRelated"
      />
    </div>
  ))
}

Relations.propTypes = {
  relations: PropTypes.array.isRequired,
}

function RelatedDatasets({ relatedDatasetsInfo }) {
  const {
    DatasetQuery: {
      results: { removed },
    },
  } = useStores()

  if (!removed || !relatedDatasetsInfo) return null

  return (
    <>
      <OtherIdentifiers identifiers={relatedDatasetsInfo.otherIdentifiers} />
      <Relations relations={relatedDatasetsInfo.relations} />
    </>
  )
}

RelatedDatasets.propTypes = {
  relatedDatasetsInfo: PropTypes.shape({
    otherIdentifiers: PropTypes.array,
    relations: PropTypes.array,
  }),
}

RelatedDatasets.defaultProps = {
  relatedDatasetsInfo: null,
}

function DatasetView({ versionInfo }) {
  const {
    Accessibility,
    DatasetQuery: {
      results: dataset,
      emailInfo,
      Files: { root },
      cumulative_state: cumulativeState,
    },
  } = useStores()
  const {
    data_catalog: { catalog_json: catalogJson },
  } = dataset

  const { identifier } = useParams()

  const harvested = catalogJson?.harvested
  const cumulative = cumulativeState === 1
  const hasV2Files = root?.directChildCount > 0
  const hasFiles = !!hasV2Files
  const hasRemote = dataset?.research_dataset.remote_resources !== undefined

  const isDraft = dataset?.state === 'draft'
  let draftInfoText = null
  if (isDraft) {
    draftInfoText = dataset.draft_of ? 'dataset.draftInfo.changes' : 'dataset.draftInfo.draft'
  }

  return (
    <div>
      <CitationModal />
      <article className="container regular-row">
        <div className="row">
          <div className="col-12">
            <div>
              <StateInfo>
                <Translate component={StateHeader} content={versionInfo.stateInfo} />
                {versionInfo.urlText && <Translate content={versionInfo.urlText} />}
                {versionInfo.ID && (
                  <>
                    <> </>
                    <Link
                      href={versionInfo.ID}
                      target="_blank"
                      rel="noopener noreferrer"
                      content={'tombstone.link'}
                    >
                      <Translate content={versionInfo.linkToOtherVersion} />
                    </Link>
                  </>
                )}
                <RelatedDatasets relatedDatasetsInfo={versionInfo.relatedDatasetsInfo} />
                {versionInfo.fetchingRelated && <RelatedDatasetLoadSpinner />}
              </StateInfo>
            </div>
            <BackButton
              exact
              to="/datasets"
              onClick={() => {
                Accessibility.announce(translate('changepage', { page: translate('nav.datasets') }))
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
            emails={emailInfo}
            versionTitles={versionInfo.versionTitles}
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

DatasetView.propTypes = {
  versionInfo: PropTypes.object.isRequired,
}

const StateHeader = styled.p`
  font-weight: bold;
  &:last-child {
    margin-bottom: 0;
  }
`

const LoadingSplash = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: ${({ margin = 0 }) => margin};
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
}

StateInfo.propTypes = {
  children: PropTypes.node.isRequired,
}

export default withStores(observer(Dataset))
