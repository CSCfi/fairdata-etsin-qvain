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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { observer } from 'mobx-react'

import ErrorBoundary from '../general/errorBoundary'
import { withStores } from '@/stores/stores'
import Input from '../dataset/common/formItems'

class SearchBar extends Component {
  // Handle possible empty initial query
  state = {
    query: this.props.Stores.ElasticQuery.search || '',
    placeholder: counterpart('search.placeholder'),
  }

  componentDidMount() {
    counterpart.onLocaleChange(this.localeChanged)
  }

  componentWillUnmount() {
    counterpart.offLocaleChange(this.localeChanged)
  }

  localeChanged = () => {
    this.setState({
      placeholder: counterpart('search.placeholder'),
    })
  }

  handleChange = event => {
    this.setState({ query: event.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { ElasticQuery, Matomo } = this.props.Stores

    Matomo.recordEvent(`SEARCH / ${this.state.query}`)
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
              <IconContainer>
                <CustomFontAwesomeIcon
                  onClick={this.handleSubmit}
                  icon={faSearch}
                  title="Search"
                  transform="shrink-4"
                />
              </IconContainer>
              <Input
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
  Stores: PropTypes.object.isRequired,
  inputRef: PropTypes.func,
}

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
`

const IconContainer = styled.div`
  height: 100%;
  padding: 0.25rem;
  position: absolute;
  right: 0px;
  padding-bottom: 0.8em;
  display: flex;
  align-items: center;
`

const CustomFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 2.4rem;
  cursor: pointer;
  color: ${props => props.theme.color.primary};
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
      color: ${props => props.theme.color.dark};
      font-style: italic;
    }
  }
`
export default withStores(observer(SearchBar))
