import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import FilterSection from './filterSection';

class FilterResults extends Component {
  render() {
    console.log('Render: Filter Results')
    return (
      <div className="search-filtering">
        <FilterSection
          aggregation="organization"
          history={this.props.history}
        />
        <FilterSection
          aggregation="creator"
          history={this.props.history}
        />
        <FilterSection
          aggregation="field_of_science"
          history={this.props.history}
        />
        <FilterSection
          aggregation="keyword"
          history={this.props.history}
        />
      </div>
    );
  }
}

export default withRouter(FilterResults);
