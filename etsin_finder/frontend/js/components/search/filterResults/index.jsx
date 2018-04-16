import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import FilterSection from './filterSection'

class FilterResults extends Component {
  render() {
    return (
      <div className="search-filtering">
        <FilterSection aggregation="organization" />
        <FilterSection aggregation="creator" />
        <FilterSection aggregation="field_of_science" />
        <FilterSection aggregation="keyword" />
        <FilterSection aggregation="infrastructure" />
        <FilterSection aggregation="project" />
        <FilterSection aggregation="file_type" />
      </div>
    )
  }
}

export default withRouter(FilterResults)
