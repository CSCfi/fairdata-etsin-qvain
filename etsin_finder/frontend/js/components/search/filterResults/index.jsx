import React, { Component } from 'react';

import FilterSection from './filterSection';

class FilterResults extends Component {
  render() {
    console.log('Render: Filter Results')
    return (
      <div className="search-filtering">
        <FilterSection
          aggregation="organization"
        />
        <FilterSection
          aggregation="creator"
        />
        <FilterSection
          aggregation="field_of_science"
        />
        <FilterSection
          aggregation="keyword"
        />
      </div>
    );
  }
}

export default FilterResults;
