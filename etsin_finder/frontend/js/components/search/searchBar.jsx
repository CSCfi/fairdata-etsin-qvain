import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import counterpart from 'counterpart'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'

import { Search } from '../../routes'
import ElasticQuery from '../../stores/view/elasticquery'
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
          <SearchContainer>
            <SearchInner>
              <FontAwesomeIcon icon={faSearch} size="2x" transform="shrink-4" />
              <input
                id="searchBarInput"
                placeholder={this.state.placeholder}
                value={this.state.query}
                onChange={this.handleChange}
                ref={this.props.inputRef}
              />
            </SearchInner>
          </SearchContainer>
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

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
`

const SearchInner = styled.div`
  max-width: 800px;
  width: 100%;
  position: relative;
  display: flex;
  svg {
    position: absolute;
    color: ${props => props.theme.color.primary};
    height: 100%;
    margin: 0 0.3em;
    right: 0px;
  }
  input {
    width: 100%;
    padding: 0.8em 1.5em;
    padding-right: 30px;
    border: 0;
    border-radius: 0.3em;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
    color: ${props => props.theme.color.gray};
    font-size: 1em;
    letter-spacing: 1px;
    &::placeholder {
      color: ${props => props.theme.color.medgray};
      font-style: italic;
    }
  }
  i {
    color: ${props => props.theme.color.primary};
    transform: scale(0.9);
  }
`

export default withRouter(SearchBar)
