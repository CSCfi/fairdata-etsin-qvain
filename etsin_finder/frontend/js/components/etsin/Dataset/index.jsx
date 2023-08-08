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
import { NavLink, useLocation } from 'react-router-dom'
import { opacify } from 'polished'

import { withStores, useStores } from '@/stores/stores'
import ErrorPage from '@/components/general/errorpage'
import ErrorBoundary from '@/components/general/errorBoundary'
import Loader from '@/components/general/loader'

import CitationModal from './citation/citationModal'
import Sidebar from './Sidebar'
import Content from './content'
import TitleContainer from './TitleContainer'

const BackButton = styled(NavLink)`
  color: ${props => props.theme.color.primary};
  padding: 0;
  margin: 0 0 0.5em 0;
`

class Dataset extends React.Component {
  constructor(props) {
    super(props)

    this.query = this.query.bind(this)
  }

  componentDidMount() {
    this.props.Stores.Accessibility.resetFocus()
    this.query()
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.props.match.params.identifier !== newProps.match.params.identifier) {
      this.query(newProps.match.params.identifier)
    }
  }

  componentDidUpdate() {
    window.onbeforeunload = this.props.Stores.Etsin.reset
  }

  query(customId) {
    const {
      Etsin: { fetchData, setCustomError },
    } = this.props.Stores
    let identifier = this.props.match.params.identifier
    if (customId !== undefined) {
      identifier = customId
    }

    // in production integer based identifiers are not permitted.
    if (BUILD === 'production' && /^\d+$/.test(identifier)) {
      console.log('Using integer as identifier not permitted')
      setCustomError('error.invalidIdentifier')
      return
    }

    fetchData(identifier)
  }

  render() {
    const {
      Etsin: {
        isLoading,
        allErrors,
        EtsinDataset: { dataset },
      },
    } = this.props.Stores

    if (allErrors.length) {
      return <DatasetError />
    }

    if (
      !dataset ||
      isLoading.dataset ||
      isLoading.versions ||
      isLoading.relations ||
      isLoading.files
    ) {
      return <DatasetLoadSpinner />
    }

    return <DatasetView />
  }
}

function DatasetError() {
  const {
    Auth: { cscUserLogged },
    Etsin: { errors },
  } = useStores()
  const location = useLocation()

  // If url has preview (etsin.fairdata.fi?preview=1), the User must be logged in.
  if (location && location.search) {
    const params = new URLSearchParams(location.search)
    if (params.get('preview') === '1' && !cscUserLogged) {
      return <ErrorPage loginRequired errors={[{ translation: 'error.cscLoginRequired' }]} />
    }
  }
  return <ErrorPage errors={errors.dataset} />
}

function DatasetLoadSpinner() {
  return (
    <LoadingSplash margin="2rem">
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
    Etsin: {
      EtsinDataset: { isRemoved, isDeprecated },
    },
  } = useStores()
  if (isRemoved) return <div className="fd-alert fd-danger">{children}</div>
  if (isDeprecated) return <DraftInfo>{children}</DraftInfo>
  return null
}

function OtherIdentifiers() {
  const {
    Etsin: {
      EtsinDataset: {
        groupedRelations: { otherIdentifiers },
      },
    },
  } = useStores()
  return otherIdentifiers.map(identifier => (
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

function Relations() {
  const {
    Locale: { lang },
    Etsin: {
      EtsinDataset: {
        groupedRelations: { relations },
      },
    },
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

function RelatedDatasets() {
  const {
    Etsin: {
      EtsinDataset: { groupedRelations },
    },
  } = useStores()

  if (!groupedRelations) return null

  return (
    <>
      <OtherIdentifiers identifiers={groupedRelations.otherIdentifiers} />
      <Relations relations={groupedRelations.relations} />
    </>
  )
}

function DatasetView() {
  const {
    Accessibility,
    Etsin: {
      EtsinDataset: {
        latestExistingVersionInfotext,
        latestExistingVersionId,
        tombstoneInfotext,
        isDraft,
        draftInfotext,
      },
      isLoading,
    },
  } = useStores()

  return (
    <div>
      <CitationModal />
      <article className="container regular-row">
        <div className="row">
          <div className="col-12">
            <div>
              <StateInfo>
                <Translate component={StateHeader} content={tombstoneInfotext} />
                {latestExistingVersionInfotext?.urlText && (
                  <Translate content={latestExistingVersionInfotext?.urlText} />
                )}
                {latestExistingVersionId && (
                  <>
                    <> </>
                    <Link
                      href={latestExistingVersionId}
                      target="_blank"
                      rel="noopener noreferrer"
                      content={'tombstone.link'}
                    >
                      <Translate content={latestExistingVersionInfotext?.linkToOtherVersion} />
                    </Link>
                  </>
                )}
                <RelatedDatasets />
                {isLoading.relations && <RelatedDatasetLoadSpinner />}
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
          {isDraft && (
            <div className="col-12">
              <Translate component={DraftInfo} content={draftInfotext} />
            </div>
          )}
          <MarginAfter className="col-lg-8">
            <TitleContainer />
            <Content />
          </MarginAfter>
          <MarginAfter className="col-lg-4">
            <ErrorBoundary>
              <Sidebar />
            </ErrorBoundary>
          </MarginAfter>
        </div>
      </article>
    </div>
  )
}

const MarginAfter = styled.div`
  margin-bottom: 1em;
`

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
  match: PropTypes.object.isRequired,
}

StateInfo.propTypes = {
  children: PropTypes.node.isRequired,
}

export default withStores(observer(Dataset))
