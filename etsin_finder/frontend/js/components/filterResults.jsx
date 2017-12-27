import React, { Component } from 'react';

import FilterSection from './filterSection';

class FilterResults extends Component {
  render() {
    return (
      <div className="search-filtering">
        <FilterSection aggregation="organization" aggregations={this.props.aggregations} />
        <FilterSection aggregation="creator" aggregations={this.props.aggregations} />
        <FilterSection aggregation="field_of_science" aggregations={this.props.aggregations} />
        <FilterSection aggregation="keyword" aggregations={this.props.aggregations} />
      </div>
    );
  }
}

export default FilterResults;
