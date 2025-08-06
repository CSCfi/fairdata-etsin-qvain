import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'
import { useStores } from '@/stores/stores'
import etsinTheme from '@/styles/theme'

import Description from './Description'
import Data from './data'
import Events from './events'
import Tabs from './tabs'
import Maps from './maps'

const Content = props => {
  const {
    Etsin: {
      EtsinDataset: { identifier, hasData, hasEventsAndIdentifiers, hasMapData },
    },
  } = useStores()

  let query = ''
  const params = new URLSearchParams(props.location.search)
  if (params.get('preview') === '1') {
    query = '?preview=1'
  }

  return (
    <MarginAfter>
      <Tabs
        location={props.location}
        showData={hasData}
        showEvents={hasEventsAndIdentifiers}
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
        {hasEventsAndIdentifiers && (
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

Content.propTypes = {
  location: PropTypes.object.isRequired,
}
