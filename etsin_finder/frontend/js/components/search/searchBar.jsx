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
import counterpart from 'counterpart'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'

import { Search } from '../../routes'
import ElasticQuery from '../../stores/view/elasticquery'
import ErrorBoundary from '../general/errorBoundary'

export default class SearchBar extends Component {
  constructor(props) {
    super(props)

    // Handle possible empty initial query
    this.state = {
      query: ElasticQuery.search || '',
      placeholder: counterpart('search.placeholder'),
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
    ElasticQuery.updateSearch(this.state.query)
    ElasticQuery.queryES(false)
  }

  render() {
    return (
      <ErrorBoundary>
        <form onSubmit={e => this.handleSubmit(e)} role="search">
          <SearchContainer>
            <SearchInner>
              <label htmlFor="searchBarInput" className="sr-only">
                {counterpart('search.name')}
              </label>
              <CustomFontAwesomeIcon
                onClick={this.handleSubmit}
                icon={faSearch}
                size="2x"
                transform="shrink-4"
              />
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
  inputRef: PropTypes.func,
}

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
`

const CustomFontAwesomeIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  position: absolute;
  color: ${props => props.theme.color.primary};
  height: 100%;
  margin: 0 0.3em;
  right: 0px;
  transition: 0.1s ease;
  &:active {
    transform: scale(0.9);
  }
`

const SearchInner = styled.div`
  max-width: 800px;
  width: 100%;
  position: relative;
  display: flex;
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
`
