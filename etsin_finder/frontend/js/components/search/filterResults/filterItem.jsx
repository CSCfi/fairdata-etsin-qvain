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

import { withStores } from '../../../utils/stores'

class FilterItem extends Component {
  state = {
    term: this.props.term,
    key: this.props.item.key,
    doc_count: this.props.item.doc_count,
  }

  updateFilter = this.updateFilter.bind(this)

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({
      doc_count: newProps.item.doc_count,
      term: newProps.term,
    })
  }

  updateFilter() {
    this.props.Stores.ElasticQuery.updateFilter(this.state.term, this.state.key)
    this.props.Stores.ElasticQuery.queryES()
  }

  isActive() {
    if (
      this.props.Stores.ElasticQuery.filter.filter(
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
  Stores: PropTypes.object.isRequired,
  term: PropTypes.string.isRequired,
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    doc_count: PropTypes.number.isRequired,
  }).isRequired,
  tabIndex: PropTypes.string.isRequired,
}

export default withStores(FilterItem)
