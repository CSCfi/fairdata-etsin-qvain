import React from 'react';
import { Route } from 'react-router-dom';
import Dataset from '../dataset';
import SearchPage from '../search';

export default class Content extends React.Component {
  render() {
    return (
      <div className="content">
        <Route
          exact
          path="/"
          component={SearchPage}
        />
        <Route
          path="/datasets"
          render={() => (
            <div className="datasets">
              <div className="container">
                <h2 className="text-center">All Datasets</h2>
              </div>
            </div>
        )}
        />
        <Route path="/dataset/:identifier" component={Dataset} />
      </div>
    );
  }
}
