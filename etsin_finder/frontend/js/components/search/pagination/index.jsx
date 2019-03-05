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
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import ElasticQuery from '../../../stores/view/elasticquery'
import Accessibility from '../../../stores/view/accessibility'

class Pagination extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageAmount: 0,
      after: [],
      before: [],
    }
    this.beforeCounter = 0
    this.afterCounter = 0
    this.changePage = this.changePage.bind(this)
    this.checkAround = this.checkAround.bind(this)
    this.checkAfter = this.checkAfter.bind(this)
    this.checkBefore = this.checkBefore.bind(this)
    this.createPagination = this.createPagination.bind(this)
  }
  componentWillMount() {
    if (!this.pageAmount) {
      const pages = Math.ceil(this.props.totalResults / this.props.perPage)
      this.setState(
        {
          currentPage: parseInt(this.props.currentPage, 10),
          pageAmount: pages,
        },
        () => {
          this.checkAround()
        }
      )
    }
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.loading) {
      const pages = Math.ceil(this.props.totalResults / this.props.perPage)
      this.setState(
        {
          currentPage: parseInt(this.props.currentPage, 10),
          pageAmount: pages,
        },
        () => {
          this.checkAround()
        }
      )
    }
  }

  checkAround() {
    this.setState(
      {
        after: [],
        before: [],
      },
      () => {
        this.beforeCounter = 0
        this.afterCounter = 0
        this.checkBefore().then(() => this.pagesBefore())
        this.checkAfter().then(() => this.pagesAfter())
      }
    )
  }

  checkBefore() {
    return new Promise(resolve => {
      while (this.state.currentPage - this.beforeCounter > 1 && this.beforeCounter < 7) {
        this.beforeCounter += 1
      }
      resolve()
    })
  }

  checkAfter() {
    return new Promise(resolve => {
      while (
        this.state.currentPage + this.afterCounter < this.state.pageAmount &&
        this.afterCounter < 7
      ) {
        this.afterCounter += 1
      }
      resolve()
    })
  }

  changePage(event, value) {
    ElasticQuery.updatePageNum(value)
    ElasticQuery.queryES()
    Accessibility.announce(translate('search.pagination.changepage', { value }))
    Accessibility.resetFocus()
  }

  singlePage(value, link) {
    if (value === '...') {
      return (
        <li>
          <PaginationItem className="pagination-rest d-none d-md-block">
            <span className="sr-only">
              <Translate content="search.pagination.SRskipped" />
            </span>
            <span aria-hidden="true">...</span>
          </PaginationItem>
        </li>
      )
    }
    return (
      <li key={`pagination-${value}`}>
        {link ? (
          <PaginationButton
            onClick={e => {
              this.changePage(e, value)
            }}
          >
            <Translate content="search.pagination.SRpage" className="sr-only" /> {value}
          </PaginationButton>
        ) : (
          <PaginationButton className="current" disabled aria-disabled="true">
            <Translate content="search.pagination.SRcurrentpage" className="sr-only" /> {value}
          </PaginationButton>
        )}
      </li>
    )
  }

  pagesBefore() {
    const pagesAll = []
    let pages = []
    for (let i = 1; i < this.beforeCounter; i += 1) {
      pagesAll.push(this.singlePage(this.state.currentPage - i, true))
    }
    if (this.afterCounter < 4) {
      pages = pagesAll.slice(0, 3 + (2 - (this.afterCounter - 1))) // atleast 2, max 4
    } else {
      pages = pagesAll.slice(0, 2)
    }
    this.setState({
      before: pages.reverse(),
    })
  }

  pagesAfter() {
    const pagesAll = []
    let pages = []
    for (let i = 1; i < this.afterCounter; i += 1) {
      pagesAll.push(this.singlePage(this.state.currentPage + i, true))
    }
    if (this.beforeCounter < 4) {
      pages = pagesAll.slice(0, 3 + (2 - (this.beforeCounter - 1))) // atleast 2, max 4
    } else {
      pages = pagesAll.slice(0, 2)
    }
    this.setState({
      after: pages,
    })
  }

  restDots(where) {
    if (where === 'before') {
      if (
        (this.state.currentPage === 5 && this.state.pageAmount > 8) ||
        (this.state.pageAmount === 9 && this.state.currentPage > 5)
      ) {
        return this.singlePage(2, true)
      } else if (this.state.currentPage > 5 && this.state.pageAmount > 8) {
        return this.singlePage('...', false)
      }
    } else if (where === 'after') {
      if (
        (this.state.pageAmount - this.state.currentPage === 4 && this.state.pageAmount > 8) ||
        (this.state.pageAmount === 9 && this.state.currentPage < 5)
      ) {
        return this.singlePage(this.state.pageAmount - 1, true)
      } else if (this.state.pageAmount - this.state.currentPage > 4 && this.state.pageAmount > 8) {
        return this.singlePage('...', false)
      }
    }
    return null
  }

  createPagination() {
    return (
      <ul>
        {this.state.currentPage > 1 && (
          <li>
            <PaginationButton
              onClick={e => {
                this.changePage(e, this.state.currentPage - 1)
              }}
            >
              <span aria-hidden>{'<'}</span>{' '}
              <Translate content="search.pagination.prev" className="sr-only" />
            </PaginationButton>
          </li>
        )}
        {// first page
        this.state.currentPage !== 1 && this.singlePage(1, true)}
        {this.restDots('before')}
        {// pages before
        this.state.before.map(single => single)}
        {this.singlePage(this.state.currentPage, false)} {/* currentpage */}
        {// pages after
        this.state.after.map(single => single)}
        {this.restDots('after')}
        {// last page
        this.state.currentPage !== this.state.pageAmount &&
          this.singlePage(this.state.pageAmount, true)}
        {this.state.currentPage < this.state.pageAmount && (
          <li>
            <PaginationButton
              onClick={e => {
                this.changePage(e, this.state.currentPage + 1)
              }}
            >
              <Translate content="search.pagination.next" className="sr-only" />{' '}
              <span aria-hidden>{'>'}</span>
            </PaginationButton>
          </li>
        )}
      </ul>
    )
  }

  render() {
    if (!this.state.pageAmount) {
      return null
    }
    return (
      <PaginationContainer className="col-lg-12" aria-labelledby="pagination-label">
        <Translate
          content="search.pagination.SRpagination"
          className="pagination-label sr-only"
          aria-hidden
          id="pagination-label"
        />
        {this.createPagination()}
      </PaginationContainer>
    )
  }
}

const PaginationItem = styled.span.attrs(() => ({
  size: '40px',
}))`
  cursor: pointer;
  display: block;
  text-align: center;
  margin: 0.2em 0.2em;
  background-color: ${props => props.theme.color.lightgray};
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: ${props => props.size};
  line-height: ${props => props.size};
  color: black;
  padding: 0;
  border: 0;
  &.current {
    cursor: initial;
    background-color: ${props => props.theme.color.primary};
    color: white;
  }
  &.pagination-rest {
    cursor: initial;
    background-color: transparent;
    width: ${props => props.size};
    height: ${props => props.size};
    border-radius: ${props => props.size};
    line-height: ${props => props.size};
  }
`

const PaginationButton = PaginationItem.withComponent('button')

const PaginationContainer = styled.nav`
  margin-top: 1em;
  justify-content: center;
  flex-wrap: wrap;
  display: flex;
  ul {
    display: flex;
    padding-left: 0;
    list-style: none;
    border-radius: 0.25rem;
    flex-wrap: wrap;
  }
`

Pagination.propTypes = {
  totalResults: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
}

export default inject('Stores')(observer(Pagination))
