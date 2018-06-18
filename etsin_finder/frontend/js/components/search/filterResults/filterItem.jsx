{
/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */
}

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import ElasticQuery from '../../../stores/view/elasticquery'

class FilterItem extends Component {
  constructor(props) {
    super(props)
    const active =
      ElasticQuery.filter.filter(
        item => item.term === this.props.term && item.key === this.props.item.key
      ).length > 0
    this.state = {
      term: this.props.term,
      key: this.props.item.key,
      doc_count: this.props.item.doc_count,
      active,
    }
    this.updateFilter = this.updateFilter.bind(this)
  }

  componentWillReceiveProps(newProps) {
    const active =
      ElasticQuery.filter.filter(
        item => item.term === this.props.term && item.key === this.props.item.key
      ).length > 0
    this.setState({
      doc_count: newProps.item.doc_count,
      active,
    })
  }

  updateFilter() {
    ElasticQuery.updateFilter(this.state.term, this.state.key, this.props.history)
    const active =
      ElasticQuery.filter.filter(
        item => item.term === this.props.term && item.key === this.props.item.key
      ).length > 0
    this.setState({
      active,
    })
    ElasticQuery.queryES()
  }

  render() {
    return (
      <li>
        <button
          tabIndex={this.props.tabIndex}
          className={this.state.active ? 'active' : undefined}
          onClick={() => {
            this.updateFilter()
          }}
        >
          {this.state.key} ({this.state.doc_count})
        </button>
      </li>
    )
  }
}

export default withRouter(FilterItem)

FilterItem.propTypes = {
  term: PropTypes.string.isRequired,
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    doc_count: PropTypes.number.isRequired,
  }).isRequired,
  history: PropTypes.object.isRequired,
  tabIndex: PropTypes.string.isRequired,
}
