import React, { Component } from 'react';

import FilterSection from './filterSection';

class FilterResults extends Component {
  render() {
    return (
      <div className="search-filtering">
        <FilterSection
          aggregation="organization"
          aggregations={this.props.aggregations}
          handleFilter={this.props.handleFilter}
        />
        <FilterSection
          aggregation="creator"
          aggregations={this.props.aggregations}
          handleFilter={this.props.handleFilter}
        />
        <FilterSection
          aggregation="field_of_science"
          aggregations={this.props.aggregations}
          handleFilter={this.props.handleFilter}
        />
        <FilterSection
          aggregation="keyword"
          aggregations={this.props.aggregations}
          handleFilter={this.props.handleFilter}
        />
      </div>
    );
  }
}

export default FilterResults;
