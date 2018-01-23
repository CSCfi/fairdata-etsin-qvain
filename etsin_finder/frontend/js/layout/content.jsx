import React from 'react'
import { Switch } from 'react-router-dom'
import Dataset from '../components/dataset'
import Search from '../components/search'
import FrontPage from '../components/frontpage'
import FancyRoute from '../components/general/fancyRoute'

export default class Content extends React.Component {
  render() {
    return (
      <div id="content" className="content" ref={this.props.contentRef} tabIndex="-1" >
        <Switch>
          <FancyRoute
            exact
            path="/"
            component={FrontPage}
          />
          <FancyRoute
            path="/datasets/:query?"
            component={Search}
          />
          <FancyRoute
            path="/dataset/:identifier"
            component={Dataset}
          />
        </Switch>
      </div>
    );
  }
}
