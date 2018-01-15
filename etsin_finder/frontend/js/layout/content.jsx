import React from 'react';
import { Route } from 'react-router-dom';
import Dataset from '../components/dataset';
import Search from '../components/search';
import FrontPage from '../components/frontpage';

export default class Content extends React.Component {
  render() {
    return (
      <div id="content" className="content" ref={this.props.contentRef} tabIndex="-1" >
        <Route
          exact
          path="/"
          component={FrontPage}
        />
        <Route
          path="/datasets/:query?"
          component={Search}
        />
        <Route path="/dataset/:identifier" component={Dataset} />
      </div>
    );
  }
}
