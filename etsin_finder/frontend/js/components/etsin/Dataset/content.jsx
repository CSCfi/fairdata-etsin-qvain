import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'
import { useStores } from '@/stores/stores'

import Description from './Description'
import Data from './data'
import Events from './events'
import Tabs from './tabs'
import Maps from './maps'

const Content = props => {
  const {
    Etsin: {
      EtsinDataset: { identifier, hasData, hasEvents, hasMapData },
    },
  } = useStores()

  let query = ''
  const params = new URLSearchParams(props.location.search)
  if (params.get('preview') === '1') {
    query = '?preview=1'
  }

  return (
    <MarginAfter className="col-lg-8">
      <Tabs
        location={props.location}
        showData={hasData}
        showEvents={hasEvents}
        showMaps={hasMapData}
      />

      <Switch>
        {/* Initial route */}
        <Route
          exact
          path="/dataset/:identifier"
          render={() => (
            <Description
              id="tab-description"
              aria-labelledby="tab-for-description"
              role="tabpanel"
              {...props}
            />
          )}
        />

        {/* Route to downloads */}
        {hasData && (
          <Route
            exact
            path="/dataset/:identifier/data"
            render={() => (
              <Data id="tab-data" aria-labelledby="tab-for-data" role="tabpanel" {...props} />
            )}
          />
        )}

        {/* Route to Events */}
        {hasEvents && (
          <Route
            exact
            path="/dataset/:identifier/events"
            render={() => (
              <Events id="tab-events" aria-labelledby="tab-for-events" role="tabpanel" {...props} />
            )}
          />
        )}

        {/* Route to Maps */}
        {hasMapData && (
          <Route
            exact
            path="/dataset/:identifier/maps"
            render={() => (
              <Maps id="tab-maps" aria-labelledby="tab-for-maps" role="tabpanel" {...props} />
            )}
          />
        )}

        <Route>
          <Redirect to={`/dataset/${identifier}${query}`} />
        </Route>
      </Switch>
    </MarginAfter>
  )
}

export default withRouter(observer(Content))

const MarginAfter = styled.div`
  margin-bottom: 3em;
`

Content.propTypes = {
  location: PropTypes.object.isRequired,
}
