import { useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Home, Search, Dataset, Qvain, QvainDatasetsV2 } from '../routes'
import ErrorPage from '@/components/general/errorpage'

import QvainLandingPage from '@/components/qvain/views/landingPage'
import { useStores } from '@/utils/stores'
import LoggedInRoute from './loggedInRoute'

const Content = ({ contentRef }) => {
  const {
    Auth,
    Env: { isQvain, separateQvain, getQvainUrl, Flags },
    Matomo: { changeService },
    Accessibility,
  } = useStores()

  useEffect(() => {
    Accessibility.handleNavigation()
    if (isQvain) {
      changeService('QVAIN')
    } else {
      changeService('ETSIN')
    }
  }, [Accessibility, isQvain, changeService])

  if (Auth.initializing) return null

  const maintenance = isQvain && Flags.flagEnabled('QVAIN.MAINTENANCE')
  if (maintenance) {
    const query = new URLSearchParams(window.location.search)
    if (query.get('disable_redirect') !== 'true') {
      window.location.replace('https://www.fairdata.fi/maintenance/')
    }
  }

  return (
    <main className="content">
      <span ref={contentRef} tabIndex="-1" />
      <Routes>
        {separateQvain && <Route path="/qvain" element={<NavigateToQvain />} />}
        {separateQvain && <Route path="/qvain/*" element={<NavigateToQvain />} />}
        {!isQvain && [
          <Route path="/" key="home" element={<Home />} />,
          <Route path="/datasets/:query?" key="search" element={<Search />} />,
          <Route path="/dataset/:identifier/*" key="dataset" element={<Dataset />} />,
        ]}
        {maintenance && (
          <Route path={getQvainUrl('')}>
            <QvainLandingPage />
          </Route>
        )}
        <Route
          path={getQvainUrl('/dataset/:identifier?')}
          element={
            <LoggedInRoute>
              <Qvain />
            </LoggedInRoute>
          }
        />
        <Route
          path={getQvainUrl('')}
          element={
            <LoggedInRoute notLoggedIn={<QvainLandingPage />}>
              <QvainDatasetsV2 />
            </LoggedInRoute>
          }
        />
        <Route path="*" element={<ErrorPage error={{ type: 'error' }} />} />
      </Routes>
    </main>
  )
}

Content.propTypes = {
  contentRef: PropTypes.object.isRequired,
}

export default observer(Content)

const NavigateToQvain = () => {
  // redirect /qvain to the new qvain app url
  const {
    Env: {
      isQvain,
      getQvainUrl,
      history: { location },
    },
  } = useStores()

  const path = location.pathname.replace(/^\/qvain/, '') || '/'
  if (isQvain) {
    // already in qvain, just remove /qvain from path
    return <Navigate to={path} replace />
  }
  // not in qvain, redirect to qvain domain
  const url = getQvainUrl(path)
  window.location.replace(url)
  return ''
}
