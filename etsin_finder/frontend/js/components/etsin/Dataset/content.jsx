import styled from 'styled-components'
import { observer } from 'mobx-react'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { useStores } from '@/stores/stores'
import etsinTheme from '@/styles/theme'

import Description from './Description'
import Data from './data'
import Events from './events'
import Tabs from './tabs'
import Maps from './maps'

const Content = () => {
  const {
    Etsin: {
      EtsinDataset: { identifier, hasData, hasEventsAndIdentifiers, hasMapData },
    },
  } = useStores()

  const location = useLocation()

  let query = ''
  const params = new URLSearchParams(location.search)
  if (params.get('preview') === '1') {
    query = '?preview=1'
  }

  return (
    <MarginAfter>
      <Tabs
        location={location}
        showData={hasData}
        showEvents={hasEventsAndIdentifiers}
        showMaps={hasMapData}
      />

      <Routes>
        {/* Initial route */}
        <Route
          path=""
          element={
            <Description
              id="tab-description"
              aria-labelledby="tab-for-description"
              role="tabpanel"
            />
          }
        />

        {/* Route to downloads */}
        {hasData && (
          <Route
            path="/data"
            element={<Data id="tab-data" aria-labelledby="tab-for-data" role="tabpanel" />}
          />
        )}

        {/* Route to Events */}
        {hasEventsAndIdentifiers && (
          <Route
            path="/events"
            element={<Events id="tab-events" aria-labelledby="tab-for-events" role="tabpanel" />}
          />
        )}

        {/* Route to Maps */}
        {hasMapData && (
          <Route
            path="/maps"
            element={<Maps id="tab-maps" aria-labelledby="tab-for-maps" role="tabpanel" />}
          />
        )}
        <Route path="*" element={<Navigate to={`/dataset/${identifier}${query}`} replace />} />
      </Routes>
    </MarginAfter>
  )
}

export default observer(Content)

const MarginAfter = styled.div`
  padding-bottom: 1.5rem;
  margin: 1em 0;
  border-radius: 0.5rem 0.5rem 0rem 0rem;
  box-shadow: 0px 4px 7px 3px ${etsinTheme.color.primaryLight};
  height: auto;

  & .tabContent {
    margin: 1.5em;
    margin-bottom: 0.5em;
  }
`
