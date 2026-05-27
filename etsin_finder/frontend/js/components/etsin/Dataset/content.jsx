import styled from 'styled-components'
import { observer } from 'mobx-react'
import { Route, Routes, Navigate, useLocation } from 'react-router'
import { useStores } from '@/stores/stores'
import { resolveDatasetContentBorder } from '@/styles/theme'

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
    <>
      <Tabs
        location={location}
        showData={hasData}
        showEvents={hasEventsAndIdentifiers}
        showMaps={hasMapData}
      />

      <MarginAfter>
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
              element={
                <Events id="tab-events" aria-labelledby="tab-for-events" role="tabpanel" />
              }
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
    </>
  )
}

export default observer(Content)

const MarginAfter = styled.div`
  padding-top: 1rem;
  padding-bottom: 1.5rem;
  margin: 0 1rem 0 0;
  background-color: ${p => p.theme.ui.dataset.content.backgroundColor};
  border: ${p => resolveDatasetContentBorder(p.theme)};
  border-top: ${p => p.theme.ui.dataset.content.borderTop};
  border-radius: 0.5rem 0.5rem 0rem 0rem;
  box-shadow: ${p => p.theme.ui.dataset.content.boxShadow};
  height: auto;

  & .tabContent {
    margin: 1.5em;
    margin-top: 2.25em;
    margin-bottom: 0.5em;
  }
`
