import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Pagination extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageAmount: 0,
      after: [],
      before: [],
      beforeCounter: 0,
      afterCounter: 0,
    }
    this.changePage = this.changePage.bind(this)
    this.checkAround = this.checkAround.bind(this)
    this.checkAfter = this.checkAfter.bind(this)
    this.checkBefore = this.checkBefore.bind(this)
  }

  componentWillReceiveProps(newProps) {
    console.log('newProps')
    if (Math.ceil(newProps.total / newProps.perPage) !== this.state.pageAmount || this.state.currentPage !== newProps.currentPage) {
      console.log('')
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
    console.log('checkPagination')
    this.setState({
      after: [],
      before: [],
      afterCounter: 0,
      beforeCounter: 0,
    }, () => {
      this.checkBefore()
      this.checkAfter()
    })
  }

  checkBefore() {
    console.log(`before: ${this.state.beforeCounter}`)
    this.setState({
      beforeCounter: this.state.beforeCounter += 1,
    }, () => {
      if (this.state.currentPage - this.state.beforeCounter > 1 && this.state.beforeCounter < 6) {
        const newBefore = this.state.before.concat(this.state.currentPage
          - this.state.beforeCounter)
        this.setState({
          before: newBefore,
        }, () => (
          this.checkBefore()
        ))
      }
    })
  }

  checkAfter() {
    console.log(`after: ${this.state.afterCounter}`)
    this.setState({
      afterCounter: this.state.afterCounter += 1,
    }, () => {
      if (this.state.currentPage + this.state.afterCounter < this.state.pageAmount
        && this.state.afterCounter < 6) {
        const newAfter = this.state.after.concat(this.state.currentPage + this.state.afterCounter)
        this.setState({
          after: newAfter,
        }, () => (
          this.checkAfter()
        ))
      }
    })
  }

  changePage(event, value) {
    console.log(value)
    this.props.updatePage(value)
  }

  singlePage(value, link, key) {
    if (value === '...') {
      return (
        <li key={key}>
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

  render() {
    if (!this.state.pageAmount) {
      return null
    }
    return (
      <div className="pagination-container">
        <p id="pagination-label" className="pagination-label sr-only" aria-hidden="true">Pagination</p>
        <ul className="pagination">
          { // first page
            this.state.currentPage !== 1
              ? this.singlePage(1, true)
              : null
          }
          { // pages before
            this.state.before.slice(0).reverse().map(number => (
              this.singlePage(number, true)
            ))
          }
          {this.singlePage(this.state.currentPage, false)} {/* currentpage */}
          { // pages after
            this.state.after.map(number => (
              this.singlePage(number, true)
            ))
          }
          { // last page
            this.state.currentPage !== this.state.pageAmount
              ? this.singlePage(this.state.pageAmount, true)
              : null
          }
        </ul>
      </div>
    );
  }
}
