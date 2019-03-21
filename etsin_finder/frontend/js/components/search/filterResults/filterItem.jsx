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
import PropTypes from 'prop-types'

import ElasticQuery from '../../../stores/view/elasticquery'

export default class FilterItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      term: this.props.term,
      key: this.props.item.key,
      doc_count: this.props.item.doc_count,
    }
    this.updateFilter = this.updateFilter.bind(this)
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      doc_count: newProps.item.doc_count,
      term: newProps.term,
    })
  }

  updateFilter() {
    ElasticQuery.updateFilter(this.state.term, this.state.key)
    ElasticQuery.queryES()
  }

  isActive() {
    if (
      ElasticQuery.filter.filter(
        item => item.term === this.props.term && item.key === this.props.item.key
      ).length > 0
    ) {
      return true
    }
    return false
  }

  render() {
    return (
      <li>
        <button
          role="switch"
          type="button"
          tabIndex={this.props.tabIndex}
          className={this.isActive() ? 'active' : undefined}
          aria-checked={this.isActive()}
          onClick={() => {
            this.updateFilter()
          }}
        >
          {`${this.state.key} (${this.state.doc_count})`}
        </button>
      </li>
    )
  }
}

FilterItem.propTypes = {
  term: PropTypes.string.isRequired,
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    doc_count: PropTypes.number.isRequired,
  }).isRequired,
  tabIndex: PropTypes.string.isRequired,
}
