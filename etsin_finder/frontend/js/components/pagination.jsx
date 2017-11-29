import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Pagination extends Component {
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
  }

  componentWillReceiveProps(newProps) {
    if (Math.ceil(newProps.total / newProps.perPage) !== this.state.pageAmount
    || this.state.currentPage !== newProps.currentPage) {
      const pages = Math.ceil(newProps.total / newProps.perPage);
      this.setState({
        currentPage: newProps.currentPage,
        pageAmount: pages,
      }, () => {
        this.checkAround()
      })
    }
  }

  checkAround() {
    this.setState({
      after: [],
      before: [],
    }, () => {
      this.beforeCounter = 0
      this.afterCounter = 0
      this.checkBefore().then(() => {
        this.pagesBefore()
      })
      this.checkAfter().then(() => {
        this.pagesAfter()
      })
    })
  }

  // you dont want to call setState inside loop. It forces dom to rerender everytime
  checkBefore() {
    return new Promise((resolve) => {
      while (this.state.currentPage - this.beforeCounter > 1
      && this.beforeCounter < 7) {
        this.beforeCounter += 1;
      }
      resolve()
    })
  }

  checkAfter() {
    return new Promise((resolve) => {
      while (this.state.currentPage + this.afterCounter < this.state.pageAmount
      && this.afterCounter < 7) {
        this.afterCounter += 1;
      }
      resolve()
    })
  }

  changePage(event, value) {
    this.props.updatePage(value)
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
        {
          link
            ? (
              <Link
                to={`?p=${value}`}
                onClick={(e) => {
                  this.changePage(e, value)
                }}
                className="pagination-item"
              >
                <span className="sr-only">page </span>
                {value}
              </Link>
            )
            : (
              <span className="pagination-item current">
                <span className="sr-only">current page</span>
                <span aria-hidden="true">{value}</span>
              </span>
            )
        }
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
      pages = pagesAll.slice(0, (3 + (2 - (this.afterCounter - 1)))) // atleast 2, max 4
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
      pages = pagesAll.slice(0, (3 + (2 - (this.beforeCounter - 1)))) // atleast 2, max 4
    } else {
      pages = pagesAll.slice(0, 2)
    }
    this.setState({
      after: pages,
    })
  }

  restDots(where) {
    if (where === 'before') {
      if (this.state.currentPage === 5) {
        return this.singlePage(2, true)
      } else if (this.state.currentPage > 5) {
        return this.singlePage('...', false)
      }
    } else if (where === 'after') {
      if (this.state.pageAmount - this.state.currentPage === 4) {
        return this.singlePage(this.state.pageAmount - 1, true)
      } else if (this.state.pageAmount - this.state.currentPage > 4) {
        return this.singlePage('...', false)
      }
    }
    return null
  }

  render() {
    if (!this.state.pageAmount) {
      return null
    }
    return (
      <div className="pagination-container">
        <p id="pagination-label" className="pagination-label sr-only" aria-hidden="true">Pagination</p>
        <ul className="pagination">
          {this.state.currentPage > 1
          ?
            <button className="btn btn-transparent" onClick={(e) => { this.changePage(e, this.state.currentPage - 1) }}>
              {'<'} Previous page
            </button>
          : null
          }
          { // first page
            this.state.currentPage !== 1
              ? this.singlePage(1, true)
              : null
          }
          {
            this.restDots('before')
          }
          { // pages before
            this.state.before.map(single => single)
          }
          {this.singlePage(this.state.currentPage, false)} {/* currentpage */}
          { // pages after
            this.state.after.map(single => single)
          }
          {
            this.restDots('after')
          }
          { // last page
            this.state.currentPage !== this.state.pageAmount
              ? this.singlePage(this.state.pageAmount, true)
              : null
          }
          {this.state.currentPage < this.state.pageAmount
          ?
            <button className="btn btn-transparent" onClick={(e) => { this.changePage(e, this.state.currentPage + 1) }}>
              Next page {'>'}
            </button>
          : null
          }
        </ul>
      </div>
    );
  }
}
