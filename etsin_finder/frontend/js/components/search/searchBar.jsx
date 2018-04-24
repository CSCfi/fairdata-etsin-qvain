import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import counterpart from 'counterpart'
import PropTypes from 'prop-types'

import { Search } from 'Routes'
import ElasticQuery from 'Stores/view/elasticquery'
import ErrorBoundary from '../general/errorBoundary'

class SearchBar extends Component {
  constructor(props) {
    super(props)

    // Handle possible empty initial query
    this.state = {
      query: ElasticQuery.search || '',
      placeholder: counterpart('search.placeholder'),
    }

    this.handleChange = this.handleChange.bind(this)
    this.localeChanged = this.localeChanged.bind(this)
  }

  componentWillMount() {
    counterpart.onLocaleChange(this.localeChanged)
  }
  componentWillUnmount() {
    counterpart.offLocaleChange(this.localeChanged)
  }

  localeChanged() {
    this.setState({
      placeholder: counterpart('search.placeholder'),
    })
  }

  handleChange(event) {
    Search.load()
    this.setState({ query: event.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    ElasticQuery.updateSearch(this.state.query, this.props.history)
    ElasticQuery.queryES(false)
  }

  render() {
    return (
      <ErrorBoundary>
        <form onSubmit={e => this.handleSubmit(e)}>
          <div className="search">
            <div className="searchBar inner-addon right-addon">
              <i className="fa fa-search fa-2x" data-fa-transform="shrink-4" aria-hidden="true" />
              <input
                id="searchBarInput"
                placeholder={this.state.placeholder}
                value={this.state.query}
                onChange={this.handleChange}
                ref={this.props.inputRef}
              />
            </div>
          </div>
        </form>
      </ErrorBoundary>
    )
  }
}

SearchBar.defaultProps = {
  inputRef: undefined,
}

SearchBar.propTypes = {
  history: PropTypes.object.isRequired,
  inputRef: PropTypes.func,
}

export default withRouter(SearchBar)
