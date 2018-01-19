import React, { Component } from 'react';
import ElasticQuery from '../../../stores/view/elasticquery'

export default class FilterItem extends Component {
  constructor(props) {
    super(props)
    const active = ElasticQuery.filter
      .filter((item) => item.term === this.props.term && item.key === this.props.item.key).length > 0
    this.state = {
      term: this.props.term,
      key: this.props.item.key,
      doc_count: this.props.item.doc_count,
      active,
    }
  }

  render() {
    return (
      <li>
        <button
          tabIndex="-1"
          className={this.state.active ? 'active' : undefined}
          onClick={() => {
            ElasticQuery.updateFilter(this.state.term, this.state.key)
            ElasticQuery.queryES()
          }}
        >
          { this.state.key } ({ this.state.doc_count })
        </button>
      </li>
    );
  }
}
