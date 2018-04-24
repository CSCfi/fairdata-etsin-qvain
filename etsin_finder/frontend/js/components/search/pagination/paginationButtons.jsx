import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import ElasticQuery from 'Stores/view/elasticquery'
import { TransparentButton } from '../../general/button'

class PaginationButtons extends Component {
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
      const pages = Math.ceil(ElasticQuery.results.total / ElasticQuery.perPage)
      this.setState(
        {
          currentPage: parseInt(ElasticQuery.pageNum, 10),
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
      const pages = Math.ceil(ElasticQuery.results.total / ElasticQuery.perPage)
      this.setState(
        {
          currentPage: parseInt(ElasticQuery.pageNum, 10),
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
        this.checkBefore().then(() => {
          this.pagesBefore()
        })
        this.checkAfter().then(() => {
          this.pagesAfter()
        })
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
    ElasticQuery.updatePageNum(value, this.props.history)
    ElasticQuery.queryES()
    // scrolls back to top of page
    window.scrollTo(0, 0)
  }

  singlePage(value, link) {
    if (value === '...') {
      return (
        <li>
          <span className="pagination-item pagination-rest">
            <span className="sr-only">Skipped pages indicator</span>
            <span aria-hidden="true">...</span>
          </span>
        </li>
      )
    }
    return (
      <li key={`pagination-${value}`}>
        {link ? (
          <button
            onClick={e => {
              this.changePage(e, value)
            }}
            className="pagination-item"
          >
            <span className="sr-only">page </span>
            {value}
          </button>
        ) : (
          <span className="pagination-item current">
            <span className="sr-only">current page</span>
            <span aria-hidden="true">{value}</span>
          </span>
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
      <ul className="pagination">
        {this.state.currentPage > 1 && (
          <TransparentButton
            onClick={e => {
              this.changePage(e, this.state.currentPage - 1)
            }}
          >
            {'<'} Previous page
          </TransparentButton>
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
          <TransparentButton
            onClick={e => {
              this.changePage(e, this.state.currentPage + 1)
            }}
          >
            Next page {'>'}
          </TransparentButton>
        )}
      </ul>
    )
  }

  render() {
    if (!this.state.pageAmount) {
      return null
    }
    return (
      <div className="pagination-container col-lg-12">
        <p id="pagination-label" className="pagination-label sr-only" aria-hidden="true">
          Pagination
        </p>
        {this.createPagination()}
      </div>
    )
  }
}

PaginationButtons.propTypes = {
  history: PropTypes.object.isRequired,
}

export default withRouter(PaginationButtons)
