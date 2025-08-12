import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import { opacify } from 'polished'

import { useStores } from '@/stores/stores'
import ErrorPage from '@/components/general/errorpage'
import ErrorBoundary from '@/components/general/errorBoundary'
import Loader from '@/components/general/loader'
import Translate from '@/utils/Translate'

import CitationModal from './citation/citationModal'
import Sidebar from './Sidebar'
import Content from './content'
import StateInfo from './StateInfo'
import PreservationInfo from './PreservationInfo'
import TitleContainer from './TitleContainer'
import withCustomProps from '@/utils/withCustomProps'

const BackButton = styled(NavLink)`
  color: ${props => props.theme.color.primary};
  padding: 0;
  margin: 0 0 0.5em 0;
`

const Dataset = () => {
  const oldIdentifier = useRef()
  const params = useParams()

  const {
    Accessibility: { resetFocus },
    Etsin: {
      isLoading,
      fetchData,
      setCustomError,
      allErrors,
      EtsinDataset: { dataset },
    },
  } = useStores()

  useEffect(() => {
    const identifier = params.identifier
    if (identifier != oldIdentifier.current) {
      resetFocus()
      query(identifier)
    }
    oldIdentifier.current = identifier
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const query = identifier => {
    // in production integer based identifiers are not permitted.
    if (BUILD === 'production' && /^\d+$/.test(identifier)) {
      console.log('Using integer as identifier not permitted')
      setCustomError('error.invalidIdentifier')
      return
    }

    fetchData(identifier)
  }

  if (allErrors.length) {
    return <DatasetError />
  }

  if (!dataset || isLoading.files || isLoading.versions || isLoading.dataset) {
    return <DatasetLoadSpinner />
  }
  return <DatasetView />
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

function DatasetView() {
  const {
    Accessibility,
    Locale,
    Etsin: {
      EtsinDataset: { isDraft, draftInfotext },
    },
  } = useStores()

  return (
    <div>
      <CitationModal />
      <article className="container regular-row">
        <div className="row">
          <div className="col-12">
            <StateInfo />
            <BackButton
              to="/datasets"
              onClick={() => {
                Accessibility.announce(
                  Locale.translate('changepage', { page: Locale.translate('nav.datasets') })
                )
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
            <PreservationInfo />

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
  margin: 0.8em 0 1em 0;
`

const LoadingSplash = withCustomProps(styled.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: ${({ margin = 0 }) => margin};
`

const DraftInfo = withCustomProps(styled.div)`
  background-color: ${p => p.theme.color.primaryLight};
  text-align: center;
  color: ${p => p.theme.color.primaryDark};
  border: 1px solid ${p => opacify(-0.5, p.theme.color.primary)};
  padding: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`

export default observer(Dataset)
