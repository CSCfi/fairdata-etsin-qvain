import React from 'react';
import FancyRoute from '../components/general/fancyRoute'
import Dataset from '../components/dataset';
import FrontPage from '../components/frontpage'
import Search from '../components/search';

export default class Content extends React.Component {
  render() {
    return (
      <div className="content">
        <FancyRoute
          exact
          path="/"
          component={FrontPage}
        />
        <FancyRoute
          exact
          path="/datasets/:query?"
          component={Search}
        />
        <FancyRoute path="/dataset/:identifier" component={Dataset} />
      </div>
    );
  }
}
