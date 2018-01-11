import React from 'react';
import { Route } from 'react-router-dom';
import Dataset from '../dataset';
import Datasets from '../datasets';
import SearchPage from '../search';

export default class Content extends React.Component {
  render() {
    return (
      <div id="content" className="content" ref={this.props.contentRef} tabIndex="-1" >
        <Route
          exact
          path="/"
          component={SearchPage}
        />
        <Route
          path="/datasets/:query?"
          component={Datasets}
        />
        <Route path="/dataset/:identifier" component={Dataset} />
      </div>
    );
  }
}
